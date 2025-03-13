from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response

class UserRegistrationAPIView(APIView):
    def post (self, request):
        print("Entered here")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)