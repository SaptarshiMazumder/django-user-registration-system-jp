from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import UserRegistrationForm
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Pref
def get_prefectures(request):
    prefectures = list(Pref.objects.values('id', 'name'))
    return JsonResponse({'prefectures': prefectures})

@csrf_exempt  # for local dev only 

def register(request):

    if request.method == 'POST':
        if request.META.get('CONTENT_TYPE') == 'application/json':
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)


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
            form = UserRegistrationForm(request.POST)
            if form.is_valid():
                user = form.save(commit=False)
                user.set_password(form.cleaned_data['password'])
                user.save()
                return redirect('registration_success')
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})


def registration_success(request):
    return render(request, 'registration_success.html')
