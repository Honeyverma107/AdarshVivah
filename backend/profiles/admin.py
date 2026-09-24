from django.contrib import admin
from .models import (
    Profile,
    EducationDetails,
    ProfessionalDetails,
    FamilyDetails,
    LifestyleDetails,
    PartnerPreferences,
    ProfilePhoto,
    Shortlist,
    ProfileView,
    SuccessStory,
    UserReport,
)


class EducationDetailsInline(admin.StackedInline):
    model = EducationDetails
    extra = 0
    max_num = 1


class ProfessionalDetailsInline(admin.StackedInline):
    model = ProfessionalDetails
    extra = 0
    max_num = 1


class FamilyDetailsInline(admin.StackedInline):
    model = FamilyDetails
    extra = 0
    max_num = 1


class LifestyleDetailsInline(admin.StackedInline):
    model = LifestyleDetails
    extra = 0
    max_num = 1


class PartnerPreferencesInline(admin.StackedInline):
    model = PartnerPreferences
    extra = 0
    max_num = 1


class ProfilePhotoInline(admin.TabularInline):
    model = ProfilePhoto
    extra = 0


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'city', 'state', 'marital_status', 'religion', 'is_verified', 'created_at')
    list_filter = ('gender', 'marital_status', 'religion', 'is_verified', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'city', 'state', 'caste', 'phone_number')
    ordering = ('-created_at',)
    inlines = [
        EducationDetailsInline,
        ProfessionalDetailsInline,
        FamilyDetailsInline,
        LifestyleDetailsInline,
        PartnerPreferencesInline,
        ProfilePhotoInline,
    ]
    actions = ['verify_profiles', 'unverify_profiles']

    @admin.action(description='Mark selected profiles as Verified')
    def verify_profiles(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f"{updated} profile(s) marked as verified.")

    @admin.action(description='Mark selected profiles as Unverified')
    def unverify_profiles(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(request, f"{updated} profile(s) marked as unverified.")


@admin.register(ProfilePhoto)
class ProfilePhotoAdmin(admin.ModelAdmin):
    list_display = ('profile', 'is_primary', 'created_at')
    list_filter = ('is_primary', 'created_at')
    search_fields = ('profile__user__email',)


@admin.register(Shortlist)
class ShortlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'target_profile', 'created_at')
    search_fields = ('user__email', 'target_profile__user__email')
    list_filter = ('created_at',)


@admin.register(ProfileView)
class ProfileViewAdmin(admin.ModelAdmin):
    list_display = ('viewer', 'viewed_profile', 'created_at')
    search_fields = ('viewer__email', 'viewed_profile__user__email')
    list_filter = ('created_at',)


@admin.register(SuccessStory)
class SuccessStoryAdmin(admin.ModelAdmin):
    list_display = ('couple_name', 'submitted_by', 'marriage_date', 'location', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('couple_name', 'location', 'submitted_by__email', 'story')
    actions = ['approve_stories', 'reject_stories']

    @admin.action(description='Approve selected success stories')
    def approve_stories(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} success story(ies) approved.")

    @admin.action(description='Reject selected success stories')
    def reject_stories(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} success story(ies) rejected.")


@admin.register(UserReport)
class UserReportAdmin(admin.ModelAdmin):
    list_display = ('reporter', 'reported_user', 'reason', 'status', 'reviewed_by', 'created_at')
    list_filter = ('status', 'reason', 'created_at')
    search_fields = ('reporter__email', 'reported_user__email', 'details', 'admin_notes')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_under_review', 'mark_resolved', 'mark_dismissed']

    @admin.action(description='Mark selected reports as Under Review')
    def mark_under_review(self, request, queryset):
        updated = queryset.update(status=UserReport.ReportStatus.UNDER_REVIEW, reviewed_by=request.user)
        self.message_user(request, f"{updated} report(s) updated to Under Review.")

    @admin.action(description='Mark selected reports as Resolved')
    def mark_resolved(self, request, queryset):
        updated = queryset.update(status=UserReport.ReportStatus.RESOLVED, reviewed_by=request.user)
        self.message_user(request, f"{updated} report(s) marked as Resolved.")

    @admin.action(description='Mark selected reports as Dismissed')
    def mark_dismissed(self, request, queryset):
        updated = queryset.update(status=UserReport.ReportStatus.DISMISSED, reviewed_by=request.user)
        self.message_user(request, f"{updated} report(s) marked as Dismissed.")
