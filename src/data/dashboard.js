export const MOCK_DASHBOARD_STATS = {
  profileViews: 142,
  interestsReceived: 12,
  interestsSent: 8,
  shortlistedByOthers: 34,
  matchScoreAverage: 91
};

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: "act-1",
    type: "interest_received",
    title: "New Interest Received",
    description: "Ananya Sharma (Software Engineer, IIT Bombay) sent you an interest.",
    time: "2 hours ago",
    unread: true
  },
  {
    id: "act-2",
    type: "view",
    title: "Profile Viewed",
    description: "A verified profile from Delhi NCR viewed your details.",
    time: "5 hours ago",
    unread: true
  },
  {
    id: "act-3",
    type: "interest_accepted",
    title: "Interest Accepted",
    description: "Kabir Gill accepted your interest request. Contact info unlocked!",
    time: "1 day ago",
    unread: false
  },
  {
    id: "act-4",
    type: "recommendation",
    title: "New Smart Match",
    description: "Priya Iyer matches 96% of your partner preferences.",
    time: "2 days ago",
    unread: false
  }
];
