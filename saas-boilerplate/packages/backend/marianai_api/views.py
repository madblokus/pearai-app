import json
import os
import requests
from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# MarianAI settings - make sure to add these to your settings.py
# MARIANAI_SERVER_URL = "http://localhost:5001"

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marianai_auth(request):
    """
    Endpoint to obtain access and refresh tokens from MarianAI server.
    """
    try:
        # Get API key from settings or request
        api_key = getattr(settings, 'MARIANAI_API_KEY', None)
        if not api_key and 'api_key' in request.data:
            api_key = request.data.get('api_key')

        if not api_key:
            return JsonResponse({"error": "MarianAI API key not configured"}, status=500)

        # Get MarianAI server URL from settings
        marianai_server_url = getattr(settings, 'MARIANAI_SERVER_URL', 'http://localhost:5001')

        # Prepare request to MarianAI authentication endpoint
        auth_url = f"{marianai_server_url}/auth/token"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        # Prepare request body with any additional parameters needed
        body = {
            "user_id": request.user.id,  # Associate with the requesting user
            "scope": request.data.get('scope', 'full')
        }

        # Make request to MarianAI server
        response = requests.post(
            auth_url,
            headers=headers,
            json=body
        )

        if response.status_code != 200:
            return JsonResponse(response.json(), status=response.status_code)

        # Return the tokens
        return JsonResponse(response.json())

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marianai_refresh_token(request):
    """
    Endpoint to refresh an expired access token using a refresh token.
    """
    try:
        # Get refresh token from request
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return JsonResponse({"error": "Refresh token is required"}, status=400)

        # Get MarianAI server URL from settings
        marianai_server_url = getattr(settings, 'MARIANAI_SERVER_URL', 'http://localhost:5001')

        # Prepare request to MarianAI refresh token endpoint
        refresh_url = f"{marianai_server_url}/auth/refresh"
        headers = {
            "Content-Type": "application/json"
        }

        # Prepare request body
        body = {
            "refresh_token": refresh_token
        }

        # Make request to MarianAI server
        response = requests.post(
            refresh_url,
            headers=headers,
            json=body
        )

        if response.status_code != 200:
            return JsonResponse(response.json(), status=response.status_code)

        # Return the new tokens
        return JsonResponse(response.json())

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marianai_chat(request):
    """
    Endpoint to proxy chat requests to MarianAI with streaming support.
    Similar to Claude API but adapted for MarianAI.
    """
    try:
        # Get access token from request
        access_token = request.data.get('access_token')
        if not access_token:
            return JsonResponse({"error": "Access token is required"}, status=400)

        # Get model from request
        model = request.data.get('model', getattr(settings, 'MARIANAI_MODEL', 'default'))

        # Extract request data
        data = request.data
        messages = data.get('messages', [])
        stream = data.get('stream', True)

        # Get MarianAI server URL from settings
        marianai_server_url = getattr(settings, 'MARIANAI_SERVER_URL', 'http://localhost:5001')

        # Prepare request to MarianAI chat endpoint
        chat_url = f"{marianai_server_url}/chat"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        # Prepare request body
        body = {
            "model": model,
            "messages": messages,
            "max_tokens": data.get('max_tokens', 4096),
            "stream": stream,
            # Include repository ID if available in MarianAI
            "repoId": data.get('repoId', 'global')
        }

        # Add optional parameters
        for param in ['temperature', 'top_p', 'frequency_penalty', 'presence_penalty', 'stop']:
            if param in data:
                body[param] = data.get(param)

        # Make request to MarianAI API
        if stream:
            # For streaming responses
            def event_stream():
                response = requests.post(
                    chat_url,
                    headers=headers,
                    json=body,
                    stream=True
                )

                if response.status_code != 200:
                    error_data = response.json()
                    yield f"data: {json.dumps(error_data)}\n\n"
                    return

                # Stream the response
                for line in response.iter_lines():
                    if line:
                        # Remove 'data: ' prefix if present
                        line_str = line.decode('utf-8')
                        if line_str.startswith('data: '):
                            line_str = line_str[6:]

                        # Forward the SSE data
                        yield f"data: {line_str}\n\n"

            return StreamingHttpResponse(
                event_stream(),
                content_type='text/event-stream'
            )
        else:
            # For non-streaming responses
            response = requests.post(
                chat_url,
                headers=headers,
                json=body
            )

            if response.status_code != 200:
                return JsonResponse(response.json(), status=response.status_code)

            return JsonResponse(response.json())

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marianai_fim(request):
    """
    Endpoint to proxy Fill In Middle (FIM) requests to MarianAI.
    """
    try:
        # Get access token from request
        access_token = request.data.get('access_token')
        if not access_token:
            return JsonResponse({"error": "Access token is required"}, status=400)

        # Extract request data
        data = request.data
        prefix = data.get('prefix', '')
        suffix = data.get('suffix', '')
        model = data.get('model', getattr(settings, 'MARIANAI_MODEL', 'default'))
        stream = data.get('stream', True)

        # Get MarianAI server URL from settings
        marianai_server_url = getattr(settings, 'MARIANAI_SERVER_URL', 'http://localhost:5001')

        # Prepare request to MarianAI FIM endpoint
        fim_url = f"{marianai_server_url}/fim"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        # Prepare request body
        body = {
            "model": model,
            "prefix": prefix,
            "suffix": suffix,
            "max_tokens": data.get('max_tokens', 4096),
            "stream": stream
        }

        # Add optional parameters
        for param in ['temperature', 'top_p', 'frequency_penalty', 'presence_penalty', 'stop']:
            if param in data:
                body[param] = data.get(param)

        # Make request to MarianAI API
        if stream:
            # For streaming responses
            def event_stream():
                response = requests.post(
                    fim_url,
                    headers=headers,
                    json=body,
                    stream=True
                )

                if response.status_code != 200:
                    error_data = response.json()
                    yield f"data: {json.dumps(error_data)}\n\n"
                    return

                # Stream the response
                for line in response.iter_lines():
                    if line:
                        # Remove 'data: ' prefix if present
                        line_str = line.decode('utf-8')
                        if line_str.startswith('data: '):
                            line_str = line_str[6:]

                        # Forward the SSE data
                        yield f"data: {line_str}\n\n"

            return StreamingHttpResponse(
                event_stream(),
                content_type='text/event-stream'
            )
        else:
            # For non-streaming responses
            response = requests.post(
                fim_url,
                headers=headers,
                json=body
            )

            if response.status_code != 200:
                return JsonResponse(response.json(), status=response.status_code)

            return JsonResponse(response.json())

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
