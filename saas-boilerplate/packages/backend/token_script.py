#!/usr/bin/env python
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

# Get or create a test user (change this to match an existing user if needed)
username = input("Enter username (email): ").strip()
password = input("Enter password: ").strip()

try:
    user = User.objects.get(email=username)
    # Verify the password
    if not user.check_password(password):
        print("Invalid password")
        exit(1)
except User.DoesNotExist:
    print(f"User with email {username} not found")
    exit(1)

# Generate token
token = RefreshToken.for_user(user)
print("\nAccess token (valid for a short time):")
print(str(token.access_token))
print("\nRefresh token (for getting new access tokens):")
print(str(token))
print("\nFor curl use:")
print(f'curl -X POST "http://localhost:5001/api/claude_api/stream/" \\')
print(f'  -H "Content-Type: application/json" \\')
print(f'  -H "Authorization: Bearer {token.access_token}" \\')
print(f'  -d \'{"messages":[{"role":"user","content":"Hello world"}]}\' \\')
print(f'  -v') 