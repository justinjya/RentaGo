from django.contrib import admin
from .models import User, Vehicle, Rental, Payment

admin.site.register(User)
admin.site.register(Vehicle)
admin.site.register(Rental)
admin.site.register(Payment)
