from django.db import models
from django.contrib.auth.models import AbstractBaseUser , PermissionsMixin, BaseUserManager

# Create your models here.

class UserAccountManager(BaseUserManager):
    def create_user(self,email,password=None):
        email = self.normalize_email(email)
        user = self.model(email=email)

        user.set_password(password)
        user.save()
        return user



class UserAccounts(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(max_length=255,unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserAccountManager()
    
    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email
