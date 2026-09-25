"""
Development/Testing Seed Data Command for AdarshVivah
WARNING: This command is ONLY for development and testing environments.
It populates initial sample users, profiles, partner preferences, and approved success stories.
Usage: python manage.py seed_db
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from profiles.models import (
    Profile, EducationDetails, ProfessionalDetails, FamilyDetails,
    LifestyleDetails, PartnerPreferences, SuccessStory
)
import datetime

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds initial sample profiles and success stories into database for development/testing ONLY.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Seeding development/testing database...'))

        # Sample Users & Profiles data
        sample_data = [
            {
                'email': 'ananya.sharma@example.com',
                'name': 'Ananya Sharma',
                'gender': 'Female',
                'dob': datetime.date(1997, 4, 15),
                'height_ft': "5' 5\"",
                'height_cm': 165,
                'marital_status': 'Never Married',
                'religion': 'Hindu',
                'caste': 'Brahmin',
                'sub_caste': 'Kanyakubj',
                'mother_tongue': 'Hindi',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'bio': 'Grounded, career-driven software engineer with strong traditional values.',
                'photo': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
                'is_verified': True,
                'edu': {'degree': 'M.Tech in Computer Science', 'institution': 'IIT Bombay', 'education_level': 'Master / Post Graduate'},
                'prof': {'occupation': 'Senior Software Engineer', 'company_name': 'Global Tech Solutions', 'annual_income': '₹25 - 30 Lakhs P.A.'},
                'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate Traditional', 'father_occupation': 'Retd. Class-1 Government Officer', 'mother_occupation': 'Homemaker', 'native_place': 'Jaipur, Rajasthan'},
                'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'hobbies': 'Classical Music, Reading, Yoga, Travel'},
                'pref': {'min_age': 27, 'max_age': 32, 'min_height': "5' 8\"", 'max_height': "6' 2\"", 'religion': 'Hindu', 'caste': 'Brahmin / Open'}
            },
            {
                'email': 'priya.iyer@example.com',
                'name': 'Priya Iyer',
                'gender': 'Female',
                'dob': datetime.date(1998, 8, 22),
                'height_ft': "5' 4\"",
                'height_cm': 163,
                'marital_status': 'Never Married',
                'religion': 'Hindu',
                'caste': 'Iyer',
                'sub_caste': 'Vadama',
                'mother_tongue': 'Tamil',
                'city': 'Bangalore',
                'state': 'Karnataka',
                'bio': 'Passionate Product Designer who loves art, filter coffee, and weekend hikes.',
                'photo': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                'is_verified': True,
                'edu': {'degree': 'B.Des in Product Design', 'institution': 'NID Ahmedabad', 'education_level': 'Bachelor / Graduate'},
                'prof': {'occupation': 'Lead Product Designer', 'company_name': 'Fintech Unicorn', 'annual_income': '₹22 - 26 Lakhs P.A.'},
                'fam': {'family_type': 'Nuclear Family', 'family_values': 'Liberal Traditional', 'father_occupation': 'Chartered Accountant', 'mother_occupation': 'Professor'},
                'life': {'diet': 'Vegetarian', 'drinking': 'Socially', 'smoking': 'Never', 'hobbies': 'Art, Photography, Coffee Brewing, Travel'},
                'pref': {'min_age': 26, 'max_age': 31, 'min_height': "5' 7\"", 'max_height': "6' 0\"", 'religion': 'Hindu'}
            },
            {
                'email': 'kabir.gill@example.com',
                'name': 'Kabir Gill',
                'gender': 'Male',
                'dob': datetime.date(1995, 11, 10),
                'height_ft': "6' 0\"",
                'height_cm': 183,
                'marital_status': 'Never Married',
                'religion': 'Sikh',
                'caste': 'Jatt',
                'mother_tongue': 'Punjabi',
                'city': 'Chandigarh',
                'state': 'Punjab',
                'bio': 'Investment banker and fitness enthusiast who enjoys classical music and family gatherings.',
                'photo': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
                'is_verified': True,
                'edu': {'degree': 'MBA in Finance', 'institution': 'IIM Ahmedabad', 'education_level': 'Master / Post Graduate'},
                'prof': {'occupation': 'VP Investment Banking', 'company_name': 'Capital Advisory', 'annual_income': '₹35 - 40 Lakhs P.A.'},
                'fam': {'family_type': 'Joint Family', 'family_values': 'Traditional', 'father_occupation': 'Industrialist', 'mother_occupation': 'Homemaker'},
                'life': {'diet': 'Non-Vegetarian', 'drinking': 'Socially', 'smoking': 'Never', 'hobbies': 'Fitness, Squash, Travelling'},
                'pref': {'min_age': 24, 'max_age': 29, 'religion': 'Sikh / Open'}
            },
            {
                'email': 'rohan.deshmukh@example.com',
                'name': 'Rohan Deshmukh',
                'gender': 'Male',
                'dob': datetime.date(1994, 2, 28),
                'height_ft': "5' 11\"",
                'height_cm': 180,
                'marital_status': 'Never Married',
                'religion': 'Hindu',
                'caste': 'Maratha',
                'mother_tongue': 'Marathi',
                'city': 'Pune',
                'state': 'Maharashtra',
                'bio': 'Tech entrepreneur running an AI startup in Pune. Family oriented and adventure lover.',
                'photo': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
                'is_verified': True,
                'edu': {'degree': 'B.Tech CS', 'institution': 'COEP Pune', 'education_level': 'Bachelor'},
                'prof': {'occupation': 'Founder & CEO', 'company_name': 'TechVentures', 'annual_income': '₹40+ Lakhs P.A.'},
                'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_occupation': 'Civil Engineer', 'mother_occupation': 'School Principal'},
                'life': {'diet': 'Eggetarian', 'drinking': 'Socially', 'smoking': 'Never', 'hobbies': 'Trekking, Reading, Coding'},
                'pref': {'min_age': 24, 'max_age': 28, 'religion': 'Hindu'}
            }
        ]

        for item in sample_data:
            user, u_created = User.objects.get_or_create(
                email=item['email'],
                defaults={'first_name': item['name']}
            )
            if u_created:
                user.set_password('Password123!')
                user.save()

            profile, _ = Profile.objects.get_or_create(
                user=user,
                defaults={
                    'gender': item['gender'],
                    'date_of_birth': item['dob'],
                    'height_feet_inches': item['height_ft'],
                    'height_cm': item['height_cm'],
                    'marital_status': item['marital_status'],
                    'religion': item['religion'],
                    'caste': item['caste'],
                    'mother_tongue': item['mother_tongue'],
                    'city': item['city'],
                    'state': item['state'],
                    'bio': item['bio'],
                    'avatar_url': item['photo'],
                    'is_verified': item['is_verified']
                }
            )

            EducationDetails.objects.get_or_create(profile=profile, defaults=item['edu'])
            ProfessionalDetails.objects.get_or_create(profile=profile, defaults=item['prof'])
            FamilyDetails.objects.get_or_create(profile=profile, defaults=item['fam'])
            LifestyleDetails.objects.get_or_create(profile=profile, defaults=item['life'])
            PartnerPreferences.objects.get_or_create(profile=profile, defaults=item['pref'])

        # Approved Success Stories
        stories_data = [
            {
                'couple_name': 'Aarav & Ananya',
                'location': 'Indore, Madhya Pradesh',
                'marriage_date': 'February 2025',
                'story': 'We found each other through AdarshVivah and discovered that our values, family expectations, and life goals were beautifully aligned.',
                'image_url': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
                'is_approved': True
            },
            {
                'couple_name': 'Rohan & Priya',
                'location': 'Bhopal, Madhya Pradesh',
                'marriage_date': 'December 2024',
                'story': 'AdarshVivah helped us connect with a family that shared similar values and expectations. Our journey from the first conversation to marriage was truly special.',
                'image_url': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
                'is_approved': True
            }
        ]

        for s in stories_data:
            SuccessStory.objects.get_or_create(
                couple_name=s['couple_name'],
                defaults=s
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded development/testing database!'))
