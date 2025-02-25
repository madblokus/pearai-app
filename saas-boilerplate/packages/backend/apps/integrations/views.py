from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle

from .claude.client import ClaudeClient
from .claude.exceptions import ClaudeClientException


class ClaudeRateThrottle(UserRateThrottle):
    rate = '20/min'


class ClaudeCodeCompletionView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ClaudeRateThrottle]

    def post(self, request, *args, **kwargs):
        """
        Get code completion from Claude

        Request body:
        {
            "prompt": "Write a function to calculate fibonacci numbers",
            "context": "Optional context about the code",
            "language": "Optional language specification"
        }
        """
        prompt = request.data.get('prompt')
        if not prompt:
            return Response(
                {'error': 'Prompt is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        context = request.data.get('context')
        language = request.data.get('language')

        try:
            result = ClaudeClient.get_code_completion(prompt, context, language)

            return Response({
                'completion': result.content,
                'model': result.model,
                'tokens_used': result.usage.total_tokens,
                'stop_reason': result.stop_reason
            })
        except ClaudeClientException as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
