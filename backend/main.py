import json
from typing import List
from datetime import datetime, timedelta
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import hashlib
import secrets
from jose import JWTError, jwt

from database import engine, Base, get_db
from models import ChallengeModel, UserReadinessModel, UserModel
from schemas import (
    ChallengeResponse,
    ChallengeCreate,
    ChallengeSubmission,
    VerificationResult,
    UserReadinessProfile,
    UserCreate,
    Token,
    TokenData,
)
from community.models import VolunteerModel, SafeCheckModel, HelpRequestModel
from community.router import router as community_router
from recovery.models import DamageReportModel, RecoverySchemeModel
from recovery.router import router as recovery_router
from recovery.seed import seed_recovery_schemes
from preparedness.models import SafetyTipModel, MicroChallengeModel, UserMicroChallengeModel
from preparedness.router import router as preparedness_content_router
from preparedness.seed import seed_preparedness_content

# --- Auth config ---
SECRET_KEY = "disaster-prep-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    salt, stored_hash = hashed_password.split("$")
    computed = hashlib.sha256((salt + plain_password).encode()).hexdigest()
    return secrets.compare_digest(computed, stored_hash)


def get_password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}${hashed}"


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(UserModel).filter(UserModel.username == username).first()
    if user is None:
        raise credentials_exception
    return user


def require_admin(current_user: UserModel = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# --- Seed data ---
def seed_initial_scenarios(db: Session):
    if db.query(ChallengeModel).count() > 0:
        return

    scenarios = [
        ChallengeModel(
            hazard_type="earthquake",
            scenario_svg_key="room_shaking",
            options_payload=json.dumps([
                {"id": "opt_window", "symbol": "stand_near_window"},
                {"id": "opt_table", "symbol": "drop_cover_hold_table"},
                {"id": "opt_elevator", "symbol": "enter_elevator"}
            ]),
            correct_option_id="opt_table",
            points=25,
        ),
        ChallengeModel(
            hazard_type="flood",
            scenario_svg_key="rising_water_street",
            options_payload=json.dumps([
                {"id": "opt_walk_water", "symbol": "walk_into_water"},
                {"id": "opt_high_roof", "symbol": "climb_high_ground"},
                {"id": "opt_underground", "symbol": "run_to_basement"}
            ]),
            correct_option_id="opt_high_roof",
            points=25,
        ),
        ChallengeModel(
            hazard_type="fire",
            scenario_svg_key="smoke_corridor",
            options_payload=json.dumps([
                {"id": "opt_stand_up", "symbol": "run_upright"},
                {"id": "opt_crawl_low", "symbol": "crawl_under_smoke"},
                {"id": "opt_lock_door", "symbol": "lock_inside_closet"}
            ]),
            correct_option_id="opt_crawl_low",
            points=25,
        ),
        ChallengeModel(
            hazard_type="tornado",
            scenario_svg_key="dark_funnel_sky",
            options_payload=json.dumps([
                {"id": "opt_drive_away", "symbol": "drive_fast_away"},
                {"id": "opt_basement", "symbol": "go_to_basement"},
                {"id": "opt_stand_outside", "symbol": "stand_outside_watch"}
            ]),
            correct_option_id="opt_basement",
            points=25,
        ),
        ChallengeModel(
            hazard_type="tsunami",
            scenario_svg_key="ocean_receding",
            options_payload=json.dumps([
                {"id": "opt_beach", "symbol": "walk_to_beach"},
                {"id": "opt_inland_high", "symbol": "run_inland_uphill"},
                {"id": "opt_stay_home", "symbol": "stay_in_house"}
            ]),
            correct_option_id="opt_inland_high",
            points=25,
        ),
    ]
    db.add_all(scenarios)

    # Seed a default admin user (admin / admin123)
    if db.query(UserModel).filter(UserModel.username == "admin").count() == 0:
        admin = UserModel(
            username="admin",
            password_hash=get_password_hash("admin123"),
            is_admin=True,
        )
        db.add(admin)

    db.commit()


Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db())
    seed_initial_scenarios(db)
    seed_recovery_schemes(db)
    seed_preparedness_content(db)
    db.close()
    yield


