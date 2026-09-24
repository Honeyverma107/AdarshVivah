"""
Management command to seed 10 test matrimonial profiles (5 Grooms, 5 Brides)
Usage: python manage.py seed_test_profiles
"""

import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from profiles.models import (
    Profile, EducationDetails, ProfessionalDetails, FamilyDetails,
    LifestyleDetails, PartnerPreferences, Shortlist
)
from chat.models import Interest

User = get_user_model()

TEST_PASSWORD = 'TestPassword123!'

TEST_DATA = [
    # GROOMS (5)
    {
        'email': 'groom1@test.adarshvivah.com',
        'name': 'Test Groom 1 (Aarav)',
        'gender': 'Male',
        'dob': datetime.date(1995, 5, 12),
        'height_ft': "5' 10\"",
        'height_cm': 178,
        'weight_kg': 74,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Brahmin',
        'sub_caste': 'Kanyakubj',
        'mother_tongue': 'Hindi',
        'city': 'Delhi',
        'state': 'Delhi',
        'phone_number': '+919876543210',
        'bio': 'Senior Software Architect at Microsoft. Passionate about technology, chess, and fitness.',
        'edu': {'degree': 'M.Tech in Computer Science', 'institution': 'IIT Delhi', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'Software Architect', 'company_name': 'Microsoft', 'employed_in': 'Private Sector', 'annual_income': '₹30 - 35 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Rajesh Sharma', 'father_occupation': 'Retd. Bank Manager', 'mother_name': 'Sunita Sharma', 'mother_occupation': 'Homemaker', 'native_place': 'Jaipur'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Chess, Reading, Gym'},
        'pref': {
            'min_age': 24, 'max_age': 29, 'min_height': "5' 2\"", 'max_height': "5' 8\"", 'religion': 'Hindu', 'caste': 'Brahmin',
            'location': 'Mumbai', 'education_level': 'Master / Post Graduate', 'occupation': 'Data Scientist',
            'age_priority': 'HIGH', 'location_priority': 'HIGH', 'education_priority': 'MEDIUM',
            'occupation_priority': 'MEDIUM', 'religion_priority': 'HIGH', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'LOW'
        }
    },
    {
        'email': 'groom2@test.adarshvivah.com',
        'name': 'Test Groom 2 (Rohan)',
        'gender': 'Male',
        'dob': datetime.date(1993, 8, 20),
        'height_ft': "6' 0\"",
        'height_cm': 183,
        'weight_kg': 80,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Gujarati Vaishnav',
        'sub_caste': 'Shah',
        'mother_tongue': 'Gujarati',
        'city': 'Mumbai',
        'state': 'Maharashtra',
        'phone_number': '+919876543211',
        'bio': 'Investment Banker based in Mumbai. Enjoy traveling, fine dining, and playing tennis.',
        'edu': {'degree': 'MBA in Finance', 'institution': 'IIM Ahmedabad', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'Investment Banker', 'company_name': 'HDFC Bank', 'employed_in': 'Private Sector', 'annual_income': '₹35 - 40 Lakhs P.A.'},
        'fam': {'family_type': 'Joint Family', 'family_values': 'Liberal', 'father_name': 'Kirit Mehta', 'father_occupation': 'Business Owner', 'mother_name': 'Bhavna Mehta', 'mother_occupation': 'Homemaker', 'native_place': 'Ahmedabad'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Occasionally', 'smoking': 'Never', 'exercise': 'Occasionally', 'hobbies': 'Tennis, Travel, Stock Market'},
        'pref': {
            'min_age': 25, 'max_age': 30, 'min_height': "5' 4\"", 'max_height': "5' 10\"", 'religion': 'Hindu',
            'location': 'Ahmedabad', 'education_level': 'Bachelor / Graduate', 'occupation': 'Chartered Accountant',
            'age_priority': 'MEDIUM', 'location_priority': 'HIGH', 'education_priority': 'HIGH',
            'occupation_priority': 'MEDIUM', 'religion_priority': 'MEDIUM', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'MEDIUM'
        }
    },
    {
        'email': 'groom3@test.adarshvivah.com',
        'name': 'Test Groom 3 (Aditya)',
        'gender': 'Male',
        'dob': datetime.date(1996, 3, 15),
        'height_ft': "5' 8\"",
        'height_cm': 173,
        'weight_kg': 70,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Kayastha',
        'sub_caste': 'Saxena',
        'mother_tongue': 'Hindi',
        'city': 'Lucknow',
        'state': 'Uttar Pradesh',
        'phone_number': '+919876543212',
        'bio': 'Civil Services Officer (IAS). Dedicated to public service, community development, and literature.',
        'edu': {'degree': 'B.Tech in Civil Engineering', 'institution': 'IIT Kanpur', 'education_level': 'Bachelor / Graduate'},
        'prof': {'occupation': 'Civil Services Officer', 'company_name': 'Government of India', 'employed_in': 'Government / Public Sector', 'annual_income': '₹18 - 22 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Traditional', 'father_name': 'Suresh Verma', 'father_occupation': 'IAS Officer (Retd)', 'mother_name': 'Asha Verma', 'mother_occupation': 'School Principal', 'native_place': 'Lucknow'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Poetry, Badminton, History'},
        'pref': {
            'min_age': 23, 'max_age': 28, 'min_height': "5' 2\"", 'max_height': "5' 7\"", 'religion': 'Hindu',
            'location': 'Delhi', 'education_level': 'Doctorate / PhD', 'occupation': 'Assistant Professor',
            'age_priority': 'HIGH', 'location_priority': 'MEDIUM', 'education_priority': 'HIGH',
            'occupation_priority': 'HIGH', 'religion_priority': 'HIGH', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'LOW'
        }
    },
    {
        'email': 'groom4@test.adarshvivah.com',
        'name': 'Test Groom 4 (Kunal)',
        'gender': 'Male',
        'dob': datetime.date(1994, 11, 5),
        'height_ft': "5' 11\"",
        'height_cm': 180,
        'weight_kg': 76,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Bania',
        'sub_caste': 'Agarwal',
        'mother_tongue': 'Hindi',
        'city': 'Bengaluru',
        'state': 'Karnataka',
        'phone_number': '+919876543213',
        'bio': 'Product Manager at Flipkart in Bangalore. Love trekking, photography, and coffee brewing.',
        'edu': {'degree': 'B.E. & MBA', 'institution': 'BITS Pilani / XLRI', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'Senior Product Manager', 'company_name': 'Flipkart', 'employed_in': 'Private Sector', 'annual_income': '₹28 - 32 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Vinod Gupta', 'father_occupation': 'Businessman', 'mother_name': 'Ritu Gupta', 'mother_occupation': 'Homemaker', 'native_place': 'Agra'},
        'life': {'diet': 'Eggetarian', 'drinking': 'Occasionally', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Trekking, Photography, Cooking'},
        'pref': {
            'min_age': 24, 'max_age': 29, 'min_height': "5' 3\"", 'max_height': "5' 9\"", 'religion': 'Hindu',
            'location': 'Bengaluru', 'education_level': 'Bachelor / Graduate', 'occupation': 'Senior UX Designer',
            'age_priority': 'MEDIUM', 'location_priority': 'HIGH', 'education_priority': 'MEDIUM',
            'occupation_priority': 'MEDIUM', 'religion_priority': 'MEDIUM', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'MEDIUM'
        }
    },
    {
        'email': 'groom5@test.adarshvivah.com',
        'name': 'Test Groom 5 (Rahul)',
        'gender': 'Male',
        'dob': datetime.date(1992, 7, 18),
        'height_ft': "5' 9\"",
        'height_cm': 175,
        'weight_kg': 72,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Khatri',
        'sub_caste': 'Malhotra',
        'mother_tongue': 'Punjabi',
        'city': 'Chandigarh',
        'state': 'Punjab',
        'phone_number': '+919876543214',
        'bio': 'Orthopedic Surgeon practicing at Fortis Hospital. Caring, family-oriented, and loves road trips.',
        'edu': {'degree': 'MBBS, MS Orthopedics', 'institution': 'PGIMER Chandigarh', 'education_level': 'Doctorate / PhD'},
        'prof': {'occupation': 'Orthopedic Surgeon', 'company_name': 'Fortis Hospital', 'employed_in': 'Private Sector', 'annual_income': '₹35 - 40 Lakhs P.A.'},
        'fam': {'family_type': 'Joint Family', 'family_values': 'Traditional', 'father_name': 'Dr. Ashok Malhotra', 'father_occupation': 'Physician', 'mother_name': 'Dr. Anita Malhotra', 'mother_occupation': 'Gynecologist', 'native_place': 'Amritsar'},
        'life': {'diet': 'Non-Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Occasionally', 'hobbies': 'Driving, Swimming, Music'},
        'pref': {
            'min_age': 25, 'max_age': 31, 'min_height': "5' 2\"", 'max_height': "5' 8\"", 'religion': 'Hindu',
            'location': 'Gurugram', 'education_level': 'Master / Post Graduate', 'occupation': 'HR Manager',
            'age_priority': 'HIGH', 'location_priority': 'MEDIUM', 'education_priority': 'HIGH',
            'occupation_priority': 'MEDIUM', 'religion_priority': 'HIGH', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'HIGH'
        }
    },

    # BRIDES (5)
    {
        'email': 'bride1@test.adarshvivah.com',
        'name': 'Test Bride 1 (Ananya)',
        'gender': 'Female',
        'dob': datetime.date(1997, 4, 15),
        'height_ft': "5' 5\"",
        'height_cm': 165,
        'weight_kg': 58,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Brahmin',
        'sub_caste': 'Kanyakubj',
        'mother_tongue': 'Hindi',
        'city': 'Mumbai',
        'state': 'Maharashtra',
        'phone_number': '+919876543215',
        'bio': 'Data Scientist at an AI research lab in Mumbai. Balanced individual loving Kathak dance and classical music.',
        'edu': {'degree': 'M.Tech in Data Science', 'institution': 'IIT Bombay', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'Data Scientist', 'company_name': 'TCS Innovation Labs', 'employed_in': 'Private Sector', 'annual_income': '₹22 - 25 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Alok Sharma', 'father_occupation': 'Chartered Accountant', 'mother_name': 'Meena Sharma', 'mother_occupation': 'Teacher', 'native_place': 'Jaipur'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Kathak, Classical Music, Travel'},
        'pref': {
            'min_age': 28, 'max_age': 33, 'min_height': "5' 8\"", 'max_height': "6' 2\"", 'religion': 'Hindu', 'caste': 'Brahmin',
            'location': 'Delhi', 'education_level': 'Master / Post Graduate', 'occupation': 'Software Architect',
            'age_priority': 'HIGH', 'location_priority': 'HIGH', 'education_priority': 'HIGH',
            'occupation_priority': 'MEDIUM', 'religion_priority': 'HIGH', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'LOW'
        }
    },
    {
        'email': 'bride2@test.adarshvivah.com',
        'name': 'Test Bride 2 (Ishita)',
        'gender': 'Female',
        'dob': datetime.date(1998, 9, 10),
        'height_ft': "5' 4\"",
        'height_cm': 163,
        'weight_kg': 55,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Gujarati Vaishnav',
        'sub_caste': 'Shah',
        'mother_tongue': 'Gujarati',
        'city': 'Ahmedabad',
        'state': 'Gujarat',
        'phone_number': '+919876543216',
        'bio': 'Chartered Accountant working with EY. Art lover, foodie, and avid reader.',
        'edu': {'degree': 'CA, B.Com', 'institution': 'ICAI / St. Xavier\'s', 'education_level': 'Bachelor / Graduate'},
        'prof': {'occupation': 'Chartered Accountant', 'company_name': 'EY', 'employed_in': 'Private Sector', 'annual_income': '₹18 - 22 Lakhs P.A.'},
        'fam': {'family_type': 'Joint Family', 'family_values': 'Liberal', 'father_name': 'Nitin Mehta', 'father_occupation': 'Textile Businessman', 'mother_name': 'Neeta Mehta', 'mother_occupation': 'Homemaker', 'native_place': 'Surat'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Occasionally', 'hobbies': 'Painting, Baking, Reading'},
        'pref': {
            'min_age': 27, 'max_age': 32, 'min_height': "5' 7\"", 'max_height': "6' 1\"", 'religion': 'Hindu',
            'location': 'Mumbai', 'education_level': 'Master / Post Graduate', 'occupation': 'Investment Banker',
            'age_priority': 'MEDIUM', 'location_priority': 'HIGH', 'education_priority': 'HIGH',
            'occupation_priority': 'MEDIUM', 'religion_priority': 'MEDIUM', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'MEDIUM'
        }
    },
    {
        'email': 'bride3@test.adarshvivah.com',
        'name': 'Test Bride 3 (Priya)',
        'gender': 'Female',
        'dob': datetime.date(1996, 6, 25),
        'height_ft': "5' 6\"",
        'height_cm': 168,
        'weight_kg': 60,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Kayastha',
        'sub_caste': 'Srivastava',
        'mother_tongue': 'Hindi',
        'city': 'Delhi',
        'state': 'Delhi',
        'phone_number': '+919876543217',
        'bio': 'Assistant Professor of Economics at Delhi University. Warm, compassionate, and fond of classical literature.',
        'edu': {'degree': 'Ph.D. in Economics', 'institution': 'Delhi School of Economics', 'education_level': 'Doctorate / PhD'},
        'prof': {'occupation': 'Assistant Professor', 'company_name': 'Delhi University', 'employed_in': 'Government / Public Sector', 'annual_income': '₹15 - 18 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Traditional', 'father_name': 'Raman Verma', 'father_occupation': 'Advocate', 'mother_name': 'Sushma Verma', 'mother_occupation': 'Homemaker', 'native_place': 'Varanasi'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Debating, Writing, Gardening'},
        'pref': {
            'min_age': 29, 'max_age': 34, 'min_height': "5' 8\"", 'max_height': "6' 2\"", 'religion': 'Hindu',
            'location': 'Lucknow', 'education_level': 'Bachelor / Graduate', 'occupation': 'Civil Services Officer',
            'age_priority': 'HIGH', 'location_priority': 'MEDIUM', 'education_priority': 'HIGH',
            'occupation_priority': 'HIGH', 'religion_priority': 'HIGH', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'LOW'
        }
    },
    {
        'email': 'bride4@test.adarshvivah.com',
        'name': 'Test Bride 4 (Kavya)',
        'gender': 'Female',
        'dob': datetime.date(1997, 12, 1),
        'height_ft': "5' 3\"",
        'height_cm': 160,
        'weight_kg': 52,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Bania',
        'sub_caste': 'Agarwal',
        'mother_tongue': 'Hindi',
        'city': 'Bengaluru',
        'state': 'Karnataka',
        'phone_number': '+919876543218',
        'bio': 'Senior UX Designer at Zoho in Bangalore. Creative, energetic, and animal lover.',
        'edu': {'degree': 'B.Des in Interaction Design', 'institution': 'NID Vijayawada', 'education_level': 'Bachelor / Graduate'},
        'prof': {'occupation': 'Senior UX Designer', 'company_name': 'Zoho', 'employed_in': 'Private Sector', 'annual_income': '₹20 - 24 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Pankaj Gupta', 'father_occupation': 'Businessman', 'mother_name': 'Sangeeta Gupta', 'mother_occupation': 'Interior Designer', 'native_place': 'Indore'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Socially', 'smoking': 'Never', 'exercise': 'Occasionally', 'hobbies': 'Digital Art, Pottery, Travel'},
        'pref': {
            'min_age': 27, 'max_age': 32, 'min_height': "5' 7\"", 'max_height': "6' 0\"", 'religion': 'Hindu',
            'location': 'Bengaluru', 'education_level': 'Master / Post Graduate', 'occupation': 'Senior Product Manager',
            'age_priority': 'MEDIUM', 'location_priority': 'HIGH', 'education_priority': 'MEDIUM',
            'occupation_priority': 'MEDIUM', 'religion_priority': 'MEDIUM', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'MEDIUM'
        }
    },
    {
        'email': 'bride5@test.adarshvivah.com',
        'name': 'Test Bride 5 (Neha)',
        'gender': 'Female',
        'dob': datetime.date(1995, 2, 14),
        'height_ft': "5' 7\"",
        'height_cm': 170,
        'weight_kg': 62,
        'marital_status': 'Never Married',
        'religion': 'Hindu',
        'caste': 'Khatri',
        'sub_caste': 'Malhotra',
        'mother_tongue': 'Punjabi',
        'city': 'Gurugram',
        'state': 'Haryana',
        'phone_number': '+919876543219',
        'bio': 'HR Business Partner at Deloitte in Gurgaon. Outgoing personality who enjoys music festivals and yoga.',
        'edu': {'degree': 'MBA in HR', 'institution': 'MDI Gurgaon', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'HR Manager', 'company_name': 'Deloitte', 'employed_in': 'Private Sector', 'annual_income': '₹22 - 26 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Vikram Malhotra', 'father_occupation': 'Corporate VP (Retd)', 'mother_name': 'Poonam Malhotra', 'mother_occupation': 'School Principal', 'native_place': 'Delhi'},
        'life': {'diet': 'Non-Vegetarian', 'drinking': 'Occasionally', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Yoga, Event Planning, Music'},
        'pref': {
            'min_age': 30, 'max_age': 35, 'min_height': "5' 9\"", 'max_height': "6' 3\"", 'religion': 'Hindu',
            'location': 'Chandigarh', 'education_level': 'Doctorate / PhD', 'occupation': 'Orthopedic Surgeon',
            'age_priority': 'HIGH', 'location_priority': 'MEDIUM', 'education_priority': 'HIGH',
            'occupation_priority': 'MEDIUM', 'religion_priority': 'HIGH', 'marital_status_priority': 'HIGH', 'lifestyle_priority': 'HIGH'
        }
    }
]


class Command(BaseCommand):
    help = 'Seeds 10 development-only test matrimonial accounts (5 Grooms, 5 Brides) into MySQL database.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Seeding development test matrimonial profiles...'))

        created_count = 0
        updated_count = 0

        for item in TEST_DATA:
            user, created = User.objects.get_or_create(
                email=item['email'],
                defaults={
                    'first_name': item['name'],
                    'is_active': True,
                }
            )
            user.first_name = item['name']
            user.set_password(TEST_PASSWORD)
            user.save()

            profile, _ = Profile.objects.get_or_create(user=user)
            profile.gender = item['gender']
            profile.date_of_birth = item['dob']
            profile.height_feet_inches = item['height_ft']
            profile.height_cm = item['height_cm']
            profile.weight_kg = item['weight_kg']
            profile.marital_status = item['marital_status']
            profile.religion = item['religion']
            profile.caste = item['caste']
            profile.sub_caste = item['sub_caste']
            profile.mother_tongue = item['mother_tongue']
            profile.city = item['city']
            profile.state = item['state']
            profile.country = 'India'
            profile.phone_number = item.get('phone_number', '+919876543210')
            profile.bio = item['bio']
            profile.profile_visibility = 'All Members'
            profile.is_verified = True
            profile.save()

            # Nested details
            edu, _ = EducationDetails.objects.get_or_create(profile=profile)
            for k, v in item['edu'].items():
                setattr(edu, k, v)
            edu.save()

            prof, _ = ProfessionalDetails.objects.get_or_create(profile=profile)
            for k, v in item['prof'].items():
                setattr(prof, k, v)
            prof.save()

            fam, _ = FamilyDetails.objects.get_or_create(profile=profile)
            for k, v in item['fam'].items():
                setattr(fam, k, v)
            fam.save()

            life, _ = LifestyleDetails.objects.get_or_create(profile=profile)
            for k, v in item['life'].items():
                setattr(life, k, v)
            life.save()

            pref, _ = PartnerPreferences.objects.get_or_create(profile=profile)
            for k, v in item['pref'].items():
                setattr(pref, k, v)
            pref.save()

            if created:
                created_count += 1
            else:
                updated_count += 1

        total_users = User.objects.filter(email__endswith='@test.adarshvivah.com').count()
        total_profiles = Profile.objects.filter(user__email__endswith='@test.adarshvivah.com').count()
        total_prefs = PartnerPreferences.objects.filter(profile__user__email__endswith='@test.adarshvivah.com').count()
        total_interests = Interest.objects.filter(sender__email__endswith='@test.adarshvivah.com').count()
        total_shortlists = Shortlist.objects.filter(user__email__endswith='@test.adarshvivah.com').count()

        self.stdout.write(self.style.SUCCESS(
            f'\nSuccessfully seeded development test profiles!\n'
            f'  - Processed: {len(TEST_DATA)} accounts ({created_count} created, {updated_count} updated)\n'
            f'  - Total Test Users: {total_users} (5 Grooms, 5 Brides)\n'
            f'  - Total Test Profiles: {total_profiles}\n'
            f'  - Total Partner Preferences: {total_prefs}\n'
            f'  - Initial Test Interests: {total_interests}\n'
            f'  - Initial Test Shortlists: {total_shortlists}\n'
        ))

        self.stdout.write(self.style.SUCCESS('==========================================='))
        self.stdout.write(self.style.SUCCESS('         TEST LOGIN CREDENTIALS            '))
        self.stdout.write(self.style.SUCCESS('==========================================='))
        self.stdout.write(f'Password for ALL test accounts: {TEST_PASSWORD}\n')

        self.stdout.write('GROOM ACCOUNTS (5):')
        for item in TEST_DATA[:5]:
            self.stdout.write(f"  • {item['name']:<25} | Email: {item['email']}")

        self.stdout.write('\nBRIDE ACCOUNTS (5):')
        for item in TEST_DATA[5:]:
            self.stdout.write(f"  • {item['name']:<25} | Email: {item['email']}")

        self.stdout.write(self.style.SUCCESS('===========================================\n'))
