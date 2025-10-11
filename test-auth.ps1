# Test Authentication System
Write-Host "Testing EZgenie HSN Assistant Authentication System" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Test 1: Registration API
Write-Host "`n1. Testing User Registration..." -ForegroundColor Yellow
try {
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Jane Doe","email":"jane.doe@example.com","password":"password123"}' -UseBasicParsing
    Write-Host "✅ Registration API: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($registerResponse.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Registration API: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Simple Login API
Write-Host "`n2. Testing Simple Login..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/simple-login" -Method POST -ContentType "application/json" -Body '{"email":"jane.doe@example.com","password":"password123"}' -UseBasicParsing
    Write-Host "✅ Simple Login API: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($loginResponse.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Simple Login API: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: HSN Lookup API
Write-Host "`n3. Testing HSN Lookup..." -ForegroundColor Yellow
try {
    $hsnResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/hsn-lookup?q=cotton" -UseBasicParsing
    Write-Host "✅ HSN Lookup API: SUCCESS" -ForegroundColor Green
    $hsnData = $hsnResponse.Content | ConvertFrom-Json
    Write-Host "Found $($hsnData.totalResults) results for 'cotton'" -ForegroundColor Cyan
} catch {
    Write-Host "❌ HSN Lookup API: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Main Application Page
Write-Host "`n4. Testing Main Application Page..." -ForegroundColor Yellow
try {
    $mainResponse = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing
    Write-Host "✅ Main Application Page: SUCCESS (Status: $($mainResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Main Application Page: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Signup Page
Write-Host "`n5. Testing Signup Page..." -ForegroundColor Yellow
try {
    $signupResponse = Invoke-WebRequest -Uri "http://localhost:3000/auth/signup" -UseBasicParsing
    Write-Host "✅ Signup Page: SUCCESS (Status: $($signupResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Signup Page: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Simple Signin Page
Write-Host "`n6. Testing Simple Signin Page..." -ForegroundColor Yellow
try {
    $signinResponse = Invoke-WebRequest -Uri "http://localhost:3000/auth/simple-signin" -UseBasicParsing
    Write-Host "✅ Simple Signin Page: SUCCESS (Status: $($signinResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Simple Signin Page: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "Authentication System Test Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
