# Test Complete Authentication Flow
Write-Host "Testing Complete Authentication Flow" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Test 1: Access main app without authentication (should redirect)
Write-Host "`n1. Testing unauthenticated access to main app..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003/" -UseBasicParsing -MaximumRedirection 0
    Write-Host "❌ Should have redirected but didn't" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 307) {
        Write-Host "✅ Correctly redirected to signin page" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected response: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 2: Access signin page (should work)
Write-Host "`n2. Testing signin page access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003/auth/simple-signin" -UseBasicParsing
    Write-Host "✅ Signin page accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Signin page failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Access signup page (should work)
Write-Host "`n3. Testing signup page access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003/auth/signup" -UseBasicParsing
    Write-Host "✅ Signup page accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Signup page failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Create new user
Write-Host "`n4. Testing user registration..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Test User $(Get-Date -Format 'HHmmss')"
        email = "test$(Get-Date -Format 'HHmmss')@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3003/api/auth/register" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "✅ User registration successful" -ForegroundColor Green
    $userData = $response.Content | ConvertFrom-Json
    Write-Host "User ID: $($userData.userId)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ User registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Login with new user
Write-Host "`n5. Testing user login..." -ForegroundColor Yellow
try {
    $body = @{
        email = "test$(Get-Date -Format 'HHmmss')@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3003/api/auth/simple-login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "✅ User login successful" -ForegroundColor Green
    $loginData = $response.Content | ConvertFrom-Json
    Write-Host "Logged in as: $($loginData.user.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ User login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Test HSN Lookup (should work)
Write-Host "`n6. Testing HSN Lookup functionality..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003/api/hsn-lookup?q=cotton" -UseBasicParsing
    Write-Host "✅ HSN Lookup working" -ForegroundColor Green
    $hsnData = $response.Content | ConvertFrom-Json
    Write-Host "Found $($hsnData.totalResults) results for 'cotton'" -ForegroundColor Cyan
} catch {
    Write-Host "❌ HSN Lookup failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n====================================" -ForegroundColor Green
Write-Host "Authentication Flow Test Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "`nApplication is running on: http://localhost:3003" -ForegroundColor Cyan
Write-Host "Signin page: http://localhost:3003/auth/simple-signin" -ForegroundColor Cyan
Write-Host "Signup page: http://localhost:3003/auth/signup" -ForegroundColor Cyan

