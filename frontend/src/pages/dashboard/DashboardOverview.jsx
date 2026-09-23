import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  UserPlus,
  User,
  Users
} from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import StatCard from '../../components/StatCard';
import ProfileCard from '../../components/ProfileCard';
import Button from '../../components/Button';
import dashboardApi from '../../api/dashboardApi';
import profileApi from '../../api/profileApi';
import { useAuth } from '../../context/AuthContext';

export const DashboardOverview = () => {
  const context = useOutletContext();
  const { user } = useAuth();

  const [hasProfile, setHasProfile] = useState(false);
  const [stats, setStats] = useState({
    hasProfile: false,
    profileViews: 0,
    interestsReceived: 0,
    interestsSent: 0,
    myShortlist: 0,
    acceptedConnections: 0,
    unreadMessages: 0,
    recentActivities: []
  });

  const [recommendedProfiles, setRecommendedProfiles] = useState([]);

  useEffect(() => {
    dashboardApi.getDashboardStats()
      .then((res) => {
        setStats(res.data);
        if (res.data.hasProfile !== undefined) {
          setHasProfile(Boolean(res.data.hasProfile));
        }
      })
      .catch((err) => console.error('Error fetching dashboard stats:', err));

    profileApi.getMe()
      .then(() => setHasProfile(true))
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setHasProfile(false);
          setStats(prev => ({ ...prev, hasProfile: false }));
        }
      });

    profileApi.getProfiles()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setRecommendedProfiles(data.slice(0, 3));
      })
      .catch((err) => console.error('Error fetching dashboard recommendations:', err));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <DashboardHeader 
        title={`Welcome back, ${user?.first_name || user?.name || user?.email?.split('@')[0] || 'Member'}!`} 
        subtitle="Here is your active matchmaking summary for this week."
      />

      {/* NEW USER ONBOARDING BANNER (If Profile does not exist) */}
      {!hasProfile && (
        <div className="bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-900 text-white p-6 md:p-8 rounded-3xl border-2 border-gold-400 shadow-xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 bg-dark-900/40 px-3 py-1 rounded-full border border-gold-400/30 inline-block">
              Account Created • Next Step Required
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">Welcome to AdarshVivah</h2>
            <p className="text-xs md:text-sm text-rose-100 leading-relaxed font-normal">
              Your account is ready. Complete your matrimonial profile to start discovering meaningful matches and receive proposals from compatible families.
            </p>
          </div>
          <div className="pt-2 relative z-10">
            <Link to="/create-profile">
              <Button variant="gold" size="lg" icon={Sparkles}>
                Complete Your Profile
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/dashboard/shortlisted">
          <StatCard
            title="My Shortlist"
            value={stats?.myShortlist || 0}
            change="Saved profiles"
            icon={Heart}
            color="maroon"
          />
        </Link>
        <Link to="/dashboard/received-interests">
          <StatCard
            title="Interests Received"
            value={stats?.interestsReceived || 0}
            change={`${stats?.interestsReceived || 0} total`}
            icon={Inbox}
            color="gold"
          />
        </Link>
        <Link to="/dashboard/sent-interests">
          <StatCard
            title="Interests Sent"
            value={stats?.interestsSent || 0}
            change={`${stats?.acceptedConnections || 0} Accepted`}
            icon={Send}
            color="maroon"
          />
        </Link>
        <div>
          <StatCard
            title="Profile Views"
            value={stats?.profileViews || 0}
            change="Real-time views"
            icon={Eye}
            color="sky"
          />
        </div>
      </div>

      {/* Main Grid: Profile Completion & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Overview Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-rose-50 via-white to-amber-50/30 rounded-2xl border border-rose-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold text-maroon-700 uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-rose-200">
              Matrimonial Profile Status
            </span>
            <h3 className="text-xl font-serif font-bold text-dark-800 mt-3">
              {hasProfile ? 'Your Matrimonial Profile is Active' : 'Profile Not Created'}
            </h3>
            <p className="text-xs text-muted-500 mt-1 leading-relaxed">
              {hasProfile 
                ? 'Your profile details are visible to eligible candidates and verified families across the community.'
                : 'Create your matrimonial profile to start receiving interest requests and discovering compatible matches.'}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to={hasProfile ? '/dashboard/edit-profile' : '/create-profile'}
              className="inline-flex items-center justify-center py-2.5 px-5 text-xs font-semibold text-white bg-maroon-600 hover:bg-maroon-700 rounded-xl transition-all shadow-sm gap-2"
            >
              <User className="w-4 h-4" />
              {hasProfile ? 'Manage My Profile' : 'Create Profile Now'}
            </Link>
          </div>
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
            {!hasProfile ? (
              <Link to="/create-profile" className="block">
                <Button variant="gold" size="md" fullWidth icon={UserPlus}>
                  Complete Your Profile Now
                </Button>
              </Link>
            ) : (
              <Button
                variant="gold"
                size="md"
                fullWidth
                icon={FileText}
                onClick={() => context?.openBiodataModal && context.openBiodataModal()}
              >
                Generate Matrimonial Biodata PDF
              </Button>
            )}

            <Link to="/dashboard/received-interests" className="block">
              <Button variant="secondary" size="md" fullWidth icon={Inbox}>
                Review Pending Proposals ({stats?.interestsReceived || 0})
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
          {stats?.recentActivities && stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((act) => (
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
            ))
          ) : (
            <div className="text-xs text-muted-500 py-3 text-center italic">
              No recent notifications or activities yet.
            </div>
          )}
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
            <p className="text-xs text-muted-500">Based on your educational background and family preferences</p>
          </div>
          {hasProfile && (
            <Link to="/dashboard/recommended" className="text-xs font-semibold text-maroon-700 hover:underline flex items-center gap-1">
              View All Matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {!hasProfile ? (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 bg-rose-50 text-maroon-600 rounded-full flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="font-serif font-bold text-lg text-dark-800">
                Complete your profile to discover compatible matches.
              </h4>
              <p className="text-xs text-muted-500">
                Matches are generated dynamically based on your community, education, family background, and partner preferences.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/create-profile">
                <Button variant="gold" size="md" icon={UserPlus}>
                  Complete My Profile
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedProfiles && recommendedProfiles.length > 0 ? (
              recommendedProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-xs text-muted-500 italic bg-white rounded-2xl border border-rose-100">
                No recommended matches found matching your preferences yet.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
export default DashboardOverview;
