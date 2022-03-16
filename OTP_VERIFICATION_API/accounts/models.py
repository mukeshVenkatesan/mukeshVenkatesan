from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, is_staff=False, is_active=True, is_admin=False):
       
        user_obj = self.model(
            username=username
        )
        user_obj.set_password(password)
        user_obj.staff = is_staff
        user_obj.admin = is_admin
        user_obj.active = is_active
        user_obj.save(using=self._db)
        return user_obj

    def create_staffuser(self, phone, password=None):
        user = self.create_user(
            phone,
            password=password,
            is_staff=True,


        )
        return user

    def create_superuser(self, phone, password=None):
        user = self.create_user(
            phone,
            password=password,
            is_staff=True,
            is_admin=True,


        )
        return user

class User(AbstractBaseUser):
    username=models.CharField(unique=True, null=True, blank=True,max_length=9)
    phone_regex = RegexValidator( regex   =r'^[6-9]\d{9}$', message ="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed.")
    phone       = models.CharField(validators=[phone_regex], max_length=10)
    active      = models.BooleanField(default=True)
    staff       = models.BooleanField(default=False)
    

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    

    objects = UserManager()

    def  __str__(self):
        return self.username

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_active(self):
        return self.active


class PhoneOTP(models.Model):
    phone_regex = RegexValidator( regex   =r'^\+?1?\d{9,14}$', message ="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed.")
    phone       = models.CharField(validators=[phone_regex], max_length=17)
    otp         = models.CharField(max_length = 9, blank = True, null= True)
    validated=models.BooleanField(default=False,help_text="True,OTP verified")
    def __str__(self):
        return str(self.phone)+'is sent'+str(self.otp)