from django.urls import path
from . import views

urlpatterns = [
    path('auth/', views.marianai_auth, name='marianai_auth'),
    path('refresh/', views.marianai_refresh_token, name='marianai_refresh_token'),
    path('chat/', views.marianai_chat, name='marianai_chat'),
    path('fim/', views.marianai_fim, name='marianai_fim'),
]
