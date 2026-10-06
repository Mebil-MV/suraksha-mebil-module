from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from .models import DamageReportModel, RecoverySchemeModel
from .schemas import (
    DamageReportCreate, DamageReportResponse, DamageReportStatusUpdate,
    RecoverySchemeCreate, RecoverySchemeResponse, DamageSummary
)

router = APIRouter(prefix="/api/v1/recovery", tags=["recovery"])

@router.post("/damage-reports", response_model=DamageReportResponse)
def submit_damage_report(report: DamageReportCreate, user_id: str = Query(...), db: Session = Depends(get_db)):
    r = DamageReportModel(
        user_id=user_id,
        latitude=report.latitude,
        longitude=report.longitude,
        category=report.category,
        severity=report.severity,
        description=report.description,
        estimated_cost=report.estimated_cost
    )
    r.set_image_refs(report.image_refs)
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@router.get("/damage-reports", response_model=List[DamageReportResponse])
def list_damage_reports(user_id: Optional[str] = None, category: Optional[str] = None, severity: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(DamageReportModel)
    if user_id: query = query.filter(DamageReportModel.user_id == user_id)
    if category: query = query.filter(DamageReportModel.category == category)
    if severity: query = query.filter(DamageReportModel.severity == severity)
    if status: query = query.filter(DamageReportModel.status == status)
    return query.all()

@router.get("/damage-reports/summary/stats", response_model=DamageSummary)
def get_damage_summary(db: Session = Depends(get_db)):
    reports = db.query(DamageReportModel).all()
    by_cat = {}
    by_sev = {}
    total_cost = 0.0
    for r in reports:
        by_cat[r.category] = by_cat.get(r.category, 0) + 1
        by_sev[r.severity] = by_sev.get(r.severity, 0) + 1
        if r.estimated_cost:
            total_cost += r.estimated_cost
    return DamageSummary(
        total_reports=len(reports),
        by_category=by_cat,
        by_severity=by_sev,
        total_estimated_cost=total_cost
    )

@router.get("/damage-reports/{report_id}", response_model=DamageReportResponse)
def get_damage_report(report_id: int, db: Session = Depends(get_db)):
    r = db.query(DamageReportModel).filter(DamageReportModel.id == report_id).first()
    if not r: raise HTTPException(status_code=404, detail="Not found")
    return r

@router.patch("/damage-reports/{report_id}/status", response_model=DamageReportResponse)
def update_damage_report_status(report_id: int, update: DamageReportStatusUpdate, db: Session = Depends(get_db)):
    r = db.query(DamageReportModel).filter(DamageReportModel.id == report_id).first()
    if not r: raise HTTPException(status_code=404, detail="Not found")
    r.status = update.status
    db.commit()
    db.refresh(r)
    return r

@router.get("/schemes", response_model=List[RecoverySchemeResponse])
def list_schemes(hazard_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(RecoverySchemeModel)
    if hazard_type:
        query = query.filter(RecoverySchemeModel.hazard_type == hazard_type)
    return query.all()

@router.get("/schemes/{scheme_id}", response_model=RecoverySchemeResponse)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    s = db.query(RecoverySchemeModel).filter(RecoverySchemeModel.id == scheme_id).first()
    if not s: raise HTTPException(status_code=404, detail="Not found")
    return s

@router.post("/schemes", response_model=RecoverySchemeResponse)
def create_scheme(scheme: RecoverySchemeCreate, db: Session = Depends(get_db)):
    s = RecoverySchemeModel(**scheme.model_dump())
    db.add(s)
    db.commit()
    db.refresh(s)
    return s
