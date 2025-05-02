-- Create ai_knowledge table
CREATE TABLE IF NOT EXISTS public.ai_knowledge (
  id text PRIMARY KEY,
  text text NOT NULL
);

-- Create GIN index for full-text search on the text column
drop index if exists idx_ai_knowledge_text_fts;
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_text_fts
  ON public.ai_knowledge
  USING gin(to_tsvector('english', text));

-- Seed initial knowledge-base entries
INSERT INTO public.ai_knowledge (id, text) VALUES
('pin-change-how', $$To change your PIN, go to the 'Requests' page and submit a 'PIN Change Request'. Admins will review and approve it.$$),
('pin-change-why', $$It's a good security practice to change your PIN periodically, perhaps every few months. This helps keep your account secure.$$),
('report-bug-how', $$Found a glitch? Go to the 'Requests' page and create a 'New Request', selecting 'Bug Report' as the type. Describe the issue in detail!$$),
('feature-request-how', $$Have an idea for MGS VIDYALA? Submit it via the 'Requests' page. Click 'New Request' and choose 'Feature Request'. We appreciate your feedback!$$),
('practice-sessions', $$MGS VIDYALA allows students to log their practice sessions. You can find practice tools and materials under the 'Practice' section.$$),
('practice-materials', $$Admins can upload practice materials (like sheet music or audio files) in the 'Practice -> Upload' section. Students can access these materials in 'Practice -> Media'.$$),
('quizzes', $$Students can take quizzes assigned to them under 'Practice -> Quizzes'. Admins can create new quizzes in 'Practice -> Quiz'.$$),
('leaderboard', $$Check out the 'Leaderboard' to see rankings based on practice time and other metrics. It's a fun way to see how everyone is progressing!$$),
('attendance', $$Admins can track student attendance for different groups using the 'Attendance' feature.$$),
('groups', $$MGS VIDYALA uses groups to organize students. Admins can manage groups, and messages can be sent within groups.$$),
('messaging', $$You can send and receive messages within your assigned groups via the 'Messages' section.$$),
('profile-management', $$You can update your profile information and profile picture by navigating to the 'Profile' page.$$),
('dashboard-info', $$The dashboard provides a quick overview of your recent activity, stats, messages, and requests.$$),
('ai-purpose', $$I'm here to help answer your questions about using the MGS VIDYALA platform! Think of me as a helpful guide.$$),
('ai-capabilities-summary', $$I can tell you how to use MGS VIDYALA features like changing your PIN, reporting bugs, finding practice materials, taking quizzes, checking messages, and more. Just ask!$$),
('ai-limitations', $$While I know a lot, I am trained to help you with MGS VIDYALA, I can help you with other things as well, but please be respectful of how you use me 😊.$$),
('ai-knowledge-source', $$Creating and training an AI like me is indeed a complex process! My knowledge comes from the data and information provided by my creators at DevFlow.$$),
('ai-creator', $$I am an AI assistant developed by DevFlow for the MGS VIDYALA platform.$$),
('greeting-generic', $$Hello there! How can I help you with MGS VIDYALA today?$$),
('well-being-ai', $$I'm your friendly AI assistant, running perfectly and ready to assist you! How can I help?$$),
('well-being-user-inquiry', $$Thanks for asking! I'm doing great. How about you? Is there anything specific I can help you with regarding MGS VIDYALA?$$),
('user-needs-help', $$Okay, I'm ready to help. What do you need assistance with on the MGS VIDYALA platform?$$),
('positive-feedback-response', $$That's great to hear! I'm glad I could help.$$),
('negative-feedback-response', $$I'm sorry to hear that I wasn't helpful. Could you please rephrase your question or provide more details so I can try again?$$),
('capability-unsure', $$I'm not sure if I can help with that specific request. My expertise is mainly around the features and usage of the MGS VIDYALA platform itself.$$),
('ask-for-clarification', $$Could you please provide a bit more detail or rephrase your question? I want to make sure I understand.$$)
ON CONFLICT (id) DO NOTHING;
