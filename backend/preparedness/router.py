from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import UserReadinessModel
from .models import SafetyTipModel, MicroChallengeModel, UserMicroChallengeModel
from .schemas import (
    SafetyTipCreate, SafetyTipResponse,
    MicroChallengeCreate, MicroChallengeResponse, MicroChallengeComplete,
    ReadinessOverview
)

router = APIRouter(prefix="/api/v1/preparedness-content", tags=["preparedness-content"])

@router.get("/safety-tips", response_model=List[SafetyTipResponse])
def list_safety_tips(hazard_type: Optional[str] = None, phase: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SafetyTipModel)
    if hazard_type: query = query.filter(SafetyTipModel.hazard_type == hazard_type)
    if phase: query = query.filter(SafetyTipModel.phase == phase)
    return query.all()

@router.get("/safety-tips/{tip_id}", response_model=SafetyTipResponse)
def get_safety_tip(tip_id: int, db: Session = Depends(get_db)):
    t = db.query(SafetyTipModel).filter(SafetyTipModel.id == tip_id).first()
    if not t: raise HTTPException(status_code=404, detail="Not found")
    return t

@router.post("/safety-tips", response_model=SafetyTipResponse)
def create_safety_tip(tip: SafetyTipCreate, db: Session = Depends(get_db)):
    t = SafetyTipModel(**tip.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

@router.get("/micro-challenges", response_model=List[MicroChallengeResponse])
def list_micro_challenges(user_id: Optional[str] = None, db: Session = Depends(get_db)):
    challenges = db.query(MicroChallengeModel).all()
    completed_ids = set()
    if user_id:
        completed = db.query(UserMicroChallengeModel).filter(UserMicroChallengeModel.user_id == user_id).all()
        completed_ids = {c.challenge_id for c in completed}
    
    resp = []
    for c in challenges:
        r = MicroChallengeResponse.model_validate(c)
        r.is_completed = c.id in completed_ids
        resp.append(r)
    return resp

@router.post("/micro-challenges", response_model=MicroChallengeResponse)
def create_micro_challenge(mc: MicroChallengeCreate, db: Session = Depends(get_db)):
    c = MicroChallengeModel(**mc.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.post("/micro-challenges/{challenge_id}/complete")
def complete_micro_challenge(challenge_id: int, user_id: str = Query(...), db: Session = Depends(get_db)):
    c = db.query(MicroChallengeModel).filter(MicroChallengeModel.id == challenge_id).first()
    if not c: raise HTTPException(status_code=404, detail="Challenge not found")
    
    existing = db.query(UserMicroChallengeModel).filter(
        UserMicroChallengeModel.user_id == user_id,
        UserMicroChallengeModel.challenge_id == challenge_id
    ).first()
    if existing:
        return {"detail": "Already completed"}
        
    umc = UserMicroChallengeModel(user_id=user_id, challenge_id=challenge_id)
    db.add(umc)
    db.commit()
    return {"detail": "Completed", "points": c.points}

@router.get("/readiness-overview/{user_id}", response_model=ReadinessOverview)
def get_readiness_overview(user_id: str, db: Session = Depends(get_db)):
    # Quiz score
    profile = db.query(UserReadinessModel).filter(UserReadinessModel.user_id == user_id).first()
    quiz_score = profile.score if profile else 0
    quizzes_completed = len(profile.get_completed()) if profile else 0
    badges = profile.get_badges() if profile else []
    
    # Micro challenges
    completed = db.query(UserMicroChallengeModel).filter(UserMicroChallengeModel.user_id == user_id).all()
    mc_count = len(completed)
    mc_points = 0
    if mc_count > 0:
        c_ids = [c.challenge_id for c in completed]
        mcs = db.query(MicroChallengeModel).filter(MicroChallengeModel.id.in_(c_ids)).all()
        mc_points = sum(c.points for c in mcs)
        
    total_points = quiz_score + mc_points
    
    if total_points < 50: level = "beginner"
    elif total_points < 100: level = "intermediate"
    elif total_points < 150: level = "prepared"
    else: level = "expert"
    
    return ReadinessOverview(
        quiz_score=quiz_score,
        quizzes_completed=quizzes_completed,
        micro_challenges_completed=mc_count,
        total_points=total_points,
        level=level,
        badges=badges
    )
