from django.urls import path
from expense_manager.views import ExpenseManagerView, DashBoardOverview,DashBoardDebitBreakdown

urlpatterns = [
    path('expense/', ExpenseManagerView.as_view()),
    path('dashboard/overview/', DashBoardOverview.as_view()),  
    path('dashboard/debit-breakdown/', DashBoardDebitBreakdown.as_view()),  

]
