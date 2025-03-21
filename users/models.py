from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

class Pref(models.Model):
    '''
    Pref model for storing prefectures
    '''

    # field to store prefecture name
    name = models.CharField(max_length=50)

    # returns the name of the prefecture
    def __str__(self):
        return self.name


class User(AbstractUser):
    '''
    User model for storing all user information, 
    which is inherited from AbstractUser class 
    and extended by adding tel and pref fields
    '''
    
    # field to store phone number
    tel = models.CharField(max_length=20, null=True, blank=True)

    # field to store prefecture, it is a foreign key to Pref model
    pref = models.ForeignKey(Pref, on_delete=models.SET_NULL,
                             null=True, blank=True)

    # returns a string representation of the user
    def __str__(self):
        return self.username + " " + self.email + " " + (self.pref.name if self.pref else "")
        # return self.username 

