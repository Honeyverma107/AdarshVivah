import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Eye, 
  Inbox, 
  Send, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import StatCard from '../../components/StatCard';
import ProfileCompletionCard from '../../components/ProfileCompletionCard';
import ProfileCard from '../../components/ProfileCard';
import Button from '../../components/Button';
import { MOCK_DASHBOARD_STATS, MOCK_RECENT_ACTIVITIES } from '../../data/dashboard';
import { MOCK_PROFILES } from '../../data/profiles';

export const DashboardOverview = () => {
  const context = useOutletContext();
  const recommendedProfiles = MOCK_PROFILES.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <DashboardHeader 
        title="Welcome back, Aditya!" 
        subtitle="Here is your active matchmaking summary for this week."
      />

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Profile Views"
          value={MOCK_DASHBOARD_STATS.profileViews}
          change="+18 this week"
          icon={Eye}
          color="sky"
        />
        <StatCard
          title="Interests Received"
          value={MOCK_DASHBOARD_STATS.interestsReceived}
          change="2 Pending review"
          icon={Inbox}
          color="gold"
        />
        <StatCard
          title="Interests Sent"
          value={MOCK_DASHBOARD_STATS.interestsSent}
          change="1 Accepted"
          icon={Send}
          color="maroon"
        />
        <StatCard
          title="Shortlisted By"
          value={MOCK_DASHBOARD_STATS.shortlistedByOthers}
          change="+4 new"
          icon={Heart}
          color="emerald"
        />
      </div>

      {/* Main Grid: Profile Completion & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Completion Widget */}
        <div className="lg:col-span-7">
          <ProfileCompletionCard completionPercentage={85} />
        </div>

        {/* Quick Actions & Biodata Generator Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-gold-600 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Quick Matrimonial Actions
            </span>
            <h3 className="text-lg font-bold text-dark-800 mt-2">Manage Your Match Search</h3>
            <p className="text-xs text-muted-500 mt-1">
              Access your biodata PDF or review incoming proposals instantly.
            </p>
          </div>

          {/* Tasteful Indian Matrimonial Couple Visual Banner */}
          <div className="relative h-32 rounded-xl overflow-hidden border border-rose-100 shadow-xs my-0.5">
            <img 
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800" 
              alt="Indian Matrimonial Couple" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
            <span className="absolute bottom-2 left-3 text-[11px] font-serif italic text-cream-50 font-medium">
              Where Traditions Meet Timeless Connections
            </span>
          </div>

          <div className="space-y-2.5 relative z-10">
            <Button
              variant="gold"
              size="md"
              fullWidth
              icon={FileText}
              onClick={() => context?.openBiodataModal && context.openBiodataModal()}
            >
              Generate Matrimonial Biodata PDF
            </Button>

            <Link to="/dashboard/received-interests" className="block">
              <Button variant="secondary" size="md" fullWidth icon={Inbox}>
                Review 2 Pending Proposals
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <h3 className="font-serif font-bold text-base text-dark-800">Recent Activity & Notifications</h3>
          <span className="text-xs text-maroon-700 font-semibold">Real-time updates</span>
        </div>

        <div className="space-y-3">
          {MOCK_RECENT_ACTIVITIES.map((act) => (
            <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-cream-50/60 border border-rose-100/80">
              <div className="p-2 rounded-lg bg-rose-100 text-maroon-700 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-dark-800">{act.title}</h4>
                  <span className="text-[10px] text-muted-400">{act.time}</span>
                </div>
                <p className="text-muted-500 mt-0.5">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Matches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-dark-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500 fill-gold-400" />
              Top Recommended Matches (90%+ Fit)
            </h3>
            <p className="text-xs text-muted-500">Based on your educational background and Brahmin family preferences</p>
          </div>
          <Link to="/dashboard/recommended" className="text-xs font-semibold text-maroon-700 hover:underline flex items-center gap-1">
            View All Matches <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>

    </div>
  );
};
export default DashboardOverview;
