from typing import Optional

from httpx import AsyncClient

from core import settings


async def send_postmark_email(
    to_email: str, subject: str, text_body: str, html_body: Optional[str] = None
):
    """
    Send an email through Postmark. No-op if server token or from email is missing.
    """
    if not settings.POSTMARK_SERVER_TOKEN or not settings.POSTMARK_FROM_EMAIL:
        return

    payload = {
        "From": settings.POSTMARK_FROM_EMAIL,
        "To": to_email,
        "Subject": subject,
        "TextBody": text_body,
    }
    if html_body:
        payload["HtmlBody"] = html_body

    headers = {"X-Postmark-Server-Token": settings.POSTMARK_SERVER_TOKEN}

    async with AsyncClient(base_url="https://api.postmarkapp.com") as client:
        await client.post("/email", json=payload, headers=headers)

