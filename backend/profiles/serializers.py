from rest_framework import serializers
from django.db import models
from .models import (
    Profile, EducationDetails, ProfessionalDetails, FamilyDetails,
    LifestyleDetails, PartnerPreferences, ProfilePhoto, Shortlist,
    ProfileView, SuccessStory
)
from chat.models import Interest, Connection
from .services.compatibility import calculate_compatibility


class EducationDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationDetails
        fields = ('degree', 'field_of_study', 'institution', 'education_level', 'passing_year', 'additional_degree')


class ProfessionalDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalDetails
        fields = ('occupation', 'employed_in', 'company_name', 'annual_income', 'work_location', 'experience_years')


class FamilyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyDetails
        fields = (
            'family_type', 'family_values', 'father_name', 'father_occupation',
            'mother_name', 'mother_occupation', 'brothers_count', 'sisters_count',
            'married_brothers_count', 'married_sisters_count', 'family_status',
            'native_place', 'about_family'
        )


class LifestyleDetailsSerializer(serializers.ModelSerializer):
    hobbies = serializers.SerializerMethodField()

    class Meta:
        model = LifestyleDetails
        fields = ('diet', 'drinking', 'smoking', 'exercise', 'hobbies', 'interests', 'pets')

    def get_hobbies(self, obj):
        if not obj.hobbies:
            return []
        if isinstance(obj.hobbies, list):
            return obj.hobbies
        return [h.strip() for h in obj.hobbies.split(',') if h.strip()]


class PartnerPreferencesSerializer(serializers.ModelSerializer):
    ageRange = serializers.SerializerMethodField()
    heightRange = serializers.SerializerMethodField()

    class Meta:
        model = PartnerPreferences
        fields = (
            'min_age', 'max_age', 'min_height', 'max_height',
            'marital_status', 'religion', 'caste', 'sub_caste', 'mother_tongue',
            'education_level', 'occupation', 'min_income', 'location',
            'diet', 'smoking', 'drinking', 'ageRange', 'heightRange'
        )

    def get_ageRange(self, obj):
        return f"{obj.min_age} - {obj.max_age} Yrs" if obj.min_age and obj.max_age else "Any"

    def get_heightRange(self, obj):
        return f"{obj.min_height} to {obj.max_height}" if obj.min_height or obj.max_height else "Any"


class ProfilePhotoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProfilePhoto
        fields = ('id', 'url', 'is_primary')

    def get_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url


