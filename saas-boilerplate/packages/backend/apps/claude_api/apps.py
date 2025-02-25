from django.apps import AppConfig


class ClaudeApiConfig(AppConfig):
    """Configuration for the Claude API app."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.claude_api'
    verbose_name = 'Claude AI Integration'
