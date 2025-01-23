from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
import boto3
from boto3.dynamodb.conditions import Key
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import base64
import json
from decimal import Decimal
import os
import threading
import calendar
from collections import defaultdict
import time
import random
import string
from botocore.exceptions import ClientError
from pydantic import BaseModel, EmailStr
from uuid import uuid4
from auth.token_utils import generate_otp_code, generate_tokens, verify_token
from auth.dependencies import get_current_user
from auth.database import DatabaseService
from auth.notifications import NotificationService

# -------------------------------
# 🛠️ FastAPI Setup
# -------------------------------

app = FastAPI(
    title="DynamoDB Appointments API",
    description="API to fetch open appointments and recent updates from DynamoDB",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# 🛠️ AWS Services Configuration
# -------------------------------

REGION = 'us-east-1'
DYNAMODB_ENDPOINT = os.getenv('DYNAMODB_ENDPOINT', 'http://localhost:8000')

# DynamoDB Tables
DDB_TABLE_NAME = 'Appointments'
NOTIFICATIONS_TABLE_NAME = 'Notifications'

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb', endpoint_url=DYNAMODB_ENDPOINT, region_name=REGION)
sns_client = boto3.client("sns", region_name=REGION)
ses_client = boto3.client("ses", region_name=REGION)

# Initialize services
db_service = DatabaseService(dynamodb_resource=dynamodb)
notification_service = NotificationService(sns_client=sns_client, ses_client=ses_client)

# Get table references
table = dynamodb.Table(DDB_TABLE_NAME)
notifications_table = dynamodb.Table(NOTIFICATIONS_TABLE_NAME)

# -------------------------------
# 🗂️ Cache Configuration
# -------------------------------

APPOINTMENTS_CACHE = defaultdict(list)
DAILY_AVAILABILITY = {"available": set(), "booked": set(), "unavailable": set()}
CACHE_LOCK = threading.Lock()

# -------------------------------
# 🔑 Utility Functions
# -------------------------------

def encode_next_token(last_evaluated_key: Optional[dict] = None) -> Optional[str]:
    if not last_evaluated_key:
        return None
    try:
        json_string = json.dumps(last_evaluated_key)
        return base64.urlsafe_b64encode(json_string.encode('utf-8')).decode('utf-8').rstrip('=')
    except (TypeError, ValueError) as e:
        print(f"❌ Error encoding next_token: {e}")
        return None

def decode_next_token(next_token: Optional[str]) -> Optional[dict]:
    if not next_token:
        return None
    try:
        padding = '=' * (-len(next_token) % 4)
        return json.loads(base64.urlsafe_b64decode((next_token + padding).encode('utf-8')).decode('utf-8'))
    except (base64.binascii.Error, UnicodeDecodeError, json.JSONDecodeError) as e:
        print(f"❌ Error decoding next_token: {e}")
        return None

def convert_decimal_to_native(value):
    if isinstance(value, list):
        return [convert_decimal_to_native(v) for v in value]
    if isinstance(value, dict):
        return {k: convert_decimal_to_native(v) for k, v in value.items()}
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)
    return value

# -------------------------------
# 🔄 Background Tasks
# -------------------------------

def load_appointments_to_cache():
    """Background task to query DynamoDB and cache appointments for the next 12 months."""
    global APPOINTMENTS_CACHE

    while True:
        try:
            print("🔄 Refreshing appointments cache...")
            current_date = datetime.utcnow()
            temp_cache = defaultdict(list)

            for i in range(13):
                month_date = (current_date + timedelta(days=30 * i)).replace(day=1)
                year_month = month_date.strftime("%Y-%m")

                response = table.query(
                    KeyConditionExpression=Key('year_month').eq(year_month),
                    ScanIndexForward=True,
                    ReturnConsumedCapacity='TOTAL'
                )
                
                for item in response.get('Items', []):
                    temp_cache[year_month].append(convert_decimal_to_native(item))
                time.sleep(1)

            with CACHE_LOCK:
                APPOINTMENTS_CACHE = temp_cache
            print("✅ Cache refreshed successfully!")

        except Exception as e:
            print(f"❌ Failed to preload appointments cache: {e}")

        time.sleep(30)

@app.on_event("startup")
def startup_event():
    cache_thread = threading.Thread(target=load_appointments_to_cache, daemon=True)
    cache_thread.start()

# -------------------------------
# 🔍 API Endpoints
# -------------------------------

