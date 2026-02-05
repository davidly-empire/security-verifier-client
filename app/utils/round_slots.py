from datetime import datetime, time
import pytz

IST = pytz.timezone("Asia/Kolkata")

# ROUNDS definition stays the same
ROUNDS = [
    (1, time(9,0), time(10,0)),
    (2, time(10,0), time(11,0)),
    (3, time(11,0), time(12,0)),
    (4, time(12,0), time(13,0)),
    (5, time(13,0), time(14,0)),
    (6, time(14,0), time(15,0)),
    (7, time(15,0), time(16,0)),
    (8, time(16,0), time(17,0)),
    (9, time(17,0), time(19,0)),
    (10, time(19,0), time(19,30)),
    (11, time(19,30), time(20,0)),
    (12, time(20,0), time(20,30)),
    (13, time(20,30), time(21,0)),
    (14, time(21,0), time(21,30)),
    (15, time(21,30), time(22,0)),
    (16, time(22,0), time(22,30)),
    (17, time(22,30), time(23,0)),
    (18, time(23,0), time(23,30)),
    (19, time(23,30), time(23,59)),
    (20, time(0,0), time(0,30)),
    (21, time(0,30), time(1,0)),
    (22, time(1,0), time(1,30)),
    (23, time(1,30), time(2,0)),
    (24, time(2,0), time(2,30)),
    (25, time(2,30), time(3,0)),
    (26, time(3,0), time(3,30)),
    (27, time(3,30), time(4,0)),
    (28, time(4,0), time(4,30)),
    (29, time(4,30), time(5,0)),
    (30, time(5,0), time(5,30)),
    (31, time(5,30), time(6,0)),
    (32, time(6,0), time(6,30)),
    (33, time(6,30), time(7,0)),
    (34, time(7,0), time(8,0)),
    (35, time(8,0), time(9,0)),
]

def generate_round_slots(report_date):
    """
    Generates datetime slots for a given report_date
    report_date can be str ('YYYY-MM-DD') or datetime.date
    """
    if isinstance(report_date, str):
        base_date = datetime.strptime(report_date, "%Y-%m-%d")
    else:
        # Already a date object → convert to datetime at midnight
        base_date = datetime.combine(report_date, time.min)

    slots = []
    for round_no, start_time, _ in ROUNDS:
        slot_dt = datetime.combine(base_date.date(), start_time)
        slots.append((round_no, slot_dt))
    return slots
