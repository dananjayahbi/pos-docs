# Group D: Authentication Endpoints

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Create authentication API endpoints

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_JWT-Configuration/](../Group-C_JWT-Configuration/)
- **→ Next Group:** [../Group-E_Password-Reset-Flow/](../Group-E_Password-Reset-Flow/)

---

## Group Overview

This group creates the authentication API endpoints for user registration, login, logout, token refresh, and current user information.

### Key Outcomes
- Create auth serializers file
- Create UserSerializer
- Create RegisterSerializer
- Create LoginSerializer
- Add password validation
- Create auth views file
- Create RegisterView
- Create LoginView
- Create RefreshView
- Create LogoutView
- Create MeView (current user)
- Create auth URLs
- Add all auth endpoints

### Technology Context
- **DRF Views:** APIView and generics
- **Serializers:** Data validation/serialization
- **JWT Views:** Token obtain/refresh
- **Password Validation:** Django validators

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-49-54_Serializers.md | 49-54 | Auth serializers, UserSerializer, Register, Login, password validation |
| 02 | 02_Tasks-55-60_Views.md | 55-60 | Auth views, Register, Login, Refresh, Logout, Me views |
| 03 | 03_Tasks-61-64_URLs.md | 61-64 | URLs file, register, login, logout, me endpoints |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 49 | Create Auth Serializers | Task 48 | Simple |
| 50 | Create UserSerializer | Task 49 | Medium |
| 51 | Create RegisterSerializer | Task 50 | Medium |
| 52 | Create LoginSerializer | Task 51 | Medium |
| 53 | Add Password Validation | Task 52 | Simple |
| 54 | Create Auth Views File | Task 53 | Simple |
| 55 | Create RegisterView | Task 54 | Medium |
| 56 | Create LoginView | Task 55 | Medium |
| 57 | Create RefreshView | Task 56 | Simple |
| 58 | Create LogoutView | Task 57 | Medium |
| 59 | Create MeView | Task 58 | Simple |
| 60 | Create Auth URLs | Task 59 | Simple |
| 61 | Add register/ Endpoint | Task 60 | Simple |
| 62 | Add login/ Endpoint | Task 61 | Simple |
| 63 | Add logout/ Endpoint | Task 62 | Simple |
| 64 | Add me/ Endpoint | Task 63 | Simple |

---

## Execution Order

```
01_Tasks-49-54_Serializers.md
        │
        ▼
02_Tasks-55-60_Views.md
        │
        ▼
03_Tasks-61-64_URLs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/users/
├── serializers.py    # Auth serializers
├── views.py          # Auth views
└── urls.py           # Auth URLs
```

---

## Serializers Implementation

```python
# apps/users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 
                  'is_verified', 'date_joined']
        read_only_fields = ['id', 'is_verified', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 
                  'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords don't match"}
            )
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return User.objects.create_user(**validated_data)
```

---

## Views Implementation

```python
# apps/users/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

class MeView(generics.RetrieveUpdateAPIView):
    """Current user info endpoint."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
```

---

## URL Configuration

```python
# apps/users/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, LogoutView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
]
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/register/ | User registration | No |
| POST | /api/v1/auth/login/ | Obtain tokens | No |
| POST | /api/v1/auth/token/refresh/ | Refresh access token | No |
| POST | /api/v1/auth/logout/ | Blacklist token | Yes |
| GET/PUT | /api/v1/auth/me/ | Current user info | Yes |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete
2. **AllowAny:** Register and login are public
3. **Password Validation:** Use Django validators
4. **Token on Register:** Return tokens on registration
5. **Logout:** Blacklist refresh token
6. **Git Commit:** Commit after completing this group

