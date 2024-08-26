from django.urls import path
from .views import Register, UserLogin,ProfileView, EmailChecker
urlpatterns = [
    path('user/create', Register.as_view(), name='user-create'),  # Add .as_view() here
    path('user/login', UserLogin.as_view(), name='user-login'),   # Add .as_view() here
    path('user/email-checker', EmailChecker.as_view(), name='email-checker'),  # Add .as_view() here and fix typo
    path('user/profile', ProfileView.as_view(), name='email-checker'),  # Add .as_view() here and fix typo
]