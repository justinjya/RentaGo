from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import connection
from .user_controller import UserController
from ..models import Vehicle
from ..serializers import VehicleSerializer

class VehicleController(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk=None):
        user = request.user
        location = request.query_params.get('location')
        pickup_date = request.query_params.get('pickup_date')
        dropoff_date = request.query_params.get('dropoff_date')


        if user.role == 'customer' and (not location or not pickup_date or not dropoff_date):
            return Response({"error": "Required filter is empty"}, status=status.HTTP_400_BAD_REQUEST)

        price_from = request.query_params.get('price_from')
        price_to = request.query_params.get('price_to')
        rating = request.query_params.get('rating')
        size = request.query_params.get('size')
        brand = request.query_params.get('brand')
        capacity = request.query_params.get('capacity')

        vehicles = Vehicle.objects.all()
        if location:
            vehicles = vehicles.filter(location=location)
        if price_from and price_to:
            vehicles = vehicles.filter(price__range=(price_from, price_to))
        if rating:
            vehicles = vehicles.filter(rating__gte=rating)
        if size:
            vehicles = vehicles.filter(size=size)
        if brand:
            vehicles = vehicles.filter(brand=brand)
        if capacity:
            vehicles = vehicles.filter(capacity=capacity)
        if pickup_date and dropoff_date:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM backend_vehicle WHERE vehicle_id NOT IN (
                        SELECT vehicle_id FROM backend_rental
                        WHERE  (pick_up_date BETWEEN %s AND %s)
                        OR  (drop_off_date BETWEEN %s AND %s)
                        OR  (pick_up_date <= %s AND drop_off_date >= %s)
                    )
                """, [pickup_date, dropoff_date, pickup_date, dropoff_date, pickup_date, dropoff_date])
                available_vehicle_ids = [row[0] for row in cursor.fetchall()]
                    
            vehicles = vehicles.filter(pk__in=available_vehicle_ids)

        if pk:
            vehicles = vehicles.filter(pk=pk)

        if not vehicles.exists():
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