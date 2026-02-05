from fastapi import APIRouter, Depends, Query
from app.database import get_db
from datetime import datetime
from app.utils.round_slots import generate_round_slots

router = APIRouter(prefix="/report", tags=["Report"])

@router.get("/download")
def download_report(
    factory_code: str = Query(...),
    report_date: str = Query(...),
    db=Depends(get_db),
):
    try:
        round_slots = generate_round_slots(report_date)

        qr_codes = (
            db.table("qr")
            .select("qr_id, qr_name")
            .eq("factory_code", factory_code)
            .execute()
            .data or []
        )

        scans = (
            db.table("scanning_details")
            .select("*")
            .eq("factory_code", factory_code)
            .gte("scan_time", f"{report_date}T00:00:00+05:30")
            .lte("scan_time", f"{report_date}T23:59:59+05:30")
            .execute()
            .data or []
        )

        report = []

        for qr in qr_codes:
            for round_no, slot in round_slots:
                scan = next(
                    (
                        s for s in scans
                        if s.get("qr_id") == qr.get("qr_id")
                        and s.get("round_slot") == slot.isoformat()
                    ),
                    None
                )

                report.append({
                    "qr_name": qr.get("qr_name"),
                    "round": round_no,
                    "scan_time": scan.get("scan_time") if scan else None,
                    "lat": scan.get("lat") if scan else None,
                    "log": scan.get("log") if scan else None,
                    "guard_name": scan.get("guard_name") if scan else None,
                    "status": "SUCCESS" if scan else "FAILED"
                })

        return report  # ✅ ARRAY ONLY

    except Exception as e:
        print("❌ REPORT ERROR:", str(e))
        return {"error": str(e)}
