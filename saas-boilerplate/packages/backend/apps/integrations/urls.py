from django.urls import path
from .views import ClaudeCodeCompletionView

urlpatterns = [
    path('claude/code-completion/', ClaudeCodeCompletionView.as_view(), name='claude-code-completion'),
]
