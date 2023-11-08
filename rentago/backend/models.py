from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "db_admin")

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    username = models.CharField(max_length=50, primary_key=True)
    email = models.EmailField(unique=True)
    blocked = models.BooleanField(default=False)
    role = models.CharField(max_length=50, default='customer')
    profile_photo = models.ImageField(upload_to='users/', blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

class Vehicle(models.Model):
    vehicle_id = models.AutoField(primary_key=True)
    image = models.ImageField(upload_to='vehicles/', blank=True, null=True)
    type = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    price = models.IntegerField()
    capacity = models.IntegerField()
    transmission = models.CharField(max_length=50)
    rating = models.FloatField(default=0)
    size = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.vehicle_id} - {self.brand} - {self.name}"

class Rental(models.Model):
    rent_id = models.AutoField(primary_key=True)
    vehicle_id = models.ForeignKey(Vehicle, on_delete=models.CASCADE, db_column='vehicle_id')
    username = models.ForeignKey(User, on_delete=models.CASCADE, db_column='username')
    pick_up_date = models.DateField()
    drop_off_date = models.DateField()
    location = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.rent_id} - {self.vehicle_id} - {self.username}"

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    rent_id = models.ForeignKey(Rental, on_delete=models.CASCADE, db_column='rent_id')
    username = models.ForeignKey(User, on_delete=models.CASCADE, db_column='username')
    time = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=50)
    amount = models.IntegerField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.payment_id} - {self.rent_id} - {self.username}"