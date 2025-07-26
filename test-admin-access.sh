#!/bin/bash

echo "🔒 Testing Admin Access Control"
echo "================================"

BASE_URL="http://localhost:3000"

# Test 1: Unauthenticated user
echo "Test 1: Unauthenticated user accessing /admin"
rm -f cookies.txt
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/admin)
echo "Response code: $RESPONSE"
if [ "$RESPONSE" = "200" ]; then
    echo "❌ FAIL: Unauthenticated user should not access admin pages"
else
    echo "✅ PASS: Unauthenticated user correctly blocked"
fi
echo ""

# Test 2: Regular user
echo "Test 2: Regular user accessing /admin"
rm -f cookies.txt
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "Boribuz3254.2025"}' \
  -c cookies.txt -s > /dev/null

ADMIN_CONTENT=$(curl -b cookies.txt -s $BASE_URL/admin | grep -o "Restaurant Admin Panel" | head -1)
if [ "$ADMIN_CONTENT" = "Restaurant Admin Panel" ]; then
    echo "❌ FAIL: Regular user should not see admin content"
else
    echo "✅ PASS: Regular user correctly blocked from admin content"
fi
echo ""

# Test 3: Admin user
echo "Test 3: Admin user accessing /admin"
rm -f cookies.txt
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@boribuz.ca", "password": "Boribuz3254.2025"}' \
  -c cookies.txt -s > /dev/null

ADMIN_CONTENT=$(curl -b cookies.txt -s $BASE_URL/admin | grep -o "Restaurant Admin Panel" | head -1)
if [ "$ADMIN_CONTENT" = "Restaurant Admin Panel" ]; then
    echo "✅ PASS: Admin user can access admin content"
else
    echo "❌ FAIL: Admin user should be able to access admin content"
fi
echo ""

# Clean up
rm -f cookies.txt

echo "🔒 Admin Access Control Test Complete"
