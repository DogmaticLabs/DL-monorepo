from typing import Optional

class NotificationService:
    def __init__(self, sns_client=None, ses_client=None):
        self.sns_client = sns_client
        self.ses_client = ses_client

    def send_otp_via_sns(self, phone_number: str, otp_code: str) -> None:
        """Send OTP via AWS SNS."""
        if not self.sns_client:
            raise ValueError("SNS client not initialized")
        
        message = f"Your verification code is: {otp_code}"
        self.sns_client.publish(PhoneNumber=phone_number, Message=message)

    def send_otp_via_ses(self, email: str, otp_code: str) -> None:
        """Send OTP via AWS SES."""
        if not self.ses_client:
            raise ValueError("SES client not initialized")
            
        subject = "Your Verification Code"
        body_text = f"Your verification code is: {otp_code}"
        
        self.ses_client.send_email(
            Source="no-reply@concealdc.com",
            Destination={"ToAddresses": [email]},
            Message={
                "Subject": {"Data": subject},
                "Body": {"Text": {"Data": body_text}}
            }
        ) 
    