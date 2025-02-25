from django.shortcuts import render
import json
import os
import requests
from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claude_chat(request):
    """
    Endpoint to proxy requests to Claude API with streaming support.
    """
    try:
        # Get API key from settings
        api_key = settings.CLAUDE_API_KEY
        if not api_key:
            return JsonResponse({"error": "Claude API key not configured"}, status=500)

        # Get model from settings or request
        model = request.data.get('model', settings.CLAUDE_MODEL)

        # Extract request data
        data = request.data
        messages = data.get('messages', [])
        system_message = data.get('system', None)
        stream = data.get('stream', True)

        # Prepare request to Claude API
        claude_url = "https://api.anthropic.com/v1/messages"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "anthropic-version": "2023-06-01",
            "x-api-key": api_key
        }

        # Prepare request body
        body = {
            "model": model,
            "messages": messages,
            "max_tokens": data.get('max_tokens', 4096),
            "stream": stream
        }

        # Add system message if provided
        if system_message:
            body["system"] = system_message

        # Add optional parameters if provided
        if 'temperature' in data:
            body["temperature"] = data.get('temperature')
        if 'top_p' in data:
            body["top_p"] = data.get('top_p')
        if 'top_k' in data:
            body["top_k"] = data.get('top_k')
        if 'stop_sequences' in data:
            body["stop_sequences"] = data.get('stop_sequences')

        # Make request to Claude API
        if stream:
            # For streaming responses
            def event_stream():
                response = requests.post(
                    claude_url,
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
                claude_url,
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
def claude_completion(request):
    """
    Endpoint to proxy completion requests to Claude API.
    This is a simplified version that converts completion requests to chat format.
    """
    try:
        # Get the prompt from the request
        data = request.data
        prompt = data.get('prompt', '')

        # Convert to messages format
        messages = [{"role": "user", "content": prompt}]

        # Create a new request with messages
        new_data = {
            "messages": messages,
            "model": data.get('model', settings.CLAUDE_MODEL),
            "max_tokens": data.get('max_tokens', 4096),
            "stream": data.get('stream', True),
            "system": data.get('system', None)
        }

        # Add optional parameters if provided
        if 'temperature' in data:
            new_data["temperature"] = data.get('temperature')
        if 'top_p' in data:
            new_data["top_p"] = data.get('top_p')
        if 'top_k' in data:
            new_data["top_k"] = data.get('top_k')
        if 'stop_sequences' in data:
            new_data["stop_sequences"] = data.get('stop_sequences')

        # Create a new request object with the modified data
        request.data.clear()
        request.data.update(new_data)

        # Forward to the chat endpoint
        return claude_chat(request)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
