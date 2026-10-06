# Start Backend
Start-Process -FilePath "python" -ArgumentList "-m uvicorn main:app --reload --host 0.0.0.0 --port 8000" -WorkingDirectory ".\backend" -WindowStyle Normal

# Start Frontend
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory ".\frontend" -WindowStyle Normal

Write-Host "Suraksha Platform has been started successfully!" -ForegroundColor Green
Write-Host "Backend API is running at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend is starting in your default browser..." -ForegroundColor Cyan
