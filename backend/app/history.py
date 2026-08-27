from fastapi import APIRouter

from app.database import SessionLocal
from app.models import History


router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.get("/")
def get_history():

    db = SessionLocal()

    try:

        # Get all diagnostic history
        # Newest record appears first
        records = (
            db.query(History)
            .order_by(History.id.desc())
            .all()
        )

        history_data = []

        for record in records:

            history_data.append({
                "id": record.id,
                "check_type": record.check_type,
                "target": record.target,
                "result": record.result
            })

        return history_data

    finally:

        db.close()