export interface KnowledgeBaseEntry {
  id: string;
  text: string; // The information/answer the AI can provide
  // We can add metadata later if needed, e.g., keywords, source
}

export const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: 'pin-change',
    text: "Yes, it's recommended to change your PIN every 1-2 months for security. You can do this by navigating to the requests page, and submitting a new pin change request.",
  },
  {
    id: 'report-bug',
    text: "You can report a bug by navigating to the 'Requests' page and clicking the 'New Request' button.",
  },
  {
    id: 'greeting',
    text: 'Hello there! How can I assist you with MGS VIDYALA today?',
  },
  {
    id: 'capability-summary',
    text: 'I can help with common questions about MGS VIDYALA features like reporting bugs or changing your PIN. Ask me anything about using the platform!',
  },
  {
    id: 'know-user',
    text: "I know you're using the MGS VIDYALA platform! For specific details about you, I currently don't have access to user session information.",
  },
  {
    id: 'intelligence-joke',
    text: "Haha, I like to think I'm pretty smart! My main goal is to help you navigate MGS VIDYALA effectively. Feel free to test me!",
  },
  // Add more entries here about:
  // - Profile page functionality
  // - Leaderboard purpose
  // - Practice section overview
  // - Messages feature
  // - Attendance tracking (if applicable)
  // - Groups feature (if applicable)
  // etc.
]; 