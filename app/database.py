import os
from supabase import create_client, Client
from typing import Optional

# =========================================================
# Supabase Client Initialization
# =========================================================

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise RuntimeError("❌ SUPABASE_URL is not set in environment")
if not SUPABASE_KEY:
    raise RuntimeError("❌ SUPABASE_KEY is not set in environment")

# Create the client immediately so it can be imported as 'supabase'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client() -> Client:
    """
    Returns the initialized Supabase client.
    """
    return supabase


# =========================================================
# FastAPI Dependency
# =========================================================

def get_db() -> Client:
    """
    FastAPI dependency.
    Returns Supabase client (NOT SQLAlchemy session)
    """
    return get_supabase_client()


# =========================================================
# Generic Supabase Helpers
# =========================================================

def get_table(table_name: str):
    return get_supabase_client().table(table_name)


def insert_row(table_name: str, data: dict):
    try:
        response = get_supabase_client().table(table_name).insert(data).execute()
        return response.data if hasattr(response, "data") else None
    except Exception as e:
        print(f"❌ Insert Error [{table_name}]:", e)
        return None


def select_rows(table_name: str, filters: dict | None = None):
    query = get_supabase_client().table(table_name).select("*")

    if filters:
        for key, value in filters.items():
            query = query.eq(key, value)

    try:
        response = query.execute()
        return response.data if hasattr(response, "data") else []
    except Exception as e:
        print(f"❌ Select Error [{table_name}]:", e)
        return []


def update_row(table_name: str, row_id: int, data: dict, id_column: str = "id"):
    try:
        response = (
            get_supabase_client()
            .table(table_name)
            .update(data)
            .eq(id_column, row_id)
            .execute()
        )
        return response.data if hasattr(response, "data") else None
    except Exception as e:
        print(f"❌ Update Error [{table_name}]:", e)
        return None


def delete_row(table_name: str, row_id: int, id_column: str = "id"):
    try:
        response = (
            get_supabase_client()
            .table(table_name)
            .delete()
            .eq(id_column, row_id)
            .execute()
        )
        return response.data if hasattr(response, "data") else None
    except Exception as e:
        print(f"❌ Delete Error [{table_name}]:", e)
        return None


# =========================================================
# Scanning Details Helpers
# =========================================================

SCANNING_TABLE = "scanning_details"


def create_scan_log(data: dict):
    """Insert scan data into scanning_details table"""
    return insert_row(SCANNING_TABLE, data)


def get_all_scan_logs():
    """Fetch all scan logs"""
    try:
        response = (
            get_supabase_client()
            .table(SCANNING_TABLE)
            .select("*")
            .execute()
        )
        return response.data if hasattr(response, "data") else []
    except Exception as e:
        print(f"❌ Select All Scan Logs Error:", e)
        return []


def get_scan_logs_by_factory(factory_code: str):
    """Fetch scan logs filtered by factory_code"""
    return select_rows(SCANNING_TABLE, {"factory_code": factory_code})


def get_scan_logs_by_guard(guard_name: str):
    """Fetch scan logs filtered by guard name"""
    return select_rows(SCANNING_TABLE, {"guard_name": guard_name})


def get_scan_logs_by_factory_and_date(factory_code: str, report_date: str):
    """
    Fetch scan logs filtered by factory_code and date (YYYY-MM-DD)
    """
    try:
        response = (
            get_supabase_client()
            .table(SCANNING_TABLE)
            .select("*")
            .eq("factory_code", factory_code)
            .gte("scan_time", f"{report_date}T00:00:00")
            .lte("scan_time", f"{report_date}T23:59:59")
            .execute()
        )
        return response.data if hasattr(response, "data") else []
    except Exception as e:
        print("❌ Scan Logs by Factory/Date Error:", e)
        return []


def delete_scan_log(scan_id: int):
    """Delete scan log by ID"""
    return delete_row(SCANNING_TABLE, scan_id)