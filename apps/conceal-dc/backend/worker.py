import datetime
import requests
from bs4 import BeautifulSoup
import boto3
from boto3.dynamodb.conditions import Key
import time
import os

# -------------------------------
# 🛠️ Configuration
# -------------------------------

DDB_TABLE_NAME = 'Appointments'
session = boto3.Session(profile_name='local-dynamodb')
dynamodb = session.resource('dynamodb', endpoint_url='http://localhost:8000', region_name='us-east-1')
table = dynamodb.Table(DDB_TABLE_NAME)


BASE_FORM_DATA = {
    'FormId': '1',
    'RegionId': '0',
    'SectionId': '295',
    'ServiceTypeId': '2443'
}

WEEKS_TO_FETCH = 52

INDEX_URL = 'https://go.nemoqappointment.com/Booking/Booking/Index/dc876re9gh'
NEXT_URL = 'https://go.nemoqappointment.com/Booking/Booking/Next/dc876re9gh'
POST_URL = 'https://go.nemoqappointment.com/Booking/Booking/Next/dc876re9gh'

HEADERS = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
}

# -------------------------------
# 🔑 Fetch Tokens and Cookies
# -------------------------------

def fetch_new_tokens():
    """
    Fetch fresh verification tokens and cookies through a sequence of GET and POST requests.
    """
    session = requests.Session()
    
    # STEP 1: Initial GET to INDEX_URL
    print("🔄 STEP 1: Performing GET request to INDEX_URL")
    response = session.get(INDEX_URL, headers=HEADERS)
    if response.status_code != 200:
        raise Exception(f"❌ STEP 1 failed: GET request returned status code {response.status_code}")
    
    soup = BeautifulSoup(response.text, 'html.parser')
    token_1 = soup.find('input', {'name': '__RequestVerificationToken'})['value']
    print(f"✅ STEP 1 Token Extracted: {token_1}")
    
    # STEP 2: POST request to NEXT_URL
    print("🔄 STEP 2: Performing POST request to NEXT_URL")
    data_step_2 = {
        '__RequestVerificationToken': token_1,
        'FormId': '1',
        'ServiceGroupId': '498',
        'StartNextButton': 'Make an appointment'
    }
    response = session.post(NEXT_URL, headers=HEADERS, data=data_step_2)
    if response.status_code != 200:
        raise Exception(f"❌ STEP 2 failed: POST request returned status code {response.status_code}")
    
    token_2 = BeautifulSoup(response.text, 'html.parser').find('input', {'name': '__RequestVerificationToken'})['value']
    print(f"✅ STEP 2 Token Extracted: {token_2}")
    
    # STEP 3: POST Agreement Submission
    print("🔄 STEP 3: Performing POST request (Agreement Submission)")
    data_step_3 = {
        '__RequestVerificationToken': token_2,
        'AgreementText': 'Terms and conditions for storage of personal data!',
        'AcceptInformationStorage': 'true',
        'NumberOfPeople': '1',
        'Next': 'Next'
    }
    response = session.post(NEXT_URL, headers=HEADERS, data=data_step_3)
    if response.status_code != 200:
        raise Exception(f"❌ STEP 3 failed: POST request returned status code {response.status_code}")
    
    final_token = BeautifulSoup(response.text, 'html.parser').find('input', {'name': '__RequestVerificationToken'})['value']
    print(f"✅ STEP 3 Final Token Extracted: {final_token}")
    
    # Collect cookies
    cookie_header = "; ".join([f"{key}={value}" for key, value in session.cookies.get_dict().items()])
    print(f"✅ Final Cookies Extracted: {cookie_header}")
    
    return final_token, cookie_header, session


# -------------------------------
# 📡 Fetch Calendar HTML with Dynamic Tokens
# -------------------------------

def fetch_calendar_html(session, start_date, retries=3):
    """
    Fetch timetable HTML for a given start date using pre-fetched tokens and cookies.
    """
    global HEADERS, BASE_FORM_DATA

    payload = BASE_FORM_DATA.copy()
    payload['FromDateString'] = start_date.strftime('%m/%d/%Y')
    
    HEADERS.update({
        'origin': 'https://go.nemoqappointment.com',
        'referer': INDEX_URL
    })

    for attempt in range(retries):
        try:
            print(f"🔄 Attempt {attempt + 1}: Fetching calendar for {start_date.strftime('%m/%d/%Y')}")
            response = session.post(POST_URL, headers=HEADERS, data=payload)
            if response.status_code != 200:
                raise Exception(f"❌ POST failed with status code {response.status_code}")
            
            if 'timetable' not in response.text:
                log_failed_response(response.text, start_date.strftime('%Y-%m-%d'))
                raise Exception("❌ Timetable table not found in POST response.")
            
            return response.text  # ✅ Success
        
        except Exception as e:
            print(f"⚠️ Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                print("🔄 Retrying...")
                continue
            else:
                raise Exception("❌ All attempts to fetch calendar HTML have failed.")


def log_failed_response(html, week_start):
    """
    Log raw HTML response to a file for debugging.
    """
    log_dir = "failed_responses"
    os.makedirs(log_dir, exist_ok=True)
    file_path = os.path.join(log_dir, f"failed_{week_start}.html")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)
    
    print(f"❌ Timetable parsing failed. Raw HTML saved to {file_path}")

