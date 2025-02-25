from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch, MagicMock
from django.contrib.auth import get_user_model
import json
from django.http import StreamingHttpResponse

User = get_user_model()

class MarianAIApiTests(TestCase):
    def setUp(self):
        # Create a test user - Note: saas-boilerplate uses a custom User model
        # that doesn't accept 'username' parameter
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Test data
        self.auth_url = reverse('marianai_auth')
        self.refresh_url = reverse('marianai_refresh_token')
        self.chat_url = reverse('marianai_chat')
        self.fim_url = reverse('marianai_fim')

        # Mock responses
        self.mock_token_response = {
            'access_token': 'test_access_token',
            'refresh_token': 'test_refresh_token',
            'expires_in': 3600
        }

        self.mock_chat_response = {
            'id': 'chat_123',
            'choices': [
                {
                    'message': {'content': 'This is a test response'},
                    'finish_reason': 'stop'
                }
            ]
        }

        self.mock_fim_response = {
            'id': 'fim_123',
            'completion': 'This is a test completion'
        }

    @override_settings(MARIANAI_API_KEY='test_api_key')
    @patch('requests.post')
    def test_auth_endpoint(self, mock_post):
        # Setup mock response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = self.mock_token_response
        mock_post.return_value = mock_response

        # Make request
        response = self.client.post(
            self.auth_url,
            {'scope': 'full'},
            format='json'
        )

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), self.mock_token_response)

        # Verify the correct request was made
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertTrue(args[0].endswith('/auth/token'))
        self.assertEqual(kwargs['headers']['Authorization'], 'Bearer test_api_key')
        self.assertEqual(kwargs['json']['user_id'], self.user.id)
        self.assertEqual(kwargs['json']['scope'], 'full')

    @patch('requests.post')
    def test_refresh_token_endpoint(self, mock_post):
        # Setup mock response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = self.mock_token_response
        mock_post.return_value = mock_response

        # Make request
        response = self.client.post(
            self.refresh_url,
            {'refresh_token': 'old_refresh_token'},
            format='json'
        )

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), self.mock_token_response)

        # Verify the correct request was made
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertTrue(args[0].endswith('/auth/refresh'))
        self.assertEqual(kwargs['json']['refresh_token'], 'old_refresh_token')

    @patch('requests.post')
    def test_chat_endpoint_non_streaming(self, mock_post):
        # Setup mock response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = self.mock_chat_response
        mock_post.return_value = mock_response

        # Make request
        response = self.client.post(
            self.chat_url,
            {
                'access_token': 'test_access_token',
                'messages': [{'role': 'user', 'content': 'Hello'}],
                'stream': False,
                'model': 'test-model'
            },
            format='json'
        )

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), self.mock_chat_response)

        # Verify the correct request was made
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertTrue(args[0].endswith('/chat'))
        self.assertEqual(kwargs['headers']['Authorization'], 'Bearer test_access_token')
        self.assertEqual(kwargs['json']['messages'], [{'role': 'user', 'content': 'Hello'}])
        self.assertEqual(kwargs['json']['stream'], False)
        self.assertEqual(kwargs['json']['model'], 'test-model')

    @patch('requests.post')
    def test_chat_endpoint_streaming(self, mock_post):
        # Setup mock streaming response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.iter_lines.return_value = [
            b'data: {"chunk": "This"}',
            b'data: {"chunk": " is"}',
            b'data: {"chunk": " streaming"}'
        ]
        mock_post.return_value = mock_response

        # Make request - ensure the content type is set correctly
        response = self.client.post(
            self.chat_url,
            {
                'access_token': 'test_access_token',
                'messages': [{'role': 'user', 'content': 'Hello'}],
                'stream': True
            },
            format='json',
            content_type='application/json'
        )

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response, StreamingHttpResponse)
        self.assertEqual(response['Content-Type'], 'text/event-stream')

        # Verify the correct request was made
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertTrue(args[0].endswith('/chat'))
        self.assertEqual(kwargs['headers']['Authorization'], 'Bearer test_access_token')
        self.assertEqual(kwargs['json']['stream'], True)
        self.assertTrue(kwargs['stream'])  # Ensure streaming is enabled in the request

    @patch('requests.post')
    def test_fim_endpoint_non_streaming(self, mock_post):
        # Setup mock response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = self.mock_fim_response
        mock_post.return_value = mock_response

        # Make request
        response = self.client.post(
            self.fim_url,
            {
                'access_token': 'test_access_token',
                'prefix': 'function hello() {',
                'suffix': '}',
                'stream': False,
                'model': 'test-model'
            },
            format='json'
        )

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), self.mock_fim_response)

        # Verify the correct request was made
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertTrue(args[0].endswith('/fim'))
        self.assertEqual(kwargs['headers']['Authorization'], 'Bearer test_access_token')
        self.assertEqual(kwargs['json']['prefix'], 'function hello() {')
        self.assertEqual(kwargs['json']['suffix'], '}')
        self.assertEqual(kwargs['json']['stream'], False)
        self.assertEqual(kwargs['json']['model'], 'test-model')

    def test_authentication_required(self):
        # Create an unauthenticated client
        client = APIClient()

        # Test each endpoint
        auth_response = client.post(self.auth_url, {}, format='json')
        refresh_response = client.post(self.refresh_url, {}, format='json')
        chat_response = client.post(self.chat_url, {}, format='json')
        fim_response = client.post(self.fim_url, {}, format='json')

        # All endpoints should require authentication
        self.assertEqual(auth_response.status_code, 401)
        self.assertEqual(refresh_response.status_code, 401)
        self.assertEqual(chat_response.status_code, 401)
        self.assertEqual(fim_response.status_code, 401)

    @override_settings(MARIANAI_API_KEY=None)
    def test_auth_missing_api_key(self):
        """Test that the auth endpoint returns an error when API key is missing"""
        response = self.client.post(self.auth_url, {'scope': 'full'}, format='json')
        self.assertEqual(response.status_code, 500)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'MarianAI API key not configured')

    def test_refresh_missing_refresh_token(self):
        """Test that the refresh endpoint returns an error when refresh token is missing"""
        response = self.client.post(self.refresh_url, {}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'Refresh token is required')

    def test_chat_missing_access_token(self):
        """Test that the chat endpoint returns an error when access token is missing"""
        response = self.client.post(
            self.chat_url,
            {'messages': [{'role': 'user', 'content': 'Hello'}]},
            format='json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'Access token is required')

    def test_fim_missing_access_token(self):
        """Test that the fim endpoint returns an error when access token is missing"""
        response = self.client.post(
            self.fim_url,
            {'prefix': 'code', 'suffix': 'more code'},
            format='json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'Access token is required')

    @patch('requests.post')
    def test_server_error_handling(self, mock_post):
        """Test handling of server errors"""
        # Override settings to ensure we have an API key set
        with self.settings(MARIANAI_API_KEY='test_api_key'):
            # Setup mock error response
            mock_response = MagicMock()
            mock_response.status_code = 500
            mock_response.json.return_value = {'error': 'Internal server error'}
            mock_post.return_value = mock_response

            # Make request
            response = self.client.post(
                self.auth_url,
                {'scope': 'full'},
                format='json'
            )

            # Error should be passed through with same status code
            self.assertEqual(response.status_code, 500)
            self.assertEqual(response.json(), {'error': 'Internal server error'})

            # Verify the correct request was made
            mock_post.assert_called_once()
            args, kwargs = mock_post.call_args
            self.assertTrue(args[0].endswith('/auth/token'))
