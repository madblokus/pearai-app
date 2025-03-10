"""URL patterns for Claude API app."""
from django.urls import path
from . import views

app_name = 'claude_api'

urlpatterns = [
    path('generate/', views.generate_response, name='generate_response'),
    path('models/', views.get_available_models, name='get_available_models'),
    path('tool-use/', views.tool_use, name='tool_use'),
    path('stream/', views.stream_response, name='stream_response'),
]
