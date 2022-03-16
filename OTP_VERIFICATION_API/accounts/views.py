from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from .models import User,PhoneOTP
from .serializers import CreateUserSerializer
class ValidatePhoneSendOTP(APIView):
    def post(self,request,*args,**kwargs):
        phone_number=request.data.get('phone')
        
        if phone_number:
            phone=str(phone_number)
            user=User.objects.filter(phone__iexact=phone)
            key =send_otp(phone)
            if key:
                PhoneOTP.objects.create(phone=phone,otp=key,)
                return Response({'status':True,'detail':'OTP sent successfully'})
            else:
                return Response({
                        'status':False,'detail':'OTP sending error'
                    })
        else:
            return Response({
              'status': False, 'detail' : "I haven't received any phone number. Please do a POST request."            
                })
                
class ValidateOTP(APIView):


    def post(self, request, *args, **kwargs):
        phone = request.data.get('phone', False)
        otp_entered   = request.data.get('otp', False)

        if phone and otp_entered:
            old = PhoneOTP.objects.filter(phone__iexact = phone)
            old = old.first()
            print(old)
            otp = old.otp
            print(otp)
            if str(otp) == str(otp_entered):
                old.logged = True
                old.save()
                if old.logged:
                    Temp_data = {'phone': phone, 'active': True }

                    serializer = CreateUserSerializer(data=Temp_data)
                    serializer.is_valid(raise_exception=True)
                    user = serializer.save()
                    user.save()
                    return Response({
                        'status' : True, 
                        'detail' : 'OTP matched'
                    })
            else:
                return Response({
                    'status' : False, 
                    'detail' : 'OTP incorrect, please try again'
                })
            
        else:
            return Response({
                'status' : 'False',
                'detail' : 'Either phone or otp was not recieved in Post request'
            })


#Helper function to send OTP
import random
def send_otp(phone):
    if phone:
        key=random.randint(1000,9999)
        print(key)
        return key
    else:
        return False
