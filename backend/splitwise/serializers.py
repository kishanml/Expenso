from rest_framework import serializers
from accounts.serializers import UserProfileSerializer
from splitwise.models import Group, SplitWise, Balance


class GroupSerializer(serializers.ModelSerializer):
    members = UserProfileSerializer(many=True, read_only=True)
    class Meta:
        model = Group
        fields = ['id', 'name', 'members']

class SplitWiseExpenseSerializer(serializers.ModelSerializer):
    payer = UserProfileSerializer(read_only=True)
    participants = UserProfileSerializer(many=True, read_only=True)
    group = GroupSerializer(read_only=True)

    class Meta:
        model = SplitWise
        fields = ['id', 'description', 'amount', 'payer', 'group', 'participants']

class BalanceSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    group = GroupSerializer(read_only=True)

    class Meta:
        model = Balance
        fields = ['id', 'group', 'user', 'amount']


        
        
        