app = FastAPI(title="Disaster Preparedness Service", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(community_router)
app.include_router(recovery_router)
app.include_router(preparedness_content_router)

# =================== AUTH ROUTES ===================

@app.post("/api/v1/auth/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(UserModel).filter(UserModel.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    user = UserModel(
        username=user_data.username,
        password_hash=get_password_hash(user_data.password),
        is_admin=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(data={"sub": user.username, "is_admin": user.is_admin})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/api/v1/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(data={"sub": user.username, "is_admin": user.is_admin})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/api/v1/auth/me")
def get_me(current_user: UserModel = Depends(get_current_user)):
    return {"username": current_user.username, "is_admin": current_user.is_admin}


# =================== CHALLENGE ROUTES ===================

@app.get("/api/v1/preparedness/challenges", response_model=List[ChallengeResponse])
def get_challenges(db: Session = Depends(get_db)):
    challenges = db.query(ChallengeModel).all()
    response = []
    for c in challenges:
        opts = [{"id": opt["id"], "symbol": opt["symbol"]} for opt in c.options]
        response.append(ChallengeResponse(
            id=c.id, hazard_type=c.hazard_type, scenario_svg_key=c.scenario_svg_key,
            options=opts, points=c.points
        ))
    return response


@app.get("/api/v1/preparedness/users/{user_id}/readiness", response_model=UserReadinessProfile)
def get_user_readiness(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(UserReadinessModel).filter(UserReadinessModel.user_id == user_id).first()
    if not profile:
        profile = UserReadinessModel(user_id=user_id, score=0)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return UserReadinessProfile(
        user_id=profile.user_id, score=profile.score,
        completed_challenges=profile.get_completed(), unlocked_badges=profile.get_badges()
    )


@app.post("/api/v1/preparedness/users/{user_id}/challenges/{challenge_id}/verify", response_model=VerificationResult)
def verify_challenge_solution(
    user_id: str, challenge_id: int, submission: ChallengeSubmission, db: Session = Depends(get_db)
):
    challenge = db.query(ChallengeModel).filter(ChallengeModel.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    profile = db.query(UserReadinessModel).filter(UserReadinessModel.user_id == user_id).first()
    if not profile:
        profile = UserReadinessModel(user_id=user_id, score=0)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    completed = profile.get_completed()
    badges = profile.get_badges()
    is_correct = (submission.selected_option_id == challenge.correct_option_id)
    points_awarded = 0
    newly_unlocked_badge = None

    if is_correct and challenge.id not in completed:
        points_awarded = challenge.points
        profile.score += points_awarded
        completed.append(challenge.id)
        profile.set_completed(completed)

        if profile.score >= 50 and "First_Responder" not in badges:
            badges.append("First_Responder")
            newly_unlocked_badge = "First_Responder"
        if profile.score >= 75 and "Disaster_Ready_Hero" not in badges:
            badges.append("Disaster_Ready_Hero")
            newly_unlocked_badge = "Disaster_Ready_Hero"
        if profile.score >= 100 and "Survival_Expert" not in badges:
            badges.append("Survival_Expert")
            newly_unlocked_badge = "Survival_Expert"
        if profile.score >= 125 and "Emergency_Legend" not in badges:
            badges.append("Emergency_Legend")
            newly_unlocked_badge = "Emergency_Legend"

        profile.set_badges(badges)
        db.commit()

    return VerificationResult(
        is_correct=is_correct, correct_option_id=challenge.correct_option_id,
        points_awarded=points_awarded, current_readiness_score=profile.score,
        unlocked_badge=newly_unlocked_badge
    )


# =================== ADMIN ROUTES ===================

@app.post("/api/v1/admin/challenges", response_model=ChallengeResponse)
def create_challenge(
    data: ChallengeCreate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_admin),
):
    challenge = ChallengeModel(
        hazard_type=data.hazard_type,
        scenario_svg_key=data.scenario_svg_key,
        options_payload=json.dumps([o.model_dump() for o in data.options]),
        correct_option_id=data.correct_option_id,
        points=data.points,
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    opts = [{"id": opt["id"], "symbol": opt["symbol"]} for opt in challenge.options]
    return ChallengeResponse(
        id=challenge.id, hazard_type=challenge.hazard_type,
        scenario_svg_key=challenge.scenario_svg_key, options=opts, points=challenge.points
    )


@app.delete("/api/v1/admin/challenges/{challenge_id}")
def delete_challenge(
    challenge_id: int,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_admin),
):
    challenge = db.query(ChallengeModel).filter(ChallengeModel.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    db.delete(challenge)
    db.commit()
    return {"detail": "Challenge deleted"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)