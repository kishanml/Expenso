from django.contrib import admin
from expense_manager.models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    # Display these columns in the list view
    list_display = ('id', 'payer_name', 'transaction_type', 'transaction_amount', 'transaction_date')

    # Add a search bar
    search_fields = ('payer_name', 'sub_category', 'remarks')

    # Add sidebar filters
    list_filter = ('transaction_type', 'debit_category', 'transaction_date')

    # Date hierarchy navigation
    date_hierarchy = 'transaction_date'

    # Group fields into neat sections
    fieldsets = (
        ('Transaction Info', {
            'fields': ('transaction_type', 'transaction_amount', 'transaction_date')
        }),
        ('Payer Info', {
            'fields': ('payer_name', 'debit_category', 'sub_category')
        }),
        ('Extras', {
            'fields': ('documents_location', 'remarks')
        }),
    )

    # Auto-set user on creation
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.user = request.user
        super().save_model(request, obj, form, change)

    # Optional: Add custom bulk actions
    def mark_as_reviewed(self, request, queryset):
        queryset.update(remarks="✅ Reviewed by admin")
    mark_as_reviewed.short_description = "Mark selected as Reviewed"

    actions = [mark_as_reviewed]
