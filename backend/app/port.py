from fastapi import APIRouter
import socket

from app.database import SessionLocal
from app.models import History

router = APIRouter(
    prefix="/port",
    tags=["Port"]
)


@router.get("/{host}/{port}")
def check_port(host: str, port: int):

    db = SessionLocal()
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(3)

    try:
        result = sock.connect_ex((host, port))

        if result == 0:
            status = "Open"
        else:
            status = "Closed"

        history = History(
            check_type="Port",
            target=f"{host}:{port}",
            result=status
        )

        db.add(history)
        db.commit()

        return {
            "host": host,
            "port": port,
            "status": status
        }

    except Exception as e:

        status = "Error"

        history = History(
            check_type="Port",
            target=f"{host}:{port}",
            result=status
        )

        db.add(history)
        db.commit()

        return {
            "host": host,
            "port": port,
            "status": status,
            "error": str(e)
        }

    finally:
        sock.close()
        db.close()