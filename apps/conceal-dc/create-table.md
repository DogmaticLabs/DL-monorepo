```
aws configure --profile local-dynamodb
```z

* AWS Access Key ID: dummy-access-key
* AWS Secret Access Key: dummy-secret-key
* Default region name: us-east-1
* Default output format: json


Then run:

```
aws dynamodb create-table \
    --endpoint-url http://localhost:8000 \
    --region us-east-1 \
    --table-name Appointments \
    --attribute-definitions \
        AttributeName=year_month,AttributeType=S \
        AttributeName=date_time,AttributeType=S \
        AttributeName=status,AttributeType=S \
        AttributeName=global_pk,AttributeType=S \
        AttributeName=last_changed,AttributeType=S \
    --key-schema \
        AttributeName=year_month,KeyType=HASH \
        AttributeName=date_time,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --global-secondary-indexes '[
        {
            "IndexName": "StatusIndex",
            "KeySchema": [
                {"AttributeName": "status", "KeyType": "HASH"},
                {"AttributeName": "date_time", "KeyType": "RANGE"}
            ],
            "Projection": {
                "ProjectionType": "ALL"
            },
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 5,
                "WriteCapacityUnits": 5
            }
        },
        {
            "IndexName": "RecentUpdatesIndex",
            "KeySchema": [
                {"AttributeName": "global_pk", "KeyType": "HASH"},
                {"AttributeName": "last_changed", "KeyType": "RANGE"}
            ],
            "Projection": {
                "ProjectionType": "ALL"
            },
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 5,
                "WriteCapacityUnits": 5
            }
        }
    ]'
    ```
