from django.urls import path,include,re_path
from django.urls.resolvers import URLPattern
from .views import ValidatePhoneSendOTP,ValidateOTP
app_name='accounts'

urlpatterns=[

re_path(r'^validate_phone/',ValidatePhoneSendOTP.as_view()),

re_path(r'^validate_otp/',ValidateOTP.as_view()),

]