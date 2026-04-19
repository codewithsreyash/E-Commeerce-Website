@echo off
cd /d "%~dp0backend"

set "DB_URL=jdbc:mysql://localhost:3306/shopping_system?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
set "DB_USERNAME=root"
set "DB_PASSWORD=Sreu@2006"
set "JWT_SECRET=QWJjZEVmR2hJaktsTW5PcFFyU3RVdld4WXowMTIzNDU2Nzg5KysvPQ=="
set "JWT_EXPIRATION_MS=86400000"
set "ADMIN_USERNAME=admin@store.com"
set "ADMIN_PASSWORD=password"
set "CORS_ALLOWED_ORIGIN=http://localhost:5173"

echo Starting ShopStream Backend...
c:\Users\sreyash\Downloads\DBMS\.tools\apache-maven-3.9.14\bin\mvn.cmd spring-boot:run
pause
