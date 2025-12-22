"""
Legacy SMTP email sender (disabled).

This is intentionally a no-op to avoid using legacy SMTP. Postmark is now used
for outbound emails. If SMTP is required again, implement here.
"""


async def send_email(receiver_email, otp):
    # Intentionally do nothing; Postmark handles emails elsewhere.
    return
