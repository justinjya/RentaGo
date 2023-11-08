from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import User
from ..serializers import UserSerializer

class UserController(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if (UserController.is_role_valid(request, 'admin') or 
            UserController.is_role_valid(request, 'db_admin')):
            if pk:
                users = User.objects.filter(pk=pk)
                if not users:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                users = User.objects.all()
        elif UserController.is_role_valid(request, 'customer'):
            if pk and pk != request.user.pk:
                return Response(status=status.HTTP_403_FORBIDDEN)
            users = User.objects.filter(pk=request.user.pk)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def patch(self, request, pk):
        if not (UserController.is_role_valid(request, 'admin') or 
                UserController.is_role_valid(request, 'db_admin')):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        if not (UserController.is_role_valid(request, 'admin') or 
                UserController.is_role_valid(request, 'db_admin')):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        user.delete()
        return Response(status=status.HTTP_200_OK)

    def is_role_valid(request, role):
        return request.user.is_authenticated and request.user.role == role