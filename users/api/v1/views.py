from rest_framework.views import APIView
from .serializers import PrefSerializer, UserSerializer
from rest_framework.response import Response
from ... import models
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response


# Get the currently active User model in the project
User = get_user_model()


class PrefAPIView(APIView):
    """
    API endpoint to retrieve all preferences (都道府県).
    This fetches all records from the Pref model and returns them as a serialized JSON response.
    """
    def get(self, request):

        # Get all Pref objects from the database
        prefs = models.Pref.objects.all()

        # Serialize the queryset into JSON format
        serializer =   PrefSerializer(prefs, many=True)
        return Response(serializer.data)

class UserRegistrationAPIView(APIView):
    """
    API endpoint for user registration.
    Accepts user registration details and creates a new user in the system.
    """

    def post(self, request):
        # Deserialize and validate incoming request data
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data


            # Create a new user using the validated data
            user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                tel=validated_data.get('tel'),
                pref = validated_data.get('pref')
            )
            # Return the serialized user and success status
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
