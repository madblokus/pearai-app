from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.claude_chat, name='claude_chat'),
    path('completion/', views.claude_completion, name='claude_completion'),
]