# -------------------------------
# 📝 Parse Calendar Data
# -------------------------------

def parse_calendar_data(html):
    """
    Parse available slots from the HTML timetable.
    """
    soup = BeautifulSoup(html, 'html.parser')
    calendar_data = []
    
    slots = soup.find_all('div', {'data-function': 'timeTableCell'})
    
    for slot in slots:
        raw_slot_time = slot.get('data-fromdatetime', '').strip()
        aria_label = slot.get('aria-label', '').strip()
        
        try:
            parsed_datetime = datetime.datetime.strptime(raw_slot_time, "%m/%d/%Y %I:%M:%S %p")
            slot_date = parsed_datetime.strftime('%Y-%m-%d')  # Extract the date
            slot_time = parsed_datetime.strftime('%H:%M')  # Extract the time
            year_month = parsed_datetime.strftime('%Y-%m')  # Extract year and month
        except (ValueError, TypeError) as e:
            print(f"⚠️ Failed to parse datetime '{raw_slot_time}': {e}")
            continue
        
        # Determine slot status
        if 'background-color: #FF0000' in slot.get('style', ''):
            status = "Booked"
        elif 'background-color: #00FF00' in slot.get('style', ''):
            status = "Open"
        else:
            status = "Unknown"
        
        calendar_data.append({
            'year_month': year_month,
            'date_time': f"{slot_date}_{slot_time}",
            'date': slot_date,
            'time': slot_time,
            'status': status
        })
    
    return calendar_data


# -------------------------------
# 📊 Fetch DynamoDB Weekly Data
# -------------------------------

def fetch_weekly_data_from_dynamodb(week_start):
    """
    Fetch all records from DynamoDB for a given week using the start of the week's year_month.
    """
    try:
        # Extract year and month from the start of the week
        week_start_date = datetime.datetime.strptime(week_start, "%Y-%m-%d")
        year_month = week_start_date.strftime('%Y-%m')

        # Calculate the week's date range
        week_end_date = week_start_date + datetime.timedelta(days=6)
        date_start = week_start_date.strftime('%Y-%m-%d')
        date_end = week_end_date.strftime('%Y-%m-%d')
        
        print(f"🔍 Querying DynamoDB for records from {date_start} to {date_end} in partition '{year_month}'...")

        response = table.query(
            KeyConditionExpression=Key('year_month').eq(year_month) &
                                   Key('date_time').between(f"{date_start}_00:00", f"{date_end}_23:59"),
            ReturnConsumedCapacity='TOTAL'
        )
        
        consumed_capacity = response.get('ConsumedCapacity', {}).get('CapacityUnits', 0)
        print(f"🔄 DynamoDB Query for week '{week_start}' consumed {consumed_capacity} RCUs.")
        
        return {item['date_time']: item for item in response.get('Items', [])}
    
    except Exception as e:
        print(f"❌ Failed to fetch weekly data from DynamoDB: {e}")
        raise
    
    
# -------------------------------
# 🔄 Compare and Update Changes
# -------------------------------

def compare_and_update_weekly_data(week_start, scraped_slots):
    """
    Compare scraped data with DynamoDB data and update weekly changes,
    while tracking daily availability.
    """
    now = int(time.time())  # Current epoch timestamp
    week_start_date = datetime.datetime.strptime(week_start, "%Y-%m-%d")
    year_month = week_start_date.strftime('%Y-%m')

    # Fetch existing weekly data
    ddb_week_data = fetch_weekly_data_from_dynamodb(week_start)
    print(f"🔄 Comparing and updating data for week {week_start}")
    print(f"🔄 Number of items returned from DynamoDB: {len(ddb_week_data)}")
    
    updates = {}
    daily_availability = {}

    for slot in scraped_slots:
        date = slot.get('date')
        time_value = slot.get('time')
        status = slot.get('status')

        if not date or not time_value:
            print(f"⚠️ Skipping invalid slot: {slot}")
            continue  # Skip invalid slots

        date_time = f"{date}_{time_value}"
        existing_slot = ddb_week_data.get(date_time)

        # Track daily availability
        if date not in daily_availability:
            daily_availability[date] = status == "Open"
        elif status == "Open":
            daily_availability[date] = True

        # Determine if slot needs updating
        if existing_slot:
            if existing_slot['status'] != status:
                history = existing_slot.get('history', [])
                history.append({'status': status, 'timestamp': now})
                
                updates[date_time] = {
                    'year_month': year_month,
                    'date_time': date_time,
                    'global_pk': 'updates',
                    'date': date,
                    'time': time_value,
                    'status': status,
                    'last_changed': str(now),
                    'history': history
                }
        else:
            updates[date_time] = {
                'year_month': year_month,
                'date_time': date_time,
                'date': date,
                'time': time_value,
                'status': status,
                'last_changed': str(now),
                'history': [{'status': status, 'timestamp': now}]
            }

    # Update weekly slots
    if updates:
        batch_write_to_dynamodb(list(updates.values()))
        print(f"✅ Updated {len(updates)} weekly slots in DynamoDB.")
    else:
        print("✅ No weekly updates were necessary.")

    # Update daily availability
    compare_and_update_daily_availability(daily_availability)
        
        
