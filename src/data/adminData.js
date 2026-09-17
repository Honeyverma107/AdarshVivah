export const MOCK_ADMIN_STATS = {
  totalRegisteredUsers: 14850,
  pendingApprovals: 42,
  verifiedProfiles: 12400,
  reportedProfiles: 7,
  activeMatches: 3120,
  thisMonthGrowth: "+14.8%"
};

export const MOCK_PENDING_PROFILES = [
  {
    id: "adm-201",
    name: "Dr. Alok Nath",
    gender: "Male",
    age: 32,
    city: "Lucknow",
    profession: "Senior Consultant Surgeon",
    verificationRequested: "Identity & Medical License",
    submittedDate: "16 Sep 2026",
    status: "Pending",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    docsSubmitted: ["Aadhaar Card", "Medical Degree Certificate"]
  },
  {
    id: "adm-202",
    name: "Sanjana Saxena",
    gender: "Female",
    age: 26,
    city: "Noida, UP",
    profession: "UX Designer",
    verificationRequested: "Identity & Photo",
    submittedDate: "15 Sep 2026",
    status: "Pending",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    docsSubmitted: ["Passport", "Work ID"]
  },
  {
    id: "adm-203",
    name: "Varun Kapoor",
    gender: "Male",
    age: 28,
    city: "Gurgaon",
    profession: "FinTech Product Lead",
    verificationRequested: "Full Verification",
    submittedDate: "15 Sep 2026",
    status: "Pending",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    docsSubmitted: ["Aadhaar Card", "Salary Slip"]
  },
  {
    id: "adm-204",
    name: "Ritika Sen",
    gender: "Female",
    age: 27,
    city: "Kolkata",
    profession: "Assistant Professor",
    verificationRequested: "Photo Verification",
    submittedDate: "14 Sep 2026",
    status: "Pending",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    docsSubmitted: ["College ID Card"]
  }
];

export const MOCK_REPORTED_PROFILES = [
  {
    id: "rep-301",
    profileName: "Siddharth S. (Flagged)",
    reportedBy: "Ananya Sharma",
    reason: "Inaccurate Education Info",
    details: "User claims degree from IIT, but credentials document appears altered.",
    reportDate: "13 Sep 2026",
    status: "Under Review"
  },
  {
    id: "rep-302",
    profileName: "Rakesh K. (Flagged)",
    reportedBy: "Meera R.",
    reason: "Commercial Promotion",
    details: "Sent promotional insurance messages in profile introduction.",
    reportDate: "11 Sep 2026",
    status: "Under Review"
  }
];
