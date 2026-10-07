# Suraksha WebGIS & Emergency SOS Platform

A modular WebGIS-based multi-hazard risk intelligence and community response platform for landslide and flash-flood decision support in the Kamand Valley. This repository contains the integrated frontend, GIS services, machine learning modules, and the offline-first Emergency SOS application and backend.

## Project Architecture

This project is divided into several key modules:

- **`/backend`**: The FastAPI-based responder backend supporting SOS ingestion, WebGIS spatial operations, responder dashboard, and individual account persistence.
- **`/mobile`**: The React Native / Expo mobile application for Android/iOS, featuring offline-first emergency SOS transmission through phone-to-phone BLE relay.
- **`/frontend`**: The web-based frontend application (React/Vite) for general web users and WebGIS visualization.
- **`/gis`**: Geographic Information Systems processing and spatial data pipelines.
- **`/ml`**: Machine learning models for hazard prediction (e.g., Computer Vision for flash floods).
- **`/data`**: Datasets and mock data for platform simulations.

---

## 1. Emergency SOS Backend (`/backend`)

The Python FastAPI backend manages the responder dashboard, database of SOS events (PostgreSQL/PostGIS), and operator credentials.

### Features
- **SOS API**: Ingests direct and relayed SOS events, deduplicating via `event_id` and storing coordinates as GIS Points.
- **Individual Accounts**: Supports responder and admin accounts, persistent secure sessions via revocable refresh tokens, and password scrypt hashing.
- **Device Security**: Issues mTLS P-256 certificates for device enrollment and origin proof verification for BLE relays.
- **Responder Dashboard**: A web-based interface mapped to `/dashboard` providing real-time SOS alerts, OpenStreetMap locations, and Google Maps routing/ETA to victims.
- **Operator Scripts**: Command-line management via `manage_account.py` (role changes, revoking sessions, password resets).

### Tech Stack
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with PostGIS (Async SQLAlchemy / asyncpg)
- **Migrations**: Alembic
- **Realtime**: Redis Pub/Sub for WebSockets

### Quick Start
1. Navigate to `/backend`.
2. Ensure you have Python 3.11+ and install dependencies: `pip install -r requirements.txt`.
3. Set up the environment variables (`.env`).
4. Run migrations: `alembic upgrade head`.
5. Start the server: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`.

---

## 2. Emergency SOS Mobile App (`/mobile`)

The Suraksha Mobile application is designed to function even when telecommunication infrastructure fails during a disaster. 

### Features
- **Offline BLE Relay**: Uses a custom native Android Kotlin module to broadcast and scan for SOS payloads via Bluetooth Low Energy when offline.
- **Multi-hop Mesh**: Receiving phones instantly notify the user, upload the SOS to the backend if online, or rebroadcast to continue the relay chain.
- **GPS Capture**: Captures high-accuracy device location upon triggering an SOS.
- **Persistent Sessions**: Employs secure on-device storage for account credentials, auto-renewing access tokens without forcing repeated sign-ins.
- **Configurable Backend**: Users can easily update the backend address directly from the Settings UI (useful during temporary local deployments or server migrations).

### Tech Stack
- **Framework**: React Native / Expo (SDK 52)
- **Native Modules**: Custom Kotlin (Android BLE Advertising and GATT Services)
- **Language**: TypeScript

### Quick Start
1. Navigate to `/mobile`.
2. Install dependencies: `npm install`.
3. To test the native BLE features on a physical Android device:
   ```bash
   npx expo run:android
   ```
4. For general JS testing and UI rendering: `npm start` (Expo Go).

---

## Contributing

1. Review `CONTRIBUTING.md` for branching strategies (`feature/crisis`, `feature/gis`, etc.) and data limitations.
2. For mobile changes, ensure `npx expo lint` and `npx tsc --noEmit` pass.
3. For backend changes, ensure `pytest -x -q` passes and all schema modifications have corresponding Alembic migrations.

## License & Ownership
This repository integrates work from the multi-disciplinary Suraksha teams (WebGIS, ML, Mobile App, and Backend).
