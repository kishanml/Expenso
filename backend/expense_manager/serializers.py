from rest_framework import serializers
from expense_manager.models import *


class ExpenseSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateField(format="%d/%m/%Y", input_formats=['%d/%m/%Y', 'iso-8601'])
    
    class Meta:
        model = Expense
        fields = '__all__'
        
        
        