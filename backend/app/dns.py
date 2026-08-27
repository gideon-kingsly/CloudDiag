from fastapi import APIRouter
import socket

from app.database import SessionLocal
from app.models import History

router = APIRouter(
    prefix="/dns",
    tags=["DNS"]
)


@router.get("/{host}")
def dns_lookup(host: str):

    db = SessionLocal()

    try:
        ip = socket.gethostbyname(host)
        status = "Resolved"

        history = History(
            check_type="DNS",
            target=host,
            result=status
        )

        db.add(history)
        db.commit()

        return {
            "hostname": host,
            "ip_address": ip,
            "status": status
        }

    except socket.gaierror:

        status = "Unable to Resolve"

        history = History(
            check_type="DNS",
            target=host,
            result=status
        )

        db.add(history)
        db.commit()

        return {
            "hostname": host,
            "status": status
        }

    finally:
        db.close()