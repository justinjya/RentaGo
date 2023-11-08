from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .user_controller import UserController
from ..models import Vehicle
from ..serializers import VehicleSerializer

class VehicleController(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk=None):
        try:
            if pk:
                vehicles = Vehicle.objects.filter(pk=pk)
            else:
                vehicles = Vehicle.objects.all()
        except Vehicle.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        if not (UserController.is_role_valid(request, 'admin') or 
                UserController.is_role_valid(request, 'db_admin')):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk=None):
        if pk is None:
            return Response({"detail": "Missing vehicle ID"}, status=status.HTTP_400_BAD_REQUEST)

        if not (UserController.is_role_valid(request, 'admin') or
                 UserController.is_role_valid(request, 'db_admin')):
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            vehicle = Vehicle.objects.get(pk=pk)
        except Vehicle.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = VehicleSerializer(vehicle, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        if pk is None:
            return Response({"detail": "Missing vehicle ID"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not (UserController.is_role_valid(request, 'admin') or 
                UserController.is_role_valid(request, 'db_admin')):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        try:
            vehicle = Vehicle.objects.get(pk=pk)
        except Vehicle.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        vehicle.delete()
        return Response(status=status.HTTP_200_OK)
    
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(VehicleController, self).get_permissions()