from django.db import models
from accounts.models import User

# Create your models here.

class Group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='groups_members')

    def __str__(self):
        return self.name

class SplitWise(models.Model):
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payer = models.ForeignKey(User, related_name='paid_expenses', on_delete=models.CASCADE)
    group = models.ForeignKey(Group, related_name='expenses_group', on_delete=models.CASCADE)
    participants = models.ManyToManyField(User, related_name='participated_expenses')

    def __str__(self):
        return self.description

class Balance(models.Model):
    group = models.ForeignKey(Group, related_name='balances', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='balances', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} balance in {self.group.name}"


    