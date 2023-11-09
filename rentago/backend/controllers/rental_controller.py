from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg
from datetime import datetime
from .user_controller import UserController
from ..models import Rental
from ..serializers import RentalSerializer

class RentalController(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        try:
            if pk:
                rentals = Rental.objects.filter(pk=pk)
            else:
                rentals = Rental.objects.all()
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = RentalSerializer(rentals, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = RentalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(username=request.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        try:
            rental = Rental.objects.get(pk=pk)
        except Rental.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not (request.user == rental.username or UserController.is_role_valid(request, 'admin') or UserController.is_role_valid(request, 'db_admin')):
            return Response(status=status.HTTP_403_FORBIDDEN)

        if 'rating' in request.data:
            if datetime.now().date() < rental.drop_off_date:
                return Response({"error": "You can only rate the vehicle after the drop off date"}, status=status.HTTP_400_BAD_REQUEST)
            data = {'rating': request.data['rating']}
        else:
            return Response({"error": "Only the rating can be updated"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RentalSerializer(rental, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            self.update_vehicle_rating(rental)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    @staticmethod
    def update_vehicle_rating(rental):
        vehicle_id = rental.vehicle_id
        rentals = Rental.objects.filter(vehicle_id=vehicle_id, rating__gt=0)
        average_rating = rentals.aggregate(Avg('rating'))['rating__avg']
        vehicle_id.rating = average_rating
        vehicle_id.save()
    
    def delete(self, request, pk):
        if not (UserController.is_role_valid(request, 'admin') or 
                UserController.is_role_valid(request, 'db_admin')):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        try:
            rental = Rental.objects.get(pk=pk)
        except Rental.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        rental.delete()
        return Response(status=status.HTTP_200_OK)