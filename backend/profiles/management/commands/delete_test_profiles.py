"""
Management command to safely delete ONLY test matrimonial accounts
Usage: python manage.py delete_test_profiles
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Safely deletes test matrimonial accounts created by seed_test_profiles.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Searching for test accounts to clean up...'))

        # Only target test accounts matching .test@adarshvivah.com or .test@adarshvivah.local
        test_users = User.objects.filter(email__icontains='.test@adarshvivah.')
        count = test_users.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS('No test accounts found to delete.'))
            return

        emails = list(test_users.values_list('email', flat=True))
        test_users.delete()

        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} test accounts:'))
        for email in emails:
            self.stdout.write(f'  - {email}')
