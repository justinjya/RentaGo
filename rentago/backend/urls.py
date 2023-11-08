from django.urls import path
from .controllers import (UserController, VehicleController, RentalController, 
                          PaymentController, UserRegistrationController, 
                          UserLoginController, UserLogoutController)

urlpatterns = [
    path('users/', UserController.as_view(), name='user-list'),
    path('users/<str:pk>/', UserController.as_view(), name='user-detail'),
    path('vehicles/', VehicleController.as_view(), name='vehicle-list'),
    path('vehicles/<str:pk>/', VehicleController.as_view(), name='vehicle-detail'),
    path('rentals/', RentalController.as_view(), name='rental-list'),
    path('rentals/<str:pk>/', RentalController.as_view(), name='rental-detail'),
    path('payments/', PaymentController.as_view(), name='payment-list'),
    path('payments/<str:pk>/', PaymentController.as_view(), name='payment-detail'),
    path('register/', UserRegistrationController.as_view()),
    path('login/', UserLoginController.as_view()),
    path('logout/', UserLogoutController.as_view()),
]