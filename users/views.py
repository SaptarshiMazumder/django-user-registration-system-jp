from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import UserRegistrationForm
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Pref
def get_prefectures(request):
    
    """
    API endpoint to retrieve all preferences (都道府県).
    This fetches all records from the Pref model and returns them as a  JSON response.
    """
    
    prefectures = list(Pref.objects.values('id', 'name'))
    return JsonResponse({'prefectures': prefectures})

# csrf_exempt for dev only
@csrf_exempt  

def register(request):

    """
    View to handle user registration form submissions.

    This view is protected by `csrf_exempt` for development convenience.
    If the request is a POST and the `Content-Type` header is `application/json`,
    the request body will be parsed as JSON and passed to the form validation.
    Otherwise, the request is treated as a standard form submission.

    If the form is valid, a new user is created and the user is redirected to the
    `registration_success` view if the request is not a JSON request.

    If the form is invalid, a JSON response with the error messages is returned
    with a status code of 400.

    If the request is invalid JSON, a JSON response with an error message is
    returned with a status code of 400.

    If the request is not a POST, a blank form is displayed.
    """

    # Handle POST requests  
    if request.method == 'POST':
        # Check if the request is a JSON request from frontend
        if request.META.get('CONTENT_TYPE') == 'application/json':

            try:
                # Parse the JSON data
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)

            # Validate the form data
            form = UserRegistrationForm(data)
            if form.is_valid():
                user = form.save(commit=False)
                user.set_password(form.cleaned_data['password'])
                user.save()
                return JsonResponse({'success': 'User created'}, 
                                    status=201)
            else:
                return JsonResponse({'errors': form.errors}, status=400)
        else:
            # Handle non-JSON requests, from template view
            form = UserRegistrationForm(request.POST)
            # Check if the form is valid, and if so save the user
            if form.is_valid():
                user = form.save(commit=False)
                user.set_password(form.cleaned_data['password'])
                user.save()
                return redirect('registration_success')
    else:
        # if the request is not a POST then render the form
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})


# redirect to success page after registration
def registration_success(request):
    return render(request, 'registration_success.html')
