from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from .models import Pref
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from .serializers import UserSerializer, PrefSerializer
from rest_framework.response import Response

User = get_user_model()

class PrefAPIView(APIView):
    def get(self, request):
        prefs = Pref.objects.all()
        serializer =   PrefSerializer(prefs, many=True)
        return Response(serializer.data)

class UserRegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                tel=validated_data.get('tel'),
                pref = validated_data.get('pref')
            )
            
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
