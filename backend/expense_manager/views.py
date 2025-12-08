import os
import pandas as pd

from django.utils import timezone
from django.shortcuts import render
from django.http.response import Http404
from datetime import timedelta, time,datetime
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated



from expense_manager.serializers import *
from .utils import get_sbi_statement_df, convert_to_expenso_df



class ExpenseManageSearch():
    sort = False
    sort_by = None
    sort_type = None
    
    def get_by_id(self, id, user = None):
        try:
            expense = get_object_or_404(Expense, id=id, user = user)
            data = ExpenseSerializer(expense).data
            return {"error": False, "msg": "", "data": data}
        except Http404:
            return {"error": True, "msg": f"expense with id '{id}' not found", "data": None}

    def get_by_range(self, user = None, range = None):
        
        if user:
            expenses = Expense.objects.filter(user = user)
        else:
            expenses = Expense.objects.all()
        
        if self.sort:
            if self.sort_type == "ascending":
                expenses = expenses.order_by(self.sort_by)
            else:
                expenses = expenses.order_by("-"+ self.sort_by)
        
        if range:
            expenses = expenses[range[0] : range[1]]
        data = ExpenseSerializer(expenses, many=True).data

        return {"error": False, "msg": "", "data": data}
              
            
class ExpenseManagerView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        expense_search_obj = ExpenseManageSearch()
        query_params = request.query_params

        if user.is_admin == False:
            if query_params:
                if "id" in query_params:
                    id = query_params.get("id")
                    ret = expense_search_obj.get_by_id(id, user = user)
                    if ret["error"]:
                        return Response(ret, status= status.HTTP_404_NOT_FOUND)
                    return Response(ret, status= status.HTTP_200_OK)   

                elif "sort_by" in query_params and "sort_type" in query_params:
                    sort_by = query_params.get("sort_by")
                    sort_type = query_params.get("sort_type")
                    if sort_by not in ["transaction_type", "transaction_amount", "transaction_date", "payer_name", "debit_category", "sub_category"]:
                        return Response({"error": True, "msg": f"Invalid sort_by field '{sort_by}'"}, status= status.HTTP_400_BAD_REQUEST)
                    if sort_type not in ["ascending", "descending"]:
                        return Response({"error": True, "msg": f"Invalid sort_type field '{sort_type}'"}, status= status.HTTP_400_BAD_REQUEST)

                    self.sort = True
                    self.sort_type = sort_type
                    self.sort_by = sort_by
                    
                    if "start" in query_params and "end" in query_params:
                        start = int(query_params.get("start"))
                        end = int(query_params.get("end"))

                        ret = expense_search_obj.get_by_range(user = user, range = [start, end])
                        if ret["error"]:
                            return Response(ret, status= status.HTTP_400_BAD_REQUEST)
                        return Response(ret, status= status.HTTP_200_OK)
                        
                    ret = expense_search_obj.get_by_range(user = user)
                    if ret["error"]:
                        return Response(ret, status= status.HTTP_400_BAD_REQUEST) 
                    return Response(ret, status= status.HTTP_200_OK)

                elif "start" in query_params and "end" in query_params:
                    start = int(query_params.get("start"))
                    end = int(query_params.get("end"))

                    ret = expense_search_obj.get_by_range(user = user, range = [start, end])
                    if ret["error"]:
                        return Response(ret, status= status.HTTP_400_BAD_REQUEST)
                    return Response(ret, status= status.HTTP_200_OK)
                    
                return Response({"error": True, "msg": "Invalid query parameters"}, status= status.HTTP_400_BAD_REQUEST)
                
            
            ret = expense_search_obj.get_by_range(user = user)
            if ret["error"]:
                return Response(ret, status= status.HTTP_400_BAD_REQUEST)
            return Response(ret, status= status.HTTP_200_OK)   
        else:
            if query_params:
                if "id" in query_params:
                    id = query_params.get("id")
                    ret = expense_search_obj.get_by_id(id)
                    if ret["error"]:
                        return Response(ret, status= status.HTTP_404_NOT_FOUND)
                    return Response(ret, status= status.HTTP_200_OK)   

                elif "sort_by" in query_params and "sort_type" in query_params:
                    sort_by = query_params.get("sort_by")
                    sort_type = query_params.get("sort_type")
                    if sort_by not in ["transaction_type", "transaction_amount", "transaction_date", "payer_name", "debit_category", "sub_category"]:
                        return Response({"error": True, "msg": f"Invalid sort_by field '{sort_by}'"}, status= status.HTTP_400_BAD_REQUEST)
                    if sort_type not in ["ascending", "descending"]:
                        return Response({"error": True, "msg": f"Invalid sort_type field '{sort_type}'"}, status= status.HTTP_400_BAD_REQUEST)

                    self.sort = True
                    self.sort_type = sort_type
                    self.sort_by = sort_by
                    
                    if "start" in query_params and "end" in query_params:
                        start = int(query_params.get("start"))
                        end = int(query_params.get("end"))

                        ret = expense_search_obj.get_by_range( range = [start, end])
                        if ret["error"]:
                            return Response(ret, status= status.HTTP_400_BAD_REQUEST)
                        return Response(ret, status= status.HTTP_200_OK)
                        
                    ret = expense_search_obj.get_by_range()
                    if ret["error"]:
                        return Response(ret, status= status.HTTP_400_BAD_REQUEST) 
                    return Response(ret, status= status.HTTP_200_OK)

                elif "start" in query_params and "end" in query_params:
                        start = int(query_params.get("start"))
                        end = int(query_params.get("end"))

                        ret = expense_search_obj.get_by_range( range = [start, end])
                        if ret["error"]:
                            return Response(ret, status= status.HTTP_400_BAD_REQUEST)
                        return Response(ret, status= status.HTTP_200_OK)
                        
                return Response({"error": True, "msg": "Invalid query parameters"}, status= status.HTTP_400_BAD_REQUEST)
                
            ret = expense_search_obj.get_by_range()
            if ret["error"]:
                return Response(ret, status= status.HTTP_400_BAD_REQUEST)
            return Response(ret, status= status.HTTP_200_OK)
             

    def add_new_expense(self, expense_data, user=None, file=None):
        try:
            expense_data["user"] = user.id

            if file:
            
                if file.name.endswith('.pdf'):

                    saved_path = default_storage.save(f"temp/{file.name}", file)

                    real_path = default_storage.path(saved_path)
                    print("Path saved:", real_path)
                            
                    try:
                        statement = get_sbi_statement_df(real_path)
                        print(statement)
                        expense_df = convert_to_expenso_df(statement,bank='sbi')
                        expense_data = expense_df.to_dict('records')
                        print(expense_df)

                        for expense in expense_data:
                            expense['user']=user.id
                            serializer = ExpenseSerializer(data=expense)
                            if serializer.is_valid():
                                serializer.save()
                            else:
                                return {"error": True, "msg": serializer.errors, "data": None}

                    except Exception as e:
                        print(e)

                    finally:

                        if default_storage.exists(saved_path):
                            default_storage.delete(saved_path)
                            print("File removed from storage:", saved_path)
                            
                elif file.name.endswith(".xlsx"):

                    df = pd.read_excel(file,index_col=[0])
                    df['transaction_date'] = pd.to_datetime(df['transaction_date'])
                    expense_data = df.to_dict('records')

                    for expense in expense_data:
                        expense['user']=user.id
                        serializer = ExpenseSerializer(data=expense)
                        if serializer.is_valid():
                            serializer.save()
                        else:
                            return {"error": True, "msg": serializer.errors, "data": None}
                else:
                    return {"error": True, "msg": "Invalid file type. Please upload an Excel (.xlsx) file.", "data": None}

            else:
                serializer = ExpenseSerializer(data=expense_data)
                if serializer.is_valid():
                    serializer.save()
                    return {"error": False, "msg": "Expense added successfully", "data": serializer.data}
                else:
                    return {"error": True, "msg": serializer.errors, "data": None}

            return {"error": False, "msg": "Expenses imported successfully", "data": None}
        
        except Exception as e:
            return {"error": True, "msg": str(e), "data": None}

    def post(self, request):
        user = request.user
        expense_data = request.data
        file = request.FILES.get("file", None)
        ret = self.add_new_expense(expense_data, user, file)
        if ret["error"]:
            return Response(ret, status=status.HTTP_400_BAD_REQUEST)
        return Response(ret, status=status.HTTP_201_CREATED)

            
        
    def edit_expense(self, expense_data, expense_id, user = None):
        try:
            expense = None
            if user.is_admin == False:
                expense = get_object_or_404(Expense, id=expense_id, user = user)
            else:   
                expense = get_object_or_404(Expense, id=expense_id)
                
            serializer = ExpenseSerializer(expense, data=expense_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return {"error": False, "msg": "Expense updated successfully", "data": serializer.data}
            else:
                return {"error": True, "msg": serializer.errors, "data": None}
        except Exception as e:
            return {"error": True, "msg": str(e), "data": None}
        

    def put(self, request):
        user = request.user
        expense_data = request.data
        expense_id = request.query_params.get("id", None)
        if not expense_id:
            return Response({"error" : True, "msg" : "expense id is required in query params", "data" :None}, status= status.HTTP_400_BAD_REQUEST)
        ret = self.edit_expense(expense_data, expense_id,  user)
        if ret["error"]:
            return Response(ret, status= status.HTTP_400_BAD_REQUEST)
        return Response(ret, status= status.HTTP_200_OK)
    

    def delete(self, request):
        user = request.user
        expense_id = request.query_params.get("id", None)
        if not id:
            return Response({"error" : True, "msg" : "expense id is required in query params", "data" :None}, status= status.HTTP_400_BAD_REQUEST)

        try:
            if user.is_admin == False:
                expense = get_object_or_404(Expense, id=expense_id, user = user)
            else:   
                expense = get_object_or_404(Expense, id=expense_id)
            expense.delete()
            return Response({"error": False, "msg": "Expense deleted successfully", "data": None}, status= status.HTTP_200_OK)
        except Http404:
            return Response({"error": True, "msg": f"expense with id '{expense_id}' not found", "data": None}, status= status.HTTP_404_NOT_FOUND)
        

class DashBoardOverview(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        summary_type = request.query_params.get("type", "weekly").lower()
        valid_types = ["weekly", "monthly", "yearly"]
        
        if summary_type not in valid_types:
            return Response({"error": True, "msg": "Invalid summary type", "data": None})

        user = request.user
        today = timezone.now().date()

        current_start, current_end, previous_start, previous_end = self.get_date_ranges(summary_type, today)

        # print(summary_type,current_start,current_end)

        current_expenses = self.get_expenses(user, current_start, current_end)
        previous_expenses = self.get_expenses(user, previous_start, previous_end)

        # print(summary_type,current_expenses,previous_expenses)
        current_expenses_total_amount = sum(float(expense['transaction_amount']) for expense in current_expenses if expense['transaction_type']=="debit")
        previous_expenses_total_amount = sum(float(expense['transaction_amount']) for expense in previous_expenses if expense['transaction_type']=="debit")

        # print(current_expenses_total_amount,previous_expenses_total_amount)


        return Response({
            "error": False,
            "msg": "",
            "data": {
                "type":summary_type,
                f"current_total": current_expenses_total_amount,
                f"prev_total": previous_expenses_total_amount,
                f"difference": previous_expenses_total_amount-current_expenses_total_amount,
            }
        })

    def get_date_ranges(self, summary_type, today):
        if summary_type == "weekly":
            current_start = today - timedelta(days=today.weekday())  
            previous_start = current_start - timedelta(weeks=1)
            previous_end = current_start - timedelta(days=1)

        elif summary_type == "monthly":
            current_start = today.replace(day=1)
            last_day_previous_month = current_start - timedelta(days=1)
            previous_start = last_day_previous_month.replace(day=1)
            previous_end = last_day_previous_month

        elif summary_type == "yearly":
            current_start = today.replace(month=1, day=1)
            previous_start = current_start.replace(year=current_start.year - 1)
            previous_end = current_start - timedelta(days=1)

        return current_start, today, previous_start, previous_end


    def get_expenses(self, user, start_date, end_date):
        start_datetime = datetime.combine(start_date, time.min)  
        end_datetime = datetime.combine(end_date, time.max)      

        expenses = Expense.objects.filter(
            user=user,
            transaction_date__range=(start_datetime, end_datetime)
        )
        return ExpenseSerializer(expenses, many=True).data
    


class DashBoardDebitBreakdown(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        summary_type = request.query_params.get("type", "weekly").lower()
        valid_types = ["weekly", "monthly", "yearly"]
        
        if summary_type not in valid_types:
            return Response({"error": True, "msg": "Invalid summary type", "data": None})

        user = request.user
        today = timezone.now().date()

        current_start, current_end = self.get_date_ranges(summary_type, today)

        # print(summary_type,current_start,current_end)

        current_expenses = self.get_expenses(user, current_start, current_end)
        
        debit_cat = {}
        for cat in DEBIT_CATEGORY_CHOICES:
            debit_cat[cat[0]] = [ expense for expense in current_expenses if expense['debit_category']==cat[0] and expense['transaction_type']=='debit']
        
        print(debit_cat)
        
        return Response({
            "error": False,
            "msg": "",
            "data": {"type":summary_type,**debit_cat}
        })

    def get_date_ranges(self, summary_type, today):
        if summary_type == "weekly":
            current_start = today - timedelta(days=today.weekday())  

        elif summary_type == "monthly":
            current_start = today.replace(day=1)
            
        elif summary_type == "yearly":
            current_start = today.replace(month=1, day=1)


        return current_start, today, 


    def get_expenses(self, user, start_date, end_date):
        start_datetime = datetime.combine(start_date, time.min)  
        end_datetime = datetime.combine(end_date, time.max)      

        expenses = Expense.objects.filter(
            user=user,
            transaction_date__range=(start_datetime, end_datetime)
        )
        return ExpenseSerializer(expenses, many=True).data