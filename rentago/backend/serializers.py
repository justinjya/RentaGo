from rest_framework import serializers
from .models import User, Vehicle, Rental, Payment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

    def validate_type(self, value):
        allowed_types = ['Car', 'Motorcycle']
        if value not in allowed_types:
            raise serializers.ValidationError(f"Invalid type. Allowed types are {allowed_types}.")
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_capacity(self, value):
        if value < 1 or value > 9:
            raise serializers.ValidationError("Invalid capacity. Capacity must be between 1 and 9.")
        return value

    def validate_transmission(self, value):
        allowed_transmissions = ['Manual', 'Automatic']
        if value not in allowed_transmissions:
            raise serializers.ValidationError(f"Invalid transmission. Allowed transmissions are {allowed_transmissions}.")
        return value

class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'