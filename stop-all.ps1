# Stop all ShopStream services
echo "========================================="
echo "   Stopping ShopStream Services..."
echo "========================================="
echo ""

echo "[1/3] Stopping Backend (Java)..."
$java = Get-Process java -ErrorAction SilentlyContinue
if ($java) {
    Stop-Process -Name java -Force
    echo "      Backend stopped."
} else {
    echo "      No backend running."
}

echo ""
echo "[2/3] Stopping Frontend (Node.js)..."
$node = Get-Process node -ErrorAction SilentlyContinue
if ($node) {
    Stop-Process -Name node -Force
    echo "      Frontend stopped."
} else {
    echo "      No frontend running."
}

echo ""
echo "[3/3] Checking for remaining processes..."
Get-Process | Where-Object {$_.Name -match "java|node"} -ErrorAction SilentlyContinue | Stop-Process -Force

echo ""
echo "========================================="
echo "   All services stopped!"
echo "========================================="
pause
