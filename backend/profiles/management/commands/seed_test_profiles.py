"""
Management command to seed 10 test matrimonial profiles (5 Grooms, 5 Brides)
Usage: python manage.py seed_test_profiles
"""

import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from profiles.models import (
    Profile, EducationDetails, ProfessionalDetails, FamilyDetails,
    LifestyleDetails, PartnerPreferences
)

User = get_user_model()

TEST_PASSWORD = 'Test@12345'

TEST_DATA = [
    # GROOMS (5)
    {
        'email': 'groom1.test@adarshvivah.com',
        'name': 'Aarav Sharma',
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
        'bio': 'Senior Software Architect at Microsoft. Passionate about technology, chess, and fitness.',
        'edu': {'degree': 'M.Tech in Computer Science', 'institution': 'IIT Delhi', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'Software Architect', 'company_name': 'Microsoft', 'employed_in': 'Private Sector', 'annual_income': '₹30 - 35 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Rajesh Sharma', 'father_occupation': 'Retd. Bank Manager', 'mother_name': 'Sunita Sharma', 'mother_occupation': 'Homemaker', 'native_place': 'Jaipur'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Chess, Reading, Gym'},
        'pref': {'min_age': 24, 'max_age': 29, 'min_height': "5' 2\"", 'max_height': "5' 8\"", 'religion': 'Hindu', 'caste': 'Brahmin'}
    },
    {
        'email': 'groom2.test@adarshvivah.com',
        'name': 'Rohan Mehta',
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
        'bio': 'Investment Banker based in Mumbai. Enjoy traveling, fine dining, and playing tennis.',
        'edu': {'degree': 'MBA in Finance', 'institution': 'IIM Ahmedabad', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'Investment Banker', 'company_name': 'HDFC Bank', 'employed_in': 'Private Sector', 'annual_income': '₹35 - 40 Lakhs P.A.'},
        'fam': {'family_type': 'Joint Family', 'family_values': 'Liberal', 'father_name': 'Kirit Mehta', 'father_occupation': 'Business Owner', 'mother_name': 'Bhavna Mehta', 'mother_occupation': 'Homemaker', 'native_place': 'Ahmedabad'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Occasionally', 'smoking': 'Never', 'exercise': 'Occasionally', 'hobbies': 'Tennis, Travel, Stock Market'},
        'pref': {'min_age': 25, 'max_age': 30, 'min_height': "5' 4\"", 'max_height': "5' 10\"", 'religion': 'Hindu'}
    },
    {
        'email': 'groom3.test@adarshvivah.com',
        'name': 'Aditya Verma',
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
        'bio': 'Civil Services Officer (IAS). Dedicated to public service, community development, and literature.',
        'edu': {'degree': 'B.Tech in Civil Engineering', 'institution': 'IIT Kanpur', 'education_level': 'Bachelor / Graduate'},
        'prof': {'occupation': 'Civil Services Officer', 'company_name': 'Government of India', 'employed_in': 'Government / Public Sector', 'annual_income': '₹18 - 22 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Traditional', 'father_name': 'Suresh Verma', 'father_occupation': 'IAS Officer (Retd)', 'mother_name': 'Asha Verma', 'mother_occupation': 'School Principal', 'native_place': 'Lucknow'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Poetry, Badminton, History'},
        'pref': {'min_age': 23, 'max_age': 28, 'min_height': "5' 2\"", 'max_height': "5' 7\"", 'religion': 'Hindu'}
    },
    {
        'email': 'groom4.test@adarshvivah.com',
        'name': 'Kunal Gupta',
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
        'bio': 'Product Manager at Flipkart in Bangalore. Love trekking, photography, and coffee brewing.',
        'edu': {'degree': 'B.E. & MBA', 'institution': 'BITS Pilani / XLRI', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'Senior Product Manager', 'company_name': 'Flipkart', 'employed_in': 'Private Sector', 'annual_income': '₹28 - 32 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Vinod Gupta', 'father_occupation': 'Businessman', 'mother_name': 'Ritu Gupta', 'mother_occupation': 'Homemaker', 'native_place': 'Agra'},
        'life': {'diet': 'Eggetarian', 'drinking': 'Occasionally', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Trekking, Photography, Cooking'},
        'pref': {'min_age': 24, 'max_age': 29, 'min_height': "5' 3\"", 'max_height': "5' 9\"", 'religion': 'Hindu'}
    },
    {
        'email': 'groom5.test@adarshvivah.com',
        'name': 'Rahul Malhotra',
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
        'bio': 'Orthopedic Surgeon practicing at Fortis Hospital. Caring, family-oriented, and loves road trips.',
        'edu': {'degree': 'MBBS, MS Orthopedics', 'institution': 'PGIMER Chandigarh', 'education_level': 'Doctorate / PhD'},
        'prof': {'occupation': 'Orthopedic Surgeon', 'company_name': 'Fortis Hospital', 'employed_in': 'Private Sector', 'annual_income': '₹35 - 40 Lakhs P.A.'},
        'fam': {'family_type': 'Joint Family', 'family_values': 'Traditional', 'father_name': 'Dr. Ashok Malhotra', 'father_occupation': 'Physician', 'mother_name': 'Dr. Anita Malhotra', 'mother_occupation': 'Gynecologist', 'native_place': 'Amritsar'},
        'life': {'diet': 'Non-Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Occasionally', 'hobbies': 'Driving, Swimming, Music'},
        'pref': {'min_age': 25, 'max_age': 31, 'min_height': "5' 2\"", 'max_height': "5' 8\"", 'religion': 'Hindu'}
    },

    # BRIDES (5)
    {
        'email': 'bride1.test@adarshvivah.com',
        'name': 'Ananya Sharma',
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
        'bio': 'Data Scientist at an AI research lab in Mumbai. Balanced individual loving Kathak dance and classical music.',
        'edu': {'degree': 'M.Tech in Data Science', 'institution': 'IIT Bombay', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'Data Scientist', 'company_name': 'TCS Innovation Labs', 'employed_in': 'Private Sector', 'annual_income': '₹22 - 25 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Alok Sharma', 'father_occupation': 'Chartered Accountant', 'mother_name': 'Meena Sharma', 'mother_occupation': 'Teacher', 'native_place': 'Jaipur'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Kathak, Classical Music, Travel'},
        'pref': {'min_age': 28, 'max_age': 33, 'min_height': "5' 8\"", 'max_height': "6' 2\"", 'religion': 'Hindu'}
    },
    {
        'email': 'bride2.test@adarshvivah.com',
        'name': 'Ishita Mehta',
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
        'bio': 'Chartered Accountant working with EY. Art lover, foodie, and avid reader.',
        'edu': {'degree': 'CA, B.Com', 'institution': 'ICAI / St. Xavier\'s', 'education_level': 'Bachelor / Graduate'},
        'prof': {'occupation': 'Chartered Accountant', 'company_name': 'EY', 'employed_in': 'Private Sector', 'annual_income': '₹18 - 22 Lakhs P.A.'},
        'fam': {'family_type': 'Joint Family', 'family_values': 'Liberal', 'father_name': 'Nitin Mehta', 'father_occupation': 'Textile Businessman', 'mother_name': 'Neeta Mehta', 'mother_occupation': 'Homemaker', 'native_place': 'Surat'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Occasionally', 'hobbies': 'Painting, Baking, Reading'},
        'pref': {'min_age': 27, 'max_age': 32, 'min_height': "5' 7\"", 'max_height': "6' 1\"", 'religion': 'Hindu'}
    },
    {
        'email': 'bride3.test@adarshvivah.com',
        'name': 'Priya Verma',
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
        'bio': 'Assistant Professor of Economics at Delhi University. Warm, compassionate, and fond of classical literature.',
        'edu': {'degree': 'Ph.D. in Economics', 'institution': 'Delhi School of Economics', 'education_level': 'Doctorate / PhD'},
        'prof': {'occupation': 'Assistant Professor', 'company_name': 'Delhi University', 'employed_in': 'Government / Public Sector', 'annual_income': '₹15 - 18 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Traditional', 'father_name': 'Raman Verma', 'father_occupation': 'Advocate', 'mother_name': 'Sushma Verma', 'mother_occupation': 'Homemaker', 'native_place': 'Varanasi'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Never', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Debating, Writing, Gardening'},
        'pref': {'min_age': 29, 'max_age': 34, 'min_height': "5' 8\"", 'max_height': "6' 2\"", 'religion': 'Hindu'}
    },
    {
        'email': 'bride4.test@adarshvivah.com',
        'name': 'Kavya Gupta',
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
        'bio': 'Senior UX Designer at Zoho in Bangalore. Creative, energetic, and animal lover.',
        'edu': {'degree': 'B.Des in Interaction Design', 'institution': 'NID Vijayawada', 'education_level': 'Bachelor / Graduate'},
        'prof': {'occupation': 'Senior UX Designer', 'company_name': 'Zoho', 'employed_in': 'Private Sector', 'annual_income': '₹20 - 24 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Pankaj Gupta', 'father_occupation': 'Businessman', 'mother_name': 'Sangeeta Gupta', 'mother_occupation': 'Interior Designer', 'native_place': 'Indore'},
        'life': {'diet': 'Vegetarian', 'drinking': 'Socially', 'smoking': 'Never', 'exercise': 'Occasionally', 'hobbies': 'Digital Art, Pottery, Travel'},
        'pref': {'min_age': 27, 'max_age': 32, 'min_height': "5' 7\"", 'max_height': "6' 0\"", 'religion': 'Hindu'}
    },
    {
        'email': 'bride5.test@adarshvivah.com',
        'name': 'Neha Malhotra',
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
        'bio': 'HR Business Partner at Deloitte in Gurgaon. Outgoing personality who enjoys music festivals and yoga.',
        'edu': {'degree': 'MBA in HR', 'institution': 'MDI Gurgaon', 'education_level': 'Master / Post Graduate'},
        'prof': {'occupation': 'HR Manager', 'company_name': 'Deloitte', 'employed_in': 'Private Sector', 'annual_income': '₹22 - 26 Lakhs P.A.'},
        'fam': {'family_type': 'Nuclear Family', 'family_values': 'Moderate', 'father_name': 'Vikram Malhotra', 'father_occupation': 'Corporate VP (Retd)', 'mother_name': 'Poonam Malhotra', 'mother_occupation': 'School Principal', 'native_place': 'Delhi'},
        'life': {'diet': 'Non-Vegetarian', 'drinking': 'Occasionally', 'smoking': 'Never', 'exercise': 'Daily', 'hobbies': 'Yoga, Event Planning, Music'},
        'pref': {'min_age': 30, 'max_age': 35, 'min_height': "5' 9\"", 'max_height': "6' 3\"", 'religion': 'Hindu'}
    }
]


class Command(BaseCommand):
    help = 'Seeds 10 test matrimonial accounts (5 Grooms, 5 Brides) into MySQL database.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Seeding test matrimonial profiles...'))

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

        self.stdout.write(self.style.SUCCESS(
            f'Successfully processed {len(TEST_DATA)} test profiles ({created_count} created, {updated_count} updated).'
        ))
        self.stdout.write(self.style.SUCCESS('--- TEST CREDENTIALS ---'))
        self.stdout.write(f'Password for all test accounts: {TEST_PASSWORD}')
        self.stdout.write('GROOM ACCOUNTS:')
        for item in TEST_DATA[:5]:
            self.stdout.write(f"  - {item['name']}: {item['email']}")
        self.stdout.write('BRIDE ACCOUNTS:')
        for item in TEST_DATA[5:]:
            self.stdout.write(f"  - {item['name']}: {item['email']}")
