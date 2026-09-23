from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Profile(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    MARITAL_STATUS_CHOICES = [
        ('Never Married', 'Never Married'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
        ('Awaiting Divorce', 'Awaiting Divorce'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, default='')
    date_of_birth = models.DateField(null=True, blank=True)
    height_feet_inches = models.CharField(max_length=20, blank=True, default='')
    height_cm = models.IntegerField(null=True, blank=True)
    weight_kg = models.IntegerField(null=True, blank=True)
    marital_status = models.CharField(max_length=30, choices=MARITAL_STATUS_CHOICES, blank=True, default='')
    religion = models.CharField(max_length=50, blank=True, default='')
    caste = models.CharField(max_length=50, blank=True, default='')
    sub_caste = models.CharField(max_length=50, blank=True, default='')
    gothram = models.CharField(max_length=100, blank=True, default='')
    mother_tongue = models.CharField(max_length=50, blank=True, default='')
    languages_known = models.CharField(max_length=200, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    country = models.CharField(max_length=100, blank=True, default='')
    pincode = models.CharField(max_length=20, blank=True, default='')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    body_type = models.CharField(max_length=50, blank=True, default='')
    complexion = models.CharField(max_length=50, blank=True, default='')
    physical_status = models.CharField(max_length=100, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    avatar_url = models.URLField(max_length=500, blank=True, default='')
    avatar_file = models.ImageField(upload_to='avatars/', null=True, blank=True)
    profile_visibility = models.CharField(max_length=50, default='All Members')
    show_contact = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.email} ({self.user.first_name})"

    @property
    def age(self):
        if not self.date_of_birth:
            return None
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))

    @property
    def name(self):
        return self.user.first_name or self.user.email.split('@')[0]


class EducationDetails(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='education_details')
    degree = models.CharField(max_length=150, blank=True, default='')
    field_of_study = models.CharField(max_length=150, blank=True, default='')
    institution = models.CharField(max_length=200, blank=True, default='')
    education_level = models.CharField(max_length=50, blank=True, default='')
    passing_year = models.CharField(max_length=10, blank=True, default='')
    additional_degree = models.CharField(max_length=150, blank=True, default='')

    def __str__(self):
        return f"Education of {self.profile.user.email}"


class ProfessionalDetails(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='professional_details')
    occupation = models.CharField(max_length=150, blank=True, default='')
    employed_in = models.CharField(max_length=100, blank=True, default='')
    company_name = models.CharField(max_length=150, blank=True, default='')
    annual_income = models.CharField(max_length=100, blank=True, default='')
    work_location = models.CharField(max_length=150, blank=True, default='')
    experience_years = models.CharField(max_length=50, blank=True, default='')

    def __str__(self):
        return f"Profession of {self.profile.user.email}"


class FamilyDetails(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='family_details')
    family_type = models.CharField(max_length=50, blank=True, default='')
    family_values = models.CharField(max_length=50, blank=True, default='')
    father_name = models.CharField(max_length=150, blank=True, default='')
    father_occupation = models.CharField(max_length=150, blank=True, default='')
    mother_name = models.CharField(max_length=150, blank=True, default='')
    mother_occupation = models.CharField(max_length=150, blank=True, default='')
    brothers_count = models.IntegerField(default=0)
    sisters_count = models.IntegerField(default=0)
    married_brothers_count = models.IntegerField(default=0)
    married_sisters_count = models.IntegerField(default=0)
    family_status = models.CharField(max_length=50, blank=True, default='')
    native_place = models.CharField(max_length=100, blank=True, default='')
    about_family = models.TextField(blank=True, default='')

    def __str__(self):
        return f"Family of {self.profile.user.email}"


class LifestyleDetails(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='lifestyle_details')
    diet = models.CharField(max_length=50, blank=True, default='')
    drinking = models.CharField(max_length=50, blank=True, default='')
    smoking = models.CharField(max_length=50, blank=True, default='')
    exercise = models.CharField(max_length=50, blank=True, default='')
    hobbies = models.TextField(blank=True, default='')
    interests = models.TextField(blank=True, default='')
    pets = models.CharField(max_length=50, blank=True, default='')

    def __str__(self):
        return f"Lifestyle of {self.profile.user.email}"


class PartnerPreferences(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='partner_preferences')
    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)
    min_height = models.CharField(max_length=20, blank=True, default='')
    max_height = models.CharField(max_length=20, blank=True, default='')
    marital_status = models.CharField(max_length=50, blank=True, default='')
    religion = models.CharField(max_length=50, blank=True, default='')
    caste = models.CharField(max_length=100, blank=True, default='')
    sub_caste = models.CharField(max_length=100, blank=True, default='')
    mother_tongue = models.CharField(max_length=100, blank=True, default='')
    education_level = models.CharField(max_length=100, blank=True, default='')
    occupation = models.CharField(max_length=100, blank=True, default='')
    min_income = models.CharField(max_length=100, blank=True, default='')
    location = models.CharField(max_length=150, blank=True, default='')
    diet = models.CharField(max_length=50, blank=True, default='')
    smoking = models.CharField(max_length=50, blank=True, default='')
    drinking = models.CharField(max_length=50, blank=True, default='')

    def __str__(self):
        return f"Preferences of {self.profile.user.email}"


class ProfilePhoto(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='gallery/', null=True, blank=True)
    image_url = models.URLField(max_length=500, blank=True, default='')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.profile.user.email}"


class Shortlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shortlisted_items')
    target_profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='shortlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'target_profile')
        constraints = [
            models.UniqueConstraint(fields=['user', 'target_profile'], name='unique_user_shortlist')
        ]

    def __str__(self):
        return f"{self.user.email} shortlisted {self.target_profile.name}"


class ProfileView(models.Model):
    viewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile_views_made')
    viewed_profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='profile_views_received')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.viewer.email} viewed {self.viewed_profile.name}"


class SuccessStory(models.Model):
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='submitted_stories')
    couple_name = models.CharField(max_length=150)
    location = models.CharField(max_length=150)
    marriage_date = models.CharField(max_length=100)
    story = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, default='')
    image = models.ImageField(upload_to='success_stories/', null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Success Story: {self.couple_name} ({'Approved' if self.is_approved else 'Pending'})"
