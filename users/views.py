from django.shortcuts import render, redirect
from .forms import UserRegistrationForm
from django.views.decorators.csrf import csrf_exempt 

@csrf_exempt  # for local dev only 

def register(request):
    if request.method == 'POST':
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
