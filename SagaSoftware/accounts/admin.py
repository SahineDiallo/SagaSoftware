from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile, ConfirmationCode


class UserCostumAdmin(UserAdmin):
    list_display = (
        "email",
        "username",
        "create_on",
        "last_login",
        "is_admin",
        "is_staff",
    )
    search_fields = ("email", "username")
    readonly_fields = (
        "id",
        "create_on",
        "last_login",
    )
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()


admin.site.register(User, UserCostumAdmin)
admin.site.register(Profile)
admin.site.register(ConfirmationCode)

