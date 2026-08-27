from fastapi import APIRouter
from ping3 import ping

from app.database import SessionLocal
from app.models import History


router = APIRouter(
    prefix="/ping",
    tags=["Ping"]
)


@router.get("/{host}")
def ping_host(host: str):

    db = SessionLocal()

    try:
        # Send ping request
        response_time = ping(
            host,
            timeout=3
        )

        # Check result
        if response_time is not None:

            status = "Reachable"

            response_time_ms = round(
                response_time * 1000,
                2
            )

        else:

            status = "Unreachable"
            response_time_ms = None


        # Save Ping result to history
        history = History(
            check_type="Ping",
            target=host,
            result=status
        )

        db.add(history)
        db.commit()
        db.refresh(history)


        # Return API response
        result = {
            "host": host,
            "status": status
        }

        if response_time_ms is not None:
            result["response_time_ms"] = response_time_ms

        return result


    except Exception as error:

        status = "Unreachable"

        # Save failed Ping check too
        history = History(
            check_type="Ping",
            target=host,
            result=status
        )

        db.add(history)
        db.commit()

        return {
            "host": host,
            "status": status,
            "error": str(error)
        }


    finally:
        db.close()