class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.first_name', read_only=True)
    about = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    educationDetails = serializers.SerializerMethodField()
    profession = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    income = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    education = EducationDetailsSerializer(source='education_details', read_only=True)
    professional = ProfessionalDetailsSerializer(source='professional_details', read_only=True)
    family = FamilyDetailsSerializer(source='family_details', read_only=True)
    lifestyle = LifestyleDetailsSerializer(source='lifestyle_details', read_only=True)
    partnerPreferences = PartnerPreferencesSerializer(source='partner_preferences', read_only=True)
    photos_list = ProfilePhotoSerializer(source='photos', many=True, read_only=True)
    
    compatibilityScore = serializers.SerializerMethodField()
    whyMatch = serializers.SerializerMethodField()
    interestStatus = serializers.SerializerMethodField()
    shortlisted = serializers.SerializerMethodField()
    identity_verified = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = (
            'id', 'user_id', 'email', 'name', 'gender', 'date_of_birth', 'age',
            'height_feet_inches', 'height_cm', 'weight_kg', 'marital_status',
            'religion', 'caste', 'sub_caste', 'gothram', 'mother_tongue', 'languages_known',
            'city', 'state', 'country', 'pincode', 'phone_number', 'body_type', 'complexion', 'physical_status',
            'location', 'bio', 'about', 'photo', 'gallery', 'photos_list', 'profile_visibility', 'show_contact',
            'is_verified', 'identity_verified', 'educationDetails', 'profession', 'company', 'income',
            'education', 'professional', 'family', 'lifestyle', 'partnerPreferences',
            'compatibilityScore', 'whyMatch', 'interestStatus', 'shortlisted'
        )

    def get_about(self, obj):
        return obj.bio

    def get_photo(self, obj):
        if obj.avatar_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar_file.url)
            return obj.avatar_file.url
        if obj.avatar_url:
            return obj.avatar_url
        primary_photo = obj.photos.filter(is_primary=True).first()
        if primary_photo:
            return ProfilePhotoSerializer(primary_photo, context=self.context).data['url']
        first_photo = obj.photos.first()
        if first_photo:
            return ProfilePhotoSerializer(first_photo, context=self.context).data['url']
        return ""

    def get_gallery(self, obj):
        photos = obj.photos.all()
        if photos.exists():
            return [ProfilePhotoSerializer(p, context=self.context).data['url'] for p in photos]
        photo = self.get_photo(obj)
        return [photo] if photo else []

    def get_location(self, obj):
        return f"{obj.city}, {obj.state}"

    def get_educationDetails(self, obj):
        edu = getattr(obj, 'education_details', None)
        if edu and edu.degree and edu.degree.strip():
            return f"{edu.degree} ({edu.institution})" if edu.institution and edu.institution.strip() else edu.degree
        return ""

    def get_profession(self, obj):
        prof = getattr(obj, 'professional_details', None)
        return prof.occupation if prof and prof.occupation and prof.occupation.strip() else ""

    def get_company(self, obj):
        prof = getattr(obj, 'professional_details', None)
        return prof.company_name if prof and prof.company_name and prof.company_name.strip() else ""

    def get_income(self, obj):
        prof = getattr(obj, 'professional_details', None)
        return prof.annual_income if prof and prof.annual_income and prof.annual_income.strip() else ""

    def _get_compat(self, obj):
        compat_cache = self.context.get('compat_cache')
        if compat_cache is not None and obj.id in compat_cache:
            return compat_cache[obj.id]

        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            res = (88, ["Complements your preferences", "High cultural alignment"])
        elif request.user.id == obj.user.id:
            res = (100, ["Your own profile"])
        else:
            viewer_profile = self.context.get('viewer_profile')
            if viewer_profile is None:
                viewer_profile = getattr(request.user, 'profile', None)
            if not viewer_profile:
                res = (85, ["Complements your preferences"])
            else:
                res = calculate_compatibility(viewer_profile, obj)

        if compat_cache is not None:
            compat_cache[obj.id] = res
        return res

    def get_compatibilityScore(self, obj):
        score, _ = self._get_compat(obj)
        return score

    def get_whyMatch(self, obj):
        _, why_match = self._get_compat(obj)
        return why_match

    def get_interestStatus(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated or request.user.id == obj.user.id:
            return None

        user_id = request.user.id
        other_user_id = obj.user.id

        # 1. Check active connection from pre-fetched context or DB
        accepted_user_ids = self.context.get('accepted_user_ids')
        if accepted_user_ids is not None:
            if other_user_id in accepted_user_ids:
                return 'ACCEPTED'
        else:
            conn = Connection.objects.filter(
                (models.Q(user1_id=user_id, user2_id=other_user_id) | models.Q(user1_id=other_user_id, user2_id=user_id)),
                status='ACCEPTED'
            ).first()
            if conn:
                return 'ACCEPTED'

        # 2. Check sent interest from pre-fetched context or DB
        sent_interests = self.context.get('sent_interests')
        if sent_interests is not None:
            if other_user_id in sent_interests:
                return sent_interests[other_user_id]
        else:
            sent = Interest.objects.filter(sender_id=user_id, receiver_id=other_user_id).order_by('-created_at').first()
            if sent:
                return sent.status

        # 3. Check received interest from pre-fetched context or DB
        received_interests = self.context.get('received_interests')
        if received_interests is not None:
            if other_user_id in received_interests:
                return f"INCOMING_{received_interests[other_user_id]}"
        else:
            received = Interest.objects.filter(sender_id=other_user_id, receiver_id=user_id).order_by('-created_at').first()
            if received:
                return f"INCOMING_{received.status}"

        return 'NONE'

    def get_shortlisted(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False

        shortlisted_ids = self.context.get('shortlisted_ids')
        if shortlisted_ids is not None:
            return obj.id in shortlisted_ids

        return Shortlist.objects.filter(user=request.user, target_profile=obj).exists()

    def get_identity_verified(self, obj):
        # Note: Identity verification is temporarily disabled and will be re-integrated later.
        return False


class ShortlistSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source='target_profile', read_only=True)

    class Meta:
        model = Shortlist
        fields = ('id', 'profile', 'created_at')


class SuccessStorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = SuccessStory
        fields = ('id', 'couple_name', 'location', 'marriage_date', 'story', 'image', 'is_approved', 'created_at')

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        if obj.image_url:
            return obj.image_url
        return "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800"
