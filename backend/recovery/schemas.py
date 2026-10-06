from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class DamageReportCreate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: str
    severity: str
    description: Optional[str] = None
    image_refs: List[str] = []
    estimated_cost: Optional[float] = None

class DamageReportResponse(BaseModel):
    id: int
    user_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: str
    severity: str
    description: Optional[str] = None
    image_refs: List[str] = []
    estimated_cost: Optional[float] = None
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class DamageReportStatusUpdate(BaseModel):
    status: str  # submitted, under_review, verified, approved, rejected

class RecoverySchemeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    eligibility: Optional[str] = None
    authority: Optional[str] = None
    contact_info: Optional[str] = None
    link: Optional[str] = None
    hazard_type: Optional[str] = None
    max_compensation: Optional[float] = None

class RecoverySchemeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    eligibility: Optional[str] = None
    authority: Optional[str] = None
    contact_info: Optional[str] = None
    link: Optional[str] = None
    hazard_type: Optional[str] = None
    max_compensation: Optional[float] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class DamageSummary(BaseModel):
    total_reports: int
    by_category: dict
    by_severity: dict
    total_estimated_cost: float
