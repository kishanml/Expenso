from django.urls import path
from expense_manager.views import ExpenseManagerView, DashBoardOverview

urlpatterns = [
    path('expense/', ExpenseManagerView.as_view()),
    path('dashboard/overview/', DashBoardOverview.as_view()),  
]
