from django.contrib import admin

# Register your models here.
from django.contrib.auth import get_user_model
from django.contrib import admin
User = get_user_model()


from .models import PhoneOTP
admin.site.register(PhoneOTP)

admin.site.register(User)




        

