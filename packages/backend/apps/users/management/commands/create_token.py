from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a JWT token for testing'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='User email')

    def handle(self, *args, **options):
        email = options['email']
        try:
            user = User.objects.get(email=email)
            token = RefreshToken.for_user(user)
            self.stdout.write(self.style.SUCCESS(f'Access token: {token.access_token}'))
            self.stdout.write(self.style.SUCCESS(f'Refresh token: {token}'))
            
            self.stdout.write("\nFor curl use:")
            self.stdout.write(f'curl -X POST "http://localhost:5001/api/claude_api/stream/" \\')
            self.stdout.write(f'  -H "Content-Type: application/json" \\')
            self.stdout.write(f'  -H "Authorization: Bearer {token.access_token}" \\')
            self.stdout.write(f'  -d \'{"messages":[{"role":"user","content":"Hello world"}]}\' \\')
            self.stdout.write(f'  -v')
            
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User with email {email} not found')) 