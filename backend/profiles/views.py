import os
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from django.contrib.auth import get_user_model

from .models import (
    Profile, EducationDetails, ProfessionalDetails, FamilyDetails,
    LifestyleDetails, PartnerPreferences, ProfilePhoto, Shortlist,
    ProfileView, SuccessStory
)
from .serializers import (
    ProfileSerializer, ProfilePhotoSerializer, ShortlistSerializer, SuccessStorySerializer
)
from chat.models import Interest, Connection, Message

User = get_user_model()


class ProfilePhotoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfilePhotoSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if not profile:
            return ProfilePhoto.objects.none()
        return ProfilePhoto.objects.filter(profile=profile)

    def create(self, request, *args, **kwargs):
        user = request.user
        profile = getattr(user, 'profile', None)
        if not profile:
            profile = Profile.objects.create(user=user)

        file = request.FILES.get('file') or request.FILES.get('image') or request.FILES.get('photo')
        if not file:
            return Response({'detail': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        # File size check (5 MB max)
        if file.size > 5 * 1024 * 1024:
            return Response({'detail': 'File size exceeds maximum limit of 5 MB.'}, status=status.HTTP_400_BAD_REQUEST)

        # File type check
        ext = os.path.splitext(file.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            return Response({'detail': 'Unsupported file format. Please upload JPG, PNG, or WebP.'}, status=status.HTTP_400_BAD_REQUEST)

        is_primary_req = request.data.get('is_primary')
        is_primary = str(is_primary_req).lower() in ['true', '1'] or not profile.photos.exists()

        if is_primary:
            profile.photos.update(is_primary=False)

        photo = ProfilePhoto.objects.create(
            profile=profile,
            image=file,
            is_primary=is_primary
        )

        if is_primary:
            profile.avatar_file = file
            profile.save()

        serializer = self.get_serializer(photo, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        photo = self.get_object()
        profile = photo.profile
        if profile.user != request.user:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        file = request.FILES.get('file') or request.FILES.get('image') or request.FILES.get('photo')
        if file:
            if file.size > 5 * 1024 * 1024:
                return Response({'detail': 'File size exceeds maximum limit of 5 MB.'}, status=status.HTTP_400_BAD_REQUEST)
            ext = os.path.splitext(file.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                return Response({'detail': 'Unsupported file format. Please upload JPG, PNG, or WebP.'}, status=status.HTTP_400_BAD_REQUEST)
            if photo.image:
                photo.image.delete(save=False)
            photo.image = file

        is_primary_req = request.data.get('is_primary')
        if is_primary_req is not None:
            is_primary = str(is_primary_req).lower() in ['true', '1']
            if is_primary and not photo.is_primary:
                profile.photos.update(is_primary=False)
                photo.is_primary = True

        photo.save()
        if photo.is_primary and photo.image:
            profile.avatar_file = photo.image
            profile.save()

        serializer = self.get_serializer(photo, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post', 'put', 'patch'])
    def make_primary(self, request, pk=None):
        photo = self.get_object()
        profile = photo.profile
        if profile.user != request.user:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        profile.photos.update(is_primary=False)
        photo.is_primary = True
        photo.save()

        if photo.image:
            profile.avatar_file = photo.image
            profile.save()

        serializer = self.get_serializer(photo, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        photo = self.get_object()
        profile = photo.profile
        if profile.user != request.user:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        was_primary = photo.is_primary
        if photo.image:
            photo.image.delete(save=False)
        photo.delete()

        if was_primary:
            next_photo = profile.photos.first()
            if next_photo:
                next_photo.is_primary = True
                next_photo.save()
                if next_photo.image:
                    profile.avatar_file = next_photo.image
                profile.save()
            else:
                profile.avatar_file = None
                profile.avatar_url = ''
                profile.save()

        return Response({'message': 'Photo deleted successfully.'}, status=status.HTTP_200_OK)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.select_related(
        'user', 'education_details', 'professional_details',
        'family_details', 'lifestyle_details', 'partner_preferences'
    ).prefetch_related('photos').all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        gender = self.request.query_params.get('gender')
        religion = self.request.query_params.get('religion')
        caste = self.request.query_params.get('caste')
        city = self.request.query_params.get('city')
        min_age = self.request.query_params.get('min_age')
        max_age = self.request.query_params.get('max_age')
        search = self.request.query_params.get('search')

        # Filter out current user's profile from list
        if self.request.user and self.request.user.is_authenticated:
            qs = qs.exclude(user=self.request.user)

        if gender:
            qs = qs.filter(gender__iexact=gender)
        if religion:
            qs = qs.filter(religion__icontains=religion)
        if caste:
            qs = qs.filter(caste__icontains=caste)
        if city:
            qs = qs.filter(city__icontains=city)
        if search:
            qs = qs.filter(
                Q(user__first_name__icontains=search) |
                Q(city__icontains=search) |
                Q(caste__icontains=search) |
                Q(religion__icontains=search) |
                Q(professional_details__occupation__icontains=search)
            )

        return qs.order_by('-created_at')

def save_profile_data(user, profile, data):
    # Update User first_name if provided
    if 'name' in data and data['name']:
        user.first_name = data['name']
        user.save()

    # Update Profile base fields
    base_fields = [
        'gender', 'date_of_birth', 'height_feet_inches', 'height_cm', 'weight_kg',
        'marital_status', 'religion', 'caste', 'sub_caste', 'gothram', 'mother_tongue',
        'languages_known', 'city', 'state', 'country', 'pincode', 'phone_number', 'body_type',
        'complexion', 'physical_status', 'bio', 'profile_visibility', 'show_contact'
    ]
    for field in base_fields:
        if field in data and data[field] is not None:
            setattr(profile, field, data[field])

    if 'photo' in data and data['photo']:
        profile.avatar_url = data['photo']
    profile.save()

    # Update EducationDetails
    edu, _ = EducationDetails.objects.get_or_create(profile=profile)
    edu_data = data.get('education') if isinstance(data.get('education'), dict) else data
    if isinstance(edu_data, dict):
        for f in ['degree', 'field_of_study', 'institution', 'education_level', 'passing_year', 'additional_degree']:
            if f in edu_data and edu_data[f] is not None:
                setattr(edu, f, edu_data[f])
    if 'educationDetails' in data and data['educationDetails'] and not edu.degree:
        edu.degree = data['educationDetails']
    edu.save()

    # Update ProfessionalDetails
    prof, _ = ProfessionalDetails.objects.get_or_create(profile=profile)
    prof_data = data.get('professional') if isinstance(data.get('professional'), dict) else data
    if isinstance(prof_data, dict):
        for f in ['occupation', 'employed_in', 'company_name', 'annual_income', 'work_location', 'experience_years']:
            if f in prof_data and prof_data[f] is not None:
                setattr(prof, f, prof_data[f])
    if 'profession' in data and data['profession'] and not prof.occupation:
        prof.occupation = data['profession']
    if 'company' in data and data['company'] and not prof.company_name:
        prof.company_name = data['company']
    if 'income' in data and data['income'] and not prof.annual_income:
        prof.annual_income = data['income']
    prof.save()

    # Update FamilyDetails
    fam, _ = FamilyDetails.objects.get_or_create(profile=profile)
    fam_data = data.get('family') if isinstance(data.get('family'), dict) else data
    for f in ['family_type', 'family_values', 'father_name', 'father_occupation', 'mother_name', 'mother_occupation',
              'brothers_count', 'sisters_count', 'married_brothers_count', 'married_sisters_count',
              'family_status', 'native_place', 'about_family']:
        if f in fam_data and fam_data[f] is not None:
            setattr(fam, f, fam_data[f])
    fam.save()

    # Update LifestyleDetails
    life, _ = LifestyleDetails.objects.get_or_create(profile=profile)
    life_data = data.get('lifestyle') if isinstance(data.get('lifestyle'), dict) else data
    for f in ['diet', 'drinking', 'smoking', 'exercise', 'interests', 'pets']:
        if f in life_data and life_data[f] is not None:
            setattr(life, f, life_data[f])
    if 'hobbies' in life_data:
        hobbies_val = life_data['hobbies']
        life.hobbies = ", ".join(hobbies_val) if isinstance(hobbies_val, list) else str(hobbies_val)
    life.save()

    # Update PartnerPreferences
    pref, _ = PartnerPreferences.objects.get_or_create(profile=profile)
    pref_data = data.get('partnerPreferences') if isinstance(data.get('partnerPreferences'), dict) else data
    for f in ['min_age', 'max_age', 'min_height', 'max_height', 'marital_status', 'religion',
              'caste', 'sub_caste', 'mother_tongue', 'education_level', 'occupation',
              'min_income', 'location', 'diet', 'smoking', 'drinking']:
        if f in pref_data and pref_data[f] is not None:
            setattr(pref, f, pref_data[f])
    pref.save()

    return profile


class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ProfileSerializer

    def get_queryset(self):
        qs = Profile.objects.select_related(
            'user', 'education_details', 'professional_details',
            'family_details', 'lifestyle_details', 'partner_preferences'
        ).prefetch_related('photos')

        gender = self.request.query_params.get('gender')
        religion = self.request.query_params.get('religion')
        caste = self.request.query_params.get('caste')
        city = self.request.query_params.get('city')
        search = self.request.query_params.get('search')

        if gender:
            qs = qs.filter(gender__iexact=gender)
        if religion:
            qs = qs.filter(religion__icontains=religion)
        if caste:
            qs = qs.filter(caste__icontains=caste)
        if city:
            qs = qs.filter(city__icontains=city)
        if search:
            qs = qs.filter(
                Q(user__first_name__icontains=search) |
                Q(city__icontains=search) |
                Q(caste__icontains=search) |
                Q(religion__icontains=search) |
                Q(professional_details__occupation__icontains=search)
            )

        return qs.order_by('-created_at')

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        profile, _ = Profile.objects.get_or_create(
            user=user,
            defaults={
                'gender': data.get('gender', ''),
                'religion': data.get('religion', ''),
                'caste': data.get('caste', ''),
                'city': data.get('city', ''),
                'state': data.get('state', '')
            }
        )
        save_profile_data(user, profile, data)

        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get', 'put', 'patch', 'post'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        user = request.user
        profile = Profile.objects.filter(user=user).first()

        if request.method == 'GET':
            if not profile:
                return Response({'detail': 'Profile not found.', 'exists': False}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)

        if not profile:
            profile = Profile.objects.create(
                user=user,
                gender=request.data.get('gender', ''),
                religion=request.data.get('religion', ''),
                caste=request.data.get('caste', ''),
                city=request.data.get('city', ''),
                state=request.data.get('state', '')
            )

        save_profile_data(user, profile, request.data)

        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Record profile view if viewer is authenticated and viewing someone else's profile
        if request.user and request.user.is_authenticated and request.user.id != instance.user.id:
            ProfileView.objects.create(viewer=request.user, viewed_profile=instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ShortlistViewSet(viewsets.ModelViewSet):
    serializer_class = ShortlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Shortlist.objects.filter(user=self.request.user).select_related('target_profile', 'target_profile__user').order_by('-created_at')

    def create(self, request, *args, **kwargs):
        profile_id = request.data.get('profile_id') or request.data.get('target_profile')
        if not profile_id:
            return Response({'detail': 'profile_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_profile = Profile.objects.get(id=profile_id)
        except Profile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Prevent self-shortlisting
        if target_profile.user == request.user:
            return Response({'detail': 'You cannot shortlist your own profile.'}, status=status.HTTP_400_BAD_REQUEST)

        shortlist, created = Shortlist.objects.get_or_create(user=request.user, target_profile=target_profile)
        if not created:
            # Toggle off if already shortlisted
            shortlist.delete()
            return Response({'shortlisted': False, 'message': 'Removed from shortlist.'}, status=status.HTTP_200_OK)

        return Response({'shortlisted': True, 'message': 'Added to shortlist.'}, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None, *args, **kwargs):
        # Allow deleting by target_profile id or shortlist entry id
        shortlist = Shortlist.objects.filter(user=request.user).filter(
            Q(target_profile_id=pk) | Q(id=pk)
        ).first()
        if not shortlist:
            return Response({'detail': 'Shortlist entry not found.'}, status=status.HTTP_404_NOT_FOUND)

        shortlist.delete()
        return Response({'shortlisted': False, 'message': 'Removed from shortlist.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path=r'status/(?P<profile_id>\d+)')
    def status_detail(self, request, profile_id=None):
        if not profile_id:
            return Response({'shortlisted': False})
        is_shortlisted = Shortlist.objects.filter(user=request.user, target_profile_id=profile_id).exists()
        return Response({'shortlisted': is_shortlisted})


class SuccessStoryViewSet(viewsets.ModelViewSet):
    queryset = SuccessStory.objects.all()
    serializer_class = SuccessStorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Public users see approved stories. Authenticated users see approved stories or their own submissions.
        if self.request.user and self.request.user.is_authenticated:
            return SuccessStory.objects.filter(Q(is_approved=True) | Q(submitted_by=self.request.user))
        return SuccessStory.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user, is_approved=False)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = Profile.objects.filter(user=user).first()
        has_profile = bool(profile)

        views_count = ProfileView.objects.filter(viewed_profile=profile).count() if profile else 0
        my_shortlist_count = Shortlist.objects.filter(user=user).count()
        received_interests_count = Interest.objects.filter(receiver=user).count()
        sent_interests_count = Interest.objects.filter(sender=user).count()
        accepted_connections_count = Connection.objects.filter(
            (Q(user1=user) | Q(user2=user)), status='ACCEPTED'
        ).count()
        unread_messages_count = Message.objects.filter(
            conversation__participants__user=user, is_read=False
        ).exclude(sender=user).count()

        # Dynamic profile completion & missing suggestions calculation
        completion = 0
        missing_suggestions = []

        if profile:
            # 1. Basic Info & Name (15%)
            if (profile.gender and profile.gender.strip()) and (profile.date_of_birth) and (profile.marital_status and profile.marital_status.strip()):
                completion += 15
            else:
                missing_suggestions.append("Complete basic personal information")
            
            # 2. Location & Contact (10%)
            if (profile.city and profile.city.strip()) and (profile.state and profile.state.strip()) and (profile.country and profile.country.strip()):
                completion += 10
            else:
                missing_suggestions.append("Add contact & location details")

            # 3. Physical & Bio (10%)
            if (profile.bio and profile.bio.strip()) or (profile.height_feet_inches and profile.height_feet_inches.strip()) or (profile.body_type and profile.body_type.strip()):
                completion += 10
            else:
                missing_suggestions.append("Add personal bio & physical attributes")

            # 4. Religion & Culture (10%)
            if (profile.religion and profile.religion.strip()) and (profile.caste and profile.caste.strip()):
                completion += 10
            else:
                missing_suggestions.append("Specify religion & caste details")

            # 5. Education (15%)
            edu = getattr(profile, 'education_details', None)
            if edu and ((edu.degree and edu.degree.strip()) or (edu.institution and edu.institution.strip())):
                completion += 15
            else:
                missing_suggestions.append("Add educational qualification details")

            # 6. Professional (15%)
            prof = getattr(profile, 'professional_details', None)
            if prof and ((prof.occupation and prof.occupation.strip()) or (prof.company_name and prof.company_name.strip()) or (prof.annual_income and prof.annual_income.strip())):
                completion += 15
            else:
                missing_suggestions.append("Add career & professional details")

            # 7. Family (10%)
            fam = getattr(profile, 'family_details', None)
            if fam and ((fam.family_type and fam.family_type.strip()) or (fam.father_occupation and fam.father_occupation.strip()) or (fam.native_place and fam.native_place.strip())):
                completion += 10
            else:
                missing_suggestions.append("Add family background & details")

            # 8. Lifestyle (5%)
            life = getattr(profile, 'lifestyle_details', None)
            if life and ((life.diet and life.diet.strip()) or (life.hobbies and life.hobbies.strip())):
                completion += 5
            else:
                missing_suggestions.append("Add lifestyle & hobbies")

            # 9. Partner Preferences (5%)
            pref = getattr(profile, 'partner_preferences', None)
            if pref and ((pref.location and pref.location.strip()) or (pref.religion and pref.religion.strip()) or (pref.caste and pref.caste.strip()) or (pref.min_age and pref.max_age)):
                completion += 5
            else:
                missing_suggestions.append("Add partner preferences")

            # 10. Photo (5%)
            if profile.avatar_url or profile.avatar_file or profile.photos.exists():
                completion += 5
            else:
                missing_suggestions.append("Upload a primary profile photo")

        completion = min(completion, 100)

        # Recent activities
        recent_activities = []
        recent_interests = Interest.objects.filter(receiver=user).order_by('-created_at')[:3]
        for item in recent_interests:
            recent_activities.append({
                'id': f"act-int-{item.id}",
                'type': 'interest_received',
                'title': 'New Interest Received',
                'description': f"{item.sender.first_name or item.sender.email} sent you an interest request.",
                'time': 'Recently',
                'unread': item.status == 'PENDING'
            })

        recent_views = ProfileView.objects.filter(viewed_profile=profile).order_by('-created_at')[:2] if profile else []
        for view_item in recent_views:
            recent_activities.append({
                'id': f"act-vw-{view_item.id}",
                'type': 'view',
                'title': 'Profile Viewed',
                'description': f"{view_item.viewer.first_name or 'A verified member'} viewed your profile details.",
                'time': 'Recently',
                'unread': False
            })

        return Response({
            'hasProfile': has_profile,
            'profileViews': views_count,
            'myShortlist': my_shortlist_count,
            'interestsReceived': received_interests_count,
            'interestsSent': sent_interests_count,
            'acceptedConnections': accepted_connections_count,
            'unreadMessages': unread_messages_count,
            'profileCompletion': completion,
            'missingSuggestions': missing_suggestions,
            'recentActivities': recent_activities
        })


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        verified_profiles = Profile.objects.filter(is_verified=True).count()
        pending_approvals = Profile.objects.filter(is_verified=False).count()
        active_matches = Connection.objects.filter(status='ACCEPTED').count()

        return Response({
            'totalRegisteredUsers': total_users,
            'verifiedProfiles': verified_profiles,
            'pendingApprovals': pending_approvals,
            'reportedProfiles': 0,
            'activeMatches': active_matches,
            'thisMonthGrowth': "+12%"
        })


class AdminUsersView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.select_related('profile').all().order_by('-id')
        user_list = []
        for u in users:
            prof = getattr(u, 'profile', None)
            user_list.append({
                'id': u.id,
                'name': u.first_name or u.email.split('@')[0],
                'email': u.email,
                'role': 'ADMIN' if (u.is_staff or u.is_superuser) else 'USER',
                'gender': prof.gender if prof else 'N/A',
                'city': prof.city if prof else 'N/A',
                'is_verified': prof.is_verified if prof else False,
                'joined_date': u.created_at.strftime('%Y-%m-%d')
            })
        return Response(user_list)

    def patch(self, request, pk):
        try:
            profile = Profile.objects.get(user_id=pk)
            profile.is_verified = not profile.is_verified
            profile.save()
            return Response({'status': 'success', 'is_verified': profile.is_verified})
        except Profile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
