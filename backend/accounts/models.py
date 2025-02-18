from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
import uuid 

class AbstractBaseModel(models.Model):
    """
    Base abstract model for all models, uuid is the secondary primary key
    """
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __repr__(self):
        return f'<{self.__class__.__name__} {self.uuid}>'

#  Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, name,  is_verified = False,password=None, password2=None):
        """
        Creates and saves a User with the given email, name and password.
        """
        if not email:
            raise ValueError('User must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            is_verified = is_verified,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        """
        Creates and saves a superuser with the given email, name and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            is_verified = True
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

#  Custom User Model

class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='Email',
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email + " - " + self.name 

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: all admins have the possiblity
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
    
class ProfileData(AbstractBaseModel):
    user = models.ForeignKey(User, related_name="user_profile", on_delete=models.CASCADE,null= True, blank=True)
    # role_type = models.CharField(max_length=20, choices=USER_ROLE_TYPES, default='BASIC')
    contact_number = models.CharField(max_length=25, blank=True, null=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'profile_data'

    def __str__(self) -> str:
        return str(self.id) + " - " + ( str(self.user.name) + " - " + str(self.user.email)  if self.user else "")
