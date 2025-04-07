from rest_framework import serializers
from expense_manager.models import *


class ExpenseSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M", input_formats=['%d/%m/%Y %H:%M', 'iso-8601'])
    
    class Meta:
        model = Expense
        fields = '__all__'
        
        
        