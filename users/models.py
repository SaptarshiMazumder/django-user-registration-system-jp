from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

class Pref(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class User(AbstractUser):
    
    tel = models.CharField(max_length=20, null=True, blank=True)
    pref = models.ForeignKey(Pref, on_delete=models.SET_NULL,
                             null=True, blank=True)

    def __str__(self):
        return self.username

   
