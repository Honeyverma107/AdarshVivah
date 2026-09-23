from django.urls import path
from .views import (
    CreateInterestView,
    SentInterestsView,
    ReceivedInterestsView,
    InterestStatusView,
    AcceptInterestView,
    RejectInterestView,
    CancelInterestView,
    ConversationListView, 
    MessageListView, 
    MarkReadView, 
    CallListView, 
    StartCallView, 
    UpdateCallStatusView, 
    ContactsListView
)

urlpatterns = [
    # Interest / Invitation Endpoints
    path('interests/', CreateInterestView.as_view(), name='create_interest'),
    path('interests/sent/', SentInterestsView.as_view(), name='sent_interests'),
    path('interests/received/', ReceivedInterestsView.as_view(), name='received_interests'),
    path('interests/status/', InterestStatusView.as_view(), name='interest_status'),
    path('interests/<int:interest_id>/accept/', AcceptInterestView.as_view(), name='accept_interest'),
    path('interests/<int:interest_id>/reject/', RejectInterestView.as_view(), name='reject_interest'),
    path('interests/<int:interest_id>/cancel/', CancelInterestView.as_view(), name='cancel_interest'),

    # Chat & Voice Call Endpoints
    path('conversations/', ConversationListView.as_view(), name='conversation_list'),
    path('conversations/<int:conversation_id>/messages/', MessageListView.as_view(), name='message_list'),
    path('conversations/<int:conversation_id>/read/', MarkReadView.as_view(), name='mark_read'),
    path('calls/', CallListView.as_view(), name='call_list'),
    path('calls/start/', StartCallView.as_view(), name='start_call'),
    path('calls/<int:call_id>/update_status/', UpdateCallStatusView.as_view(), name='update_call_status'),
    path('contacts/', ContactsListView.as_view(), name='contacts_list'),
]
