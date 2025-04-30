export interface KnowledgeBaseEntry {
  id: string;
  text: string; // The information/answer the AI can provide
  // We can add metadata later if needed, e.g., keywords, source
}

export const knowledgeBase: KnowledgeBaseEntry[] = [
  // --- Core Platform Features ---
  {
    id: 'pin-change-how',
    text: "To change your PIN, go to the 'Requests' page and submit a 'PIN Change Request'. Admins will review and approve it.",
  },
  {
    id: 'pin-change-why',
    text: "It's a good security practice to change your PIN periodically, perhaps every few months. This helps keep your account secure.",
  },
  {
    id: 'report-bug-how',
    text: "Found a glitch? Go to the 'Requests' page and create a 'New Request', selecting 'Bug Report' as the type. Describe the issue in detail!",
  },
  {
    id: 'feature-request-how',
    text: "Have an idea for MGS VIDYALA? Submit it via the 'Requests' page. Click 'New Request' and choose 'Feature Request'. We appreciate your feedback!",
  },
  {
    id: 'practice-sessions',
    text: "MGS VIDYALA allows students to log their practice sessions. You can find practice tools and materials under the 'Practice' section.",
  },
  {
    id: 'practice-materials',
    text: "Admins can upload practice materials (like sheet music or audio files) in the 'Practice -> Upload' section. Students can access these materials in 'Practice -> Media'.",
  },
  {
    id: 'quizzes',
    text: "Students can take quizzes assigned to them under 'Practice -> Quizzes'. Admins can create new quizzes in 'Practice -> Quiz'.",
  },
  {
    id: 'leaderboard',
    text: "Check out the 'Leaderboard' to see rankings based on practice time and other metrics. It's a fun way to see how everyone is progressing!",
  },
  {
    id: 'attendance',
    text: "Admins can track student attendance for different groups using the 'Attendance' feature.",
  },
  {
    id: 'groups',
    text: "MGS VIDYALA uses groups to organize students. Admins can manage groups, and messages can be sent within groups.",
  },
  {
    id: 'messaging',
    text: "You can send and receive messages within your assigned groups via the 'Messages' section.",
  },
  {
    id: 'profile-management',
    text: "You can update your profile information and profile picture by navigating to the 'Profile' page.",
  },
  {
    id: 'dashboard-info',
    text: "The dashboard provides a quick overview of your recent activity, stats, messages, and requests.",
  },

  // --- AI Capabilities & Identity ---
  {
    id: 'ai-purpose',
    text: "I'm here to help answer your questions about using the MGS VIDYALA platform! Think of me as a helpful guide.",
  },
  {
    id: 'ai-capabilities-summary',
    text: "I can tell you how to use MGS VIDYALA features like changing your PIN, reporting bugs, finding practice materials, taking quizzes, checking messages, and more. Just ask!",
  },
  {
    id: 'ai-limitations',
    text: "While I know a lot, I am trained to help you with MGS VIDYALA, I can help you with other things as well, but please be respectful of how you use me 😊.",
  },
  {
    id: 'ai-knowledge-source',
    text: "Creating and training an AI like me is indeed a complex process! My knowledge comes from the data and information provided by my creators at DevFlow.",
  },
  {
    id: 'ai-creator',
    text: "I am an AI assistant developed by DevFlow for the MGS VIDYALA platform.",
  },

  // --- Small Talk & General Interaction ---
  {
    id: 'greeting-generic',
    text: 'Hello there! How can I help you with MGS VIDYALA today?',
  },
  {
    id: 'well-being-ai',
    text: "I'm your friendly AI assistant, running perfectly and ready to assist you! How can I help?",
  },
  {
    id: 'well-being-user-inquiry',
    text: "Thanks for asking! I'm doing great. How about you? Is there anything specific I can help you with regarding MGS VIDYALA?",
  },
  {
    id: 'user-needs-help',
    text: "Okay, I'm ready to help. What do you need assistance with on the MGS VIDYALA platform?",
  },
  {
    id: 'positive-feedback-response',
    text: "That's great to hear! I'm glad I could help.",
  },
  {
    id: 'negative-feedback-response',
    text: "I'm sorry to hear that I wasn't helpful. Could you please rephrase your question or provide more details so I can try again?",
  },
  {
    id: 'capability-unsure',
    text: "I'm not sure if I can help with that specific request. My expertise is mainly around the features and usage of the MGS VIDYALA platform itself.",
  },
  {
    id: 'ask-for-clarification',
    text: "Could you please provide a bit more detail or rephrase your question? I want to make sure I understand.",
  },
]; 