# -------------------------------
# 🚀 Batch Write to DynamoDB
# -------------------------------

def batch_write_to_dynamodb(items):
    """
    Perform a batch write to DynamoDB, optionally including 'global_pk' if it exists.
    """
    with table.batch_writer() as batch:
        for item in items:
            ddb_item = {
                'year_month': item['year_month'],  # Partition Key
                'date_time': item['date_time'],  # Sort Key
                'date': item['date'],
                'time': item['time'],
                'status': item['status'],
                'last_changed': str(item['last_changed']),  # For RecentUpdatesIndex
                'history': item['history']
            }
            
            # Only add 'global_pk' if it exists in the item
            if 'global_pk' in item:
                ddb_item['global_pk'] = item['global_pk']
            
            batch.put_item(Item=ddb_item)

# -------------------------------
# 🔄 Query Existing Daily Availability
# -------------------------------

def fetch_daily_availability():
    """
    Fetch all daily availability records (PK: 'A') from DynamoDB.
    """
    try:
        response = table.query(
            KeyConditionExpression=Key('year_month').eq('A')
        )
        items = response.get('Items', [])
        print(f"🔍 Found {len(items)} daily availability records in DynamoDB.")
        
        return {item['date_time']: int(item['status']) for item in items}
    except Exception as e:
        print(f"❌ Failed to fetch daily availability records: {e}")
        return {}


# -------------------------------
# 🔄 Compare and Update Daily Availability
# -------------------------------

def compare_and_update_daily_availability(scraped_availability):
    """
    Compare scraped daily availability with DynamoDB and update necessary changes.
    """
    # Fetch existing availability from DynamoDB
    existing_availability = fetch_daily_availability()
    updates = {}

    # Compare each scraped day
    for date, is_available in scraped_availability.items():
        current_status = existing_availability.get(date)
        new_status = int(is_available)  # Convert True/False to 1/0

        if current_status is None or current_status != new_status:
            updates[date] = new_status
            print(f"🔄 Status change detected for {date}: {current_status} -> {new_status}")

    # Perform batch updates
    if updates:
        print(f"✅ Preparing to update {len(updates)} daily availability records...")
        with table.batch_writer() as batch:
            for date, status in updates.items():
                batch.put_item(
                    Item={
                        'year_month': 'A',  # Fixed partition key
                        'date_time': date,  # Specific date
                        'status': str(status)  # Store as string '1' or '0'
                    }
                )
        print(f"✅ Successfully updated {len(updates)} daily availability records.")
    else:
        print("✅ No daily availability updates were necessary.")   
            
def batch_write_daily_availability(daily_availability):
    """
    Write daily availability data to DynamoDB.
    """
    with table.batch_writer() as batch:
        for date, is_available in daily_availability.items():
            batch.put_item(
                Item={
                    'year_month': 'A',  # Fixed partition key for availability
                    'date_time': date,  # Sort key is the specific date
                    'status': str(int(is_available))  # Store 1 for true, 0 for false
                }
            )
    print(f"✅ Updated daily availability for {len(daily_availability)} days.")

# -------------------------------
# 📅 Monitor Appointments
# -------------------------------

def monitor_appointments(session):
    """
    Monitor appointments and track changes in DynamoDB.
    """
    start_date = datetime.date.today() + datetime.timedelta(days=1)
    end_date = start_date + datetime.timedelta(weeks=WEEKS_TO_FETCH)
    
    current_date = start_date
    while current_date <= end_date:
        week_start = (current_date - datetime.timedelta(days=current_date.weekday())).strftime('%Y-%m-%d')
        print(f"Fetching data for week starting: {week_start}")
        
        try:
            html = fetch_calendar_html(session, current_date)
            scraped_slots = parse_calendar_data(html)
            compare_and_update_weekly_data(week_start, scraped_slots)
        except Exception as e:
            print(f"Error for {week_start}: {e}")
        
        current_date += datetime.timedelta(weeks=1)


# -------------------------------
# 🏁 Main Function with Scheduler
# ------------------------------

if __name__ == "__main__":
    try:
        # print("🔑 Fetching fresh tokens and cookies...")
        verification_token, cookie_header, session = fetch_new_tokens()
        
        HEADERS['cookie'] = cookie_header
        BASE_FORM_DATA['__RequestVerificationToken'] = verification_token

        while True:
            print("\n🔄 Starting appointment monitoring cycle...")
            now = datetime.datetime.now()
            monitor_appointments(session)
            print("Run took: " + str(datetime.datetime.now() - now))
            print("✅ Monitoring cycle complete. Waiting 60 seconds before the next run...\n")
            time.sleep(60)
    except KeyboardInterrupt:
        print("\n🛑 Monitoring stopped by user.")
    except Exception as e:
        print(f"❌ Fatal error: {e}")