from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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
        if not (UserController.is_role_valid(request, 'admin') or 
                UserController.is_role_valid(request, 'db_admin')):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        try:
            rental = Rental.objects.get(pk=pk)
        except Rental.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = RentalSerializer(rental, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
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