from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from accounts.models import User, ProfileData
from accounts.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer, ProfileDataSerializers
from django.contrib.auth import authenticate
from accounts.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from accounts.utils import *
from django.http.response import Http404
from django.shortcuts import get_object_or_404
from django.contrib.sites.shortcuts import get_current_site
from rest_framework import generics
from django.urls import reverse
import jwt
from django.conf import settings

from django.template.loader import render_to_string

# Generate Token Manually


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if User.objects.filter(email = request.data["email"]).exists():
            return  Response({"errors": {
                                    "email": [
                                        "Email already exists"
                                    ]
                                }   
                            }, status = status.HTTP_400_BAD_REQUEST)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)["access"]
        # print(token)
        current_site = get_current_site(request).domain
        print(current_site)
        if current_site == "localhost":
            current_site = "http://127.0.0.1:8000"
        if current_site == "localhost:8000":
            current_site ="http://127.0.0.1:8000"
        relativeLink = reverse('email-verify')


        link = 'http://'+current_site+relativeLink+"?token="+token
        link = current_site+relativeLink+"?token="+token
        # link = 'http://127.0.0.1:5173/verify-email/?token='+token
        # body = 'Click Following Link to Activate your Expenso Account.\n\n\n'+link
        
        html_message = render_to_string(
            'email/email_verification.html',  
            {
                'username': user.name,
                'link': link
            }
        )

        data = {
            'subject': 'Verify your Expenso account',
            'body': 'Please use an HTML-enabled email client to view this message.',
            'html_message': html_message, 
            'to_email': user.email
        }
        Util.send_email_to_user(data)
        return Response({'msg': 'User registration successful. Please check your email to activate your account.'}, status=status.HTTP_201_CREATED)


class VerifyEmail(generics.GenericAPIView):
    renderer_classes = [UserRenderer]

    def get(self, request):
        token = request.GET.get('token')
        try:
            # token = request.GET.get('token')
            payload = jwt.decode( token, settings.SECRET_KEY, algorithms=['HS256'])
            print(payload['user_id'])
            # payload = jwt.decode(token, options={"verify_signature": False})
            user = User.objects.filter(id=payload['user_id'])
            if not user:
                return Response({"error": "Invalid Activation link"}, status=status.HTTP_400_BAD_REQUEST)

            if not user[0].is_verified:
                user[0].is_verified = True
            user[0].save()
            return Response({"msg": "Account activated succesfully"}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError as e:
            return Response({"error": "Activation link expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as e:
            return Response({"error": "Invalid Token request new one"}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)

        if user is not None:
            token = get_tokens_for_user(user)
            if not user.is_verified:
                return Response({'errors': {'non_field_errors': ['Account not activated. Please activate your account first.']}}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'token': token, 'msg': 'Login Success'}, status=status.HTTP_200_OK)
        else:
            return Response({'errors': {'non_field_errors': ['Invalid email or password. Please check and try again.']}}, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def add_profile_data(self, user_data):
        try:
            profile = get_object_or_404(ProfileData, user = user_data["id"])
            profile_serializer = ProfileDataSerializers(profile).data
            user_data = {**profile_serializer, **user_data}   
            return user_data        
        except Http404:
            return user_data

    def add_ui_data(self, profile_data):
        user_obj = User.objects.get(id = profile_data["user"])
        profile_data["name"] = user_obj.name
        profile_data["email"] = user_obj.email
    
    def update_profile(self,id , profile_data):
        try:
            profile_obj = get_object_or_404(ProfileData, user_id=id)
            for key, value in profile_data.items():
                setattr(profile_obj, key, value)
            profile_obj.save()
            serializer = ProfileDataSerializers(profile_obj).data
            self.add_ui_data(serializer)
            return {"error":False, "msg":"User profile updated succesfully", "data":serializer}
        except Http404:
            for field in ["contact_number","profile_picture","game_ids"]:
                if field not in profile_data:
                    return {"error":True,"msg":f"{field} not present in request data","data":None}

            profile_data["user"] = int(id)
            serializer = ProfileDataSerializers(data=profile_data)
            if not serializer.is_valid():
                msg = GET_FIELD_ERRORS_FORMAT(serializer.errors)
                return {"error": True, "msg": msg, "data": None}
            if serializer.is_valid():
                serializer.save()
                saved_data = serializer.data
                self.add_ui_data(saved_data)
                return {"error":True, "msg":"User profile updated Succesfully", "data":saved_data}

        
    
    def get(self, request, format=None):
        user_data = UserProfileSerializer(request.user).data
        user_data = self.add_profile_data(user_data)
        return Response(user_data, status=status.HTTP_200_OK)
    
    def put(self, request):
        query_params = request.query_params

        if query_params:
            if 'id' in query_params:
                number = int(query_params.get('id', None) )# /profile/?id=5
                ret = self.update_profile(number, request.data)
                if ret['error'] == True:
                    return Response(ret, status=status.HTTP_400_BAD_REQUEST)
                return Response(ret, status=status.HTTP_200_OK)
            else:
                return Response({"error": True, "msg": "invalid query params in url", "data": None}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": True, "msg": "User id expected in query params in url", "data": None}, status=status.HTTP_400_BAD_REQUEST)


class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user =  request.user 
        old_password = request.data["old_password"]
        if not user.check_password('{}'.format(old_password)):
            return Response({"errors": {
                    "non_field_errors": [
                        "Current password doesnt match the old Password"
                    ]
                }}, status= status.HTTP_400_BAD_REQUEST)
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Changed Successfully'}, status=status.HTTP_200_OK)


class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)


class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Successfully'}, status=status.HTTP_200_OK)


# class SendActivationEmailView(APIView):
#   renderer_classes = [UserRenderer]
#   def post(self, request, format=None):
#     serializer = SendPasswordResetEmailSerializer(data=request.data)
#     serializer.is_valid(raise_exception=True)
#     return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)
