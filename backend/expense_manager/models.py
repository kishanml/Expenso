from django.db import models
from django.contrib.postgres.fields import ArrayField
from expense_manager.utils import *
from accounts.models import User
# Create your models here.

def default_admin_user():
    return User.objects.get(name='kishan')


class Expense(models.Model):
    user = models.ForeignKey(User, related_name='expenso_user',on_delete=models.SET(default_admin_user))
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    transaction_amount = models.FloatField(default=0)
    transaction_date = models.DateTimeField(null = True, blank = True)
    payer_name = models.CharField(max_length=200)
    debit_category = models.CharField(max_length=10, choices=DEBIT_CATEGORY_CHOICES)
    sub_category = models.CharField(max_length=200) 
    documents_location = ArrayField(models.CharField(max_length=255, blank=True, null=True), blank=True, default=list) # location of other fields documents saved in s3 
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'expense'

    def __str__(self) -> str:
        return self.id + " - "+ self.payer_name + "(" + str(self.transaction_type) + ") - " + str(self.transaction_date)

    

