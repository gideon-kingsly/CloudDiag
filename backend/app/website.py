from fastapi import APIRouter
import requests
import time

from app.database import SessionLocal
from app.models import History

router = APIRouter(
    prefix="/website",
    tags=["Website"]
)


@router.get("/{url:path}")
def website_check(url: str):

    db = SessionLocal()

    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    try:
        start = time.time()

        response = requests.get(
            url,
            timeout=5
        )

        response_time = round(
            (time.time() - start) * 1000,
            2
        )

        status = "Reachable"

        history = History(
            check_type="Website",
            target=url,
            result=status
        )

        db.add(history)
        db.commit()

        return {
            "url": url,
            "status": status,
            "status_code": response.status_code,
            "response_time_ms": response_time
        }

    except requests.exceptions.RequestException:

        status = "Unreachable"

        history = History(
            check_type="Website",
            target=url,
            result=status
        )

        db.add(history)
        db.commit()

        return {
            "url": url,
            "status": status
        }

    finally:
        db.close()