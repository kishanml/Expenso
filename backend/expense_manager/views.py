from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from expense_manager.serializers import *
from django.http.response import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated



# class ExpenseManageSearch():
#     sort = False
#     sort_by = None
#     sort_type = None
    
#     def get_by_id(self, id, user = None):
#         try:
#             expense = get_object_or_404(Expense, id=id, user = user)
#             data = ExpenseSerializer(expense).data
#             return {"error": False, "msg": "", "data": data}
#         except Http404:
#             return {"error": True, "msg": f"expense with id '{id}' not found", "data": None}

#     def get_by_range(self, user = None, range = None):
        
#         if user:
#             expenses = Expense.objects.filter(user = user)
#         else:
#             expenses = Expense.objects.all()
        
#         if self.sort:
#             if self.sort_type == "ascending":
#                 expenses = expenses.order_by(self.sort_by)
#             else:
#                 expenses = expenses.order_by("-"+ self.sort_by)
        
#         if range:
#             expenses = expenses[range[0] : range[1]]
#         data = ExpenseSerializer(expenses, many=True).data

#         return {"error": False, "msg": "", "data": data}
              
        
            
# Create your views here.
# class ExpenseManagerView(APIView):
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         user = request.user
#         expense_search_obj = ExpenseManageSearch()
#         query_params = request.query_params

#         if user.is_admin == False:
#             if query_params:
#                 if "id" in query_params:
#                     id = query_params.get("id")
#                     ret = expense_search_obj.get_by_id(id, user = user)
#                     if ret["error"]:
#                         return Response(ret, status= status.HTTP_404_NOT_FOUND)
#                     return Response(ret, status= status.HTTP_200_OK)   

#                 elif "sort_by" in query_params and "sort_type" in query_params:
#                     sort_by = query_params.get("sort_by")
#                     sort_type = query_params.get("sort_type")
#                     if sort_by not in ["transaction_type", "transaction_amount", "transaction_date", "payer_name", "debit_category", "sub_category"]:
#                         return Response({"error": True, "msg": f"Invalid sort_by field '{sort_by}'"}, status= status.HTTP_400_BAD_REQUEST)
#                     if sort_type not in ["ascending", "descending"]:
#                         return Response({"error": True, "msg": f"Invalid sort_type field '{sort_type}'"}, status= status.HTTP_400_BAD_REQUEST)

#                     self.sort = True
#                     self.sort_type = sort_type
#                     self.sort_by = sort_by
                    
#                     if "start" in query_params and "end" in query_params:
#                         start = int(query_params.get("start"))
#                         end = int(query_params.get("end"))

#                         ret = expense_search_obj.get_by_range(user = user, range = [start, end])
#                         if ret["error"]:
#                             return Response(ret, status= status.HTTP_400_BAD_REQUEST)
#                         return Response(ret, status= status.HTTP_200_OK)
                        
#                     ret = expense_search_obj.get_by_range(user = user)
#                     if ret["error"]:
#                         return Response(ret, status= status.HTTP_400_BAD_REQUEST) 
#                     return Response(ret, status= status.HTTP_200_OK)

#                 return Response({"error": True, "msg": "Invalid query parameters"}, status= status.HTTP_400_BAD_REQUEST)
                
            
#             ret = expense_search_obj.get_by_range(user = user)
#             if ret["error"]:
#                 return Response(ret, status= status.HTTP_400_BAD_REQUEST)
#             return Response(ret, status= status.HTTP_200_OK)   
#         else:
#             if query_params:
#                 if "id" in query_params:
#                     id = query_params.get("id")
#                     ret = expense_search_obj.get_by_id(id)
#                     if ret["error"]:
#                         return Response(ret, status= status.HTTP_404_NOT_FOUND)
#                     return Response(ret, status= status.HTTP_200_OK)   

#                 elif "sort_by" in query_params and "sort_type" in query_params:
#                     sort_by = query_params.get("sort_by")
#                     sort_type = query_params.get("sort_type")
#                     if sort_by not in ["transaction_type", "transaction_amount", "transaction_date", "payer_name", "debit_category", "sub_category"]:
#                         return Response({"error": True, "msg": f"Invalid sort_by field '{sort_by}'"}, status= status.HTTP_400_BAD_REQUEST)
#                     if sort_type not in ["ascending", "descending"]:
#                         return Response({"error": True, "msg": f"Invalid sort_type field '{sort_type}'"}, status= status.HTTP_400_BAD_REQUEST)

#                     self.sort = True
#                     self.sort_type = sort_type
#                     self.sort_by = sort_by
                    
#                     if "start" in query_params and "end" in query_params:
#                         start = int(query_params.get("start"))
#                         end = int(query_params.get("end"))

#                         ret = expense_search_obj.get_by_range( range = [start, end])
#                         if ret["error"]:
#                             return Response(ret, status= status.HTTP_400_BAD_REQUEST)
#                         return Response(ret, status= status.HTTP_200_OK)
                        
#                     ret = expense_search_obj.get_by_range()
#                     if ret["error"]:
#                         return Response(ret, status= status.HTTP_400_BAD_REQUEST) 
#                     return Response(ret, status= status.HTTP_200_OK)

#                 return Response({"error": True, "msg": "Invalid query parameters"}, status= status.HTTP_400_BAD_REQUEST)
                
#             ret = expense_search_obj.get_by_range()
#             if ret["error"]:
#                 return Response(ret, status= status.HTTP_400_BAD_REQUEST)
#             return Response(ret, status= status.HTTP_200_OK)
             
        
#     def add_new_expense(self, request):
#         pass
        
#     def post(self, request):
#         pass

#     def put(self, request):
#         pass

    