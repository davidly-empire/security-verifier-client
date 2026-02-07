# app/database.py

import os
from typing import Dict, Any, List, Optional

from supabase import create_client, Client


# --------------------------------------------------
# ENV CONFIG
# --------------------------------------------------

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL missing")

if not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_KEY missing")


# --------------------------------------------------
# SUPABASE CLIENT
# --------------------------------------------------

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_db() -> Client:
    return supabase


# --------------------------------------------------
# TABLE NAMES
# --------------------------------------------------

SCANNING_TABLE = "scan_logs"
QR_TABLE = "qr"


# --------------------------------------------------
# GENERIC HELPERS
# --------------------------------------------------

def insert_row(table: str, data: Dict[str, Any]) -> Dict:
    res = supabase.table(table).insert(data).execute()

    if not res.data:
        raise RuntimeError(f"Insert failed: {res}")

    return res.data[0]


def select_rows(
    table: str,
    filters: Optional[Dict[str, Any]] = None
) -> List[Dict]:

    query = supabase.table(table).select("*")

    if filters:
        for k, v in filters.items():
            query = query.eq(k, v)

    res = query.execute()

    if not res.data:
        return []

    return res.data


def update_row(
    table: str,
    filters: Dict[str, Any],
    data: Dict[str, Any]
) -> Dict:

    query = supabase.table(table).update(data)

    for k, v in filters.items():
        query = query.eq(k, v)

    res = query.execute()

    if not res.data:
        raise RuntimeError(f"Update failed: {res}")

    return res.data[0]


def delete_row(
    table: str,
    filters: Dict[str, Any]
) -> bool:

    query = supabase.table(table).delete()

    for k, v in filters.items():
        query = query.eq(k, v)

    res = query.execute()

    return bool(res.data)


# --------------------------------------------------
# SCAN LOG HELPERS
# --------------------------------------------------

def create_scan_log(data: Dict[str, Any]) -> Dict:
    return insert_row(SCANNING_TABLE, data)


def get_all_scan_logs() -> List[Dict]:
    return select_rows(SCANNING_TABLE)


def get_scan_logs_by_factory(factory_code: str) -> List[Dict]:
    return select_rows(
        SCANNING_TABLE,
        {"factory_code": factory_code}
    )


def get_scan_logs_by_guard(guard_name: str) -> List[Dict]:
    return select_rows(
        SCANNING_TABLE,
        {"guard_name": guard_name}
    )


def delete_scan_log(scan_id: int) -> bool:
    return delete_row(
        SCANNING_TABLE,
        {"id": scan_id}
    )


# --------------------------------------------------
# QR HELPERS (OPTIONAL)
# --------------------------------------------------

def create_qr(data: Dict[str, Any]) -> Dict:
    return insert_row(QR_TABLE, data)


def get_qrs(filters: Optional[Dict[str, Any]] = None) -> List[Dict]:
    return select_rows(QR_TABLE, filters)


def update_qr(qr_id: int, data: Dict[str, Any]) -> Dict:
    return update_row(
        QR_TABLE,
        {"qr_id": qr_id},
        data
    )


def delete_qr(qr_id: int) -> bool:
    return delete_row(
        QR_TABLE,
        {"qr_id": qr_id}
    )