@app.get("/")
def read_root():
    return {"message": "DynamoDB Appointments API is running!"}

    # In production, handle exceptions or ceck the response for success/failure.

# Add the auth router
from auth.routes import router as auth_router
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/appointments/recent", response_model=dict)
def fetch_recent_updates(
    limit: int = Query(10, description="Number of recent updates to fetch"),
    next_token: Optional[str] = Query(None, description="Pagination token")
):
    """
    Fetch recent updates globally, sorted by last_changed with pagination.
    """
    try:
        print("🔍 Querying RecentUpdatesIndex for recent updates...")

        query_config = {
            'IndexName': 'RecentUpdatesIndex',
            'KeyConditionExpression': Key('global_pk').eq('updates'),
            'ScanIndexForward': False,  # Descending order
            'Limit': limit,
            'ReturnConsumedCapacity': 'TOTAL'
        }

        if next_token:
            exclusive_start_key = decode_next_token(next_token)
            if exclusive_start_key:
                query_config['ExclusiveStartKey'] = exclusive_start_key
            else:
                print("⚠️ Invalid next_token provided. Ignoring and starting fresh.")

        response = table.query(**query_config)
        items = response.get('Items', [])
        for item in items:
            item.pop('year_month', None)
            item.pop('global_pk', None)
            item.pop('date_time', None)
            item["last_changed"] = int(item["last_changed"])

        items = convert_decimal_to_native(items)
        last_evaluated_key = response.get('LastEvaluatedKey')
        next_token = encode_next_token(last_evaluated_key) if last_evaluated_key else None

        consumed_capacity = response.get('ConsumedCapacity', {}).get('CapacityUnits', 0)
        print(f"🔄 DynamoDB Query consumed {consumed_capacity} RCUs.")

        return {
            'items': items,
            'next_token': next_token
        }
    except Exception as e:
        print(f"❌ Failed to fetch recent updates: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------
# 📅 Fetch Daily Availability
# -------------------------------

@app.get("/appointments/daily", response_model=dict)
def fetch_daily_availability():
    """
    Fetch daily availability statuses for the entire year using PK 'A',
    skipping weekends, and marking missing weekdays as 'unavailable'.
    """
    try:
        print("🔍 Querying daily availability for the entire year...")

        # Get today's date in the correct format
        today = datetime.utcnow().strftime("%Y-%m-%d")

        query_config = {
            'KeyConditionExpression': Key('year_month').eq('A') & Key('date_time').gte(today),
            'ScanIndexForward': True,  # Ascending order by sort key (date)
            'ReturnConsumedCapacity': 'TOTAL'
        }
        
        # ✅ Query DynamoDB
        response = table.query(**query_config)
        items = response.get('Items', [])

        open_dates = set()
        booked_dates = set()
        unavailable_dates = set()
        observed_dates = set()

        # ✅ Process Items
        for item in items:
            date = item.get('date_time')
            status = item.get('status', '0')

            if not date:
                continue

            # Parse the date and skip weekends
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            if date_obj.weekday() in [5, 6]:  # Saturday (5) or Sunday (6)
                continue

            observed_dates.add(date)

            if status == '1':
                open_dates.add(date)
            elif status == '0':
                booked_dates.add(date)
            else:
                unavailable_dates.add(date)

        # ✅ Identify Missing Dates as Unavailable
        current_year = datetime.utcnow().year
        all_weekdays_of_year = set()
        
        for month in range(1, 13):
            _, last_day = calendar.monthrange(current_year, month)
            for day in range(1, last_day + 1):
                date = f"{current_year}-{month:02d}-{day:02d}"
                date_obj = datetime.strptime(date, "%Y-%m-%d")
                
                if date_obj.weekday() in [5, 6]:  # Skip weekends or is before today
                    continue
                
                if date_obj < datetime.utcnow():
                    continue
                
                all_weekdays_of_year.add(date)

        # Any weekday not observed is considered unavailable
        missing_dates = all_weekdays_of_year - observed_dates
        unavailable_dates.update(missing_dates)

        # ✅ Prepare the final response
        consumed_capacity = response.get('ConsumedCapacity', {}).get('CapacityUnits', 0)
        print(f"🔄 DynamoDB Query consumed {consumed_capacity} RCUs.")

        return {
            'open': sorted(open_dates),
            'booked': sorted(booked_dates),
            'unavailable': sorted(unavailable_dates),
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"❌ Failed to fetch daily availability: {e}")
        raise HTTPException(status_code=500, detail=str(e))
# -------------------------------
# 🚨 Fetch Open Appointments
# -------------------------------

@app.get("/appointments/open", response_model=dict)
def fetch_open_appointments(
    limit: int = Query(10, description="Number of appointments to fetch"),
    next_token: Optional[str] = Query(None, description="Pagination token")
):
    try:
        print("🔍 Querying StatusIndex for open appointments...")

        query_config = {
            'IndexName': 'StatusIndex',
            'KeyConditionExpression': Key('status').eq('Open'),
            'ScanIndexForward': True,
            'Limit': limit,
            'ReturnConsumedCapacity': 'TOTAL'
        }

        if next_token:
            exclusive_start_key = decode_next_token(next_token)
            if exclusive_start_key:
                query_config['ExclusiveStartKey'] = exclusive_start_key

        response = table.query(**query_config)
        items = response.get('Items', [])
        items = convert_decimal_to_native(items)

        last_evaluated_key = response.get('LastEvaluatedKey')
        next_token = encode_next_token(last_evaluated_key) if last_evaluated_key else None

        return {
            'items': items,
            'next_token': next_token
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------
# 📅 Fetch Appointments Between Dates (Using Cache)
# -------------------------------

@app.get("/appointments", response_model=dict)
def fetch_appointments_between_dates(
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format")
):
    """
    Fetch appointment slots between start_date and end_date using the cache.
    """
    try:
        print("🔍 Fetching appointments between dates from cache...")

        # Validate date format
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

        # Validate date range
        if (end_dt - start_dt).days > 31:
            raise HTTPException(status_code=400, detail="Date range must not exceed 31 days.")

        # Extract relevant months
        months = set()
        current_dt = start_dt
        while current_dt <= end_dt:
            months.add(current_dt.strftime("%Y-%m"))
            current_dt += timedelta(days=1)

        results = []

        with CACHE_LOCK:
            for month in months:
                if month in APPOINTMENTS_CACHE:
                    for appointment in APPOINTMENTS_CACHE[month]:
                        appointment_date = datetime.strptime(appointment['date_time'], "%Y-%m-%d_%H:%M").date()
                        if start_dt.date() <= appointment_date <= end_dt.date():
                            results.append(appointment)

        print(f"✅ Found {len(results)} appointments in cache.")

        return {
            'items': results
        }

    except Exception as e:
        print(f"❌ Failed to fetch appointments between dates: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------
# 📨 Notification Endpoints
# -------------------------------

@app.get("/notifications")
async def get_notifications(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(default=10, le=50),
    next_token: Optional[str] = Query(None)
):
    """Get notifications for the current user."""
    try:
        query_params = {
            'KeyConditionExpression': Key('user_id').eq(current_user['user_id']),
            'ScanIndexForward': False,  # Most recent first
            'Limit': limit
        }

        if next_token:
            exclusive_start_key = decode_next_token(next_token)
            if exclusive_start_key:
                query_params['ExclusiveStartKey'] = exclusive_start_key

        response = notifications_table.query(**query_params)
        
        items = [convert_decimal_to_native(item) for item in response.get('Items', [])]

        # pop the user_id from the items
        for item in items:
            item.pop('user_id', None)
        
        result = {
            "items": items,
        }

        if 'LastEvaluatedKey' in response:
            result["next_token"] = encode_next_token(response['LastEvaluatedKey'])

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class Notification(BaseModel):
    days: List[str]
    start_date: str
    end_date: str
    start_time: str
    end_time: str

@app.post("/notifications")
async def create_notification(
    notification: Notification, 
    current_user: dict = Depends(get_current_user)):
    """Create a new notification."""
    try:
        notification_id = str(uuid4())

        item = {
            'notification_id': notification_id,
            'user_id': current_user['user_id'],
            'days': notification.days,
            'start_date': notification.start_date,
            'end_date': notification.end_date,
            'start_time': notification.start_time,
            'end_time': notification.end_time,
            'created_at': int(time.time())
        }

        notifications_table.put_item(Item=item)
        return {"message": "Notification created", "notification_id": notification_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a notification."""
    try:
        notifications_table.delete_item(
            Key={
                'notification_id': notification_id,
                'user_id': current_user['user_id']
            },
            ConditionExpression='attribute_exists(notification_id)'
        )
        return {"message": "Notification deleted"}
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            raise HTTPException(status_code=404, detail="Notification not found")
        raise HTTPException(status_code=500, detail=str(e))