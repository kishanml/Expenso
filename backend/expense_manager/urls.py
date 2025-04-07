
from django.urls import path
from expense_manager.views import ExpenseManagerView

urlpatterns = [
    path('expense/', ExpenseManagerView.as_view()),
]
