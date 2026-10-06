from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import math
from .models import VolunteerModel, SafeCheckModel, HelpRequestModel
from .schemas import (
    VolunteerCreate, VolunteerResponse, VolunteerAvailabilityUpdate,
    SafeCheckCreate, SafeCheckResponse,
    HelpRequestCreate, HelpRequestResponse, HelpRequestStatusUpdate, HelpRequestAssign,
    PriorityScore
)
from datetime import datetime

router = APIRouter(prefix="/api/v1/community", tags=["community"])

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

@router.post("/volunteers", response_model=VolunteerResponse)
def register_volunteer(volunteer: VolunteerCreate, user_id: str = Query(...), db: Session = Depends(get_db)):
    db_vol = db.query(VolunteerModel).filter(VolunteerModel.user_id == user_id).first()
    
    if db_vol:
        db_vol.full_name = volunteer.full_name
        db_vol.phone = volunteer.phone
        db_vol.latitude = volunteer.latitude
        db_vol.longitude = volunteer.longitude
    else:
        db_vol = VolunteerModel(
            user_id=user_id,
            full_name=volunteer.full_name,
            phone=volunteer.phone,
            latitude=volunteer.latitude,
            longitude=volunteer.longitude
        )
        db.add(db_vol)
        
    db_vol.set_skills(volunteer.skills)
    db.commit()
    db.refresh(db_vol)
    return db_vol

@router.get("/volunteers", response_model=List[VolunteerResponse])
def list_volunteers(available_only: Optional[bool] = None, skill: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(VolunteerModel)
    if available_only:
        query = query.filter(VolunteerModel.is_available == True)
    vols = query.all()
    if skill:
        vols = [v for v in vols if skill in v.skills]
    return vols

@router.get("/volunteers/nearby", response_model=List[VolunteerResponse])
def find_nearby_volunteers(lat: float, lon: float, radius_km: float = 5.0, db: Session = Depends(get_db)):
    vols = db.query(VolunteerModel).filter(VolunteerModel.is_available == True).all()
    nearby = []
    for v in vols:
        if v.latitude is not None and v.longitude is not None:
            dist = haversine_km(lat, lon, v.latitude, v.longitude)
            if dist <= radius_km:
                nearby.append((dist, v))
    nearby.sort(key=lambda x: x[0])
    return [v for dist, v in nearby]

@router.get("/volunteers/{volunteer_id}", response_model=VolunteerResponse)
def get_volunteer(volunteer_id: int, db: Session = Depends(get_db)):
    v = db.query(VolunteerModel).filter(VolunteerModel.id == volunteer_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return v

@router.patch("/volunteers/{volunteer_id}/availability", response_model=VolunteerResponse)
def toggle_availability(volunteer_id: int, update: VolunteerAvailabilityUpdate, db: Session = Depends(get_db)):
    v = db.query(VolunteerModel).filter(VolunteerModel.id == volunteer_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    v.is_available = update.is_available
    db.commit()
    db.refresh(v)
    return v

@router.post("/safe-checks", response_model=SafeCheckResponse)
def create_safe_check(check: SafeCheckCreate, user_id: str = Query(...), db: Session = Depends(get_db)):
    c = SafeCheckModel(
        user_id=user_id,
        latitude=check.latitude,
        longitude=check.longitude,
        message=check.message
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.get("/safe-checks", response_model=List[SafeCheckResponse])
def list_safe_checks(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(SafeCheckModel).order_by(SafeCheckModel.created_at.desc()).limit(limit).all()

@router.post("/help-requests", response_model=HelpRequestResponse)
def create_help_request(req: HelpRequestCreate, user_id: str = Query(...), db: Session = Depends(get_db)):
    r = HelpRequestModel(
        user_id=user_id,
        latitude=req.latitude,
        longitude=req.longitude,
        request_type=req.request_type,
        description=req.description,
        urgency=req.urgency
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@router.get("/help-requests", response_model=List[HelpRequestResponse])
def list_help_requests(status: Optional[str] = None, urgency: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(HelpRequestModel)
    if status:
        query = query.filter(HelpRequestModel.status == status)
    if urgency:
        query = query.filter(HelpRequestModel.urgency == urgency)
    return query.all()

@router.get("/help-requests/{request_id}", response_model=HelpRequestResponse)
def get_help_request(request_id: int, db: Session = Depends(get_db)):
    r = db.query(HelpRequestModel).filter(HelpRequestModel.id == request_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")
    return r

@router.patch("/help-requests/{request_id}/assign", response_model=HelpRequestResponse)
def assign_help_request(request_id: int, assign: HelpRequestAssign, db: Session = Depends(get_db)):
    r = db.query(HelpRequestModel).filter(HelpRequestModel.id == request_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")
    r.assigned_volunteer_id = assign.volunteer_id
    r.status = "assigned"
    db.commit()
    db.refresh(r)
    return r

@router.patch("/help-requests/{request_id}/escalate", response_model=HelpRequestResponse)
def escalate_help_request(request_id: int, db: Session = Depends(get_db)):
    r = db.query(HelpRequestModel).filter(HelpRequestModel.id == request_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")
    r.urgency = "critical"
    r.description = str(r.description or "") + " [ESCALATED: STILL IN DANGER!]"
    db.commit()
    db.refresh(r)
    return r

@router.patch("/help-requests/{request_id}/status", response_model=HelpRequestResponse)
def update_help_request_status(request_id: int, update: HelpRequestStatusUpdate, db: Session = Depends(get_db)):
    r = db.query(HelpRequestModel).filter(HelpRequestModel.id == request_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")
    r.status = update.status
    db.commit()
    db.refresh(r)
    return r

@router.get("/decision-support/priorities", response_model=List[PriorityScore])
def get_priorities(db: Session = Depends(get_db)):
    requests = db.query(HelpRequestModel).filter(HelpRequestModel.status.in_(["open", "assigned"])).all()
    urgency_weights = {"critical": 4, "high": 3, "medium": 2, "low": 1}
    type_weights = {"rescue": 2.0, "medical": 1.5, "shelter": 0.5, "food_water": 0.5, "other": 0.0}
    scores = []
    now = datetime.utcnow()
    for r in requests:
        base = urgency_weights.get(r.urgency, 1)
        type_bonus = type_weights.get(r.request_type, 0.0)
        age_hours = (now - r.created_at).total_seconds() / 3600
        age_bonus = min(age_hours * 0.5, 3.0)
        total = base + type_bonus + age_bonus
        factors = {
            "base_urgency": base,
            "type_bonus": type_bonus,
            "age_hours": round(age_hours, 2),
            "age_bonus": round(age_bonus, 2)
        }
        rec = "Dispatch immediately" if total >= 5 else "Schedule soon" if total >= 3 else "Monitor"
        scores.append(PriorityScore(
            help_request_id=r.id,
            priority_score=round(total, 2),
            factors=factors,
            recommendation=rec
        ))
    scores.sort(key=lambda x: x.priority_score, reverse=True)
    return scores
