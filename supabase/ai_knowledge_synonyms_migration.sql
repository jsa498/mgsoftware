-- Migration: add synonyms column and values to ai_knowledge

-- Add a new column for storing alternate triggers
ALTER TABLE public.ai_knowledge
  ADD COLUMN IF NOT EXISTS synonyms text;

-- Populate synonyms for the 'know-my-name-how' entry
UPDATE public.ai_knowledge
SET synonyms = 'know my name;you know me;how do you know my name'
WHERE id = 'know-my-name-how';

-- Populate synonyms for the 'practice-more-advice' entry
UPDATE public.ai_knowledge
SET synonyms = 'should i practice more;practice more;should practice;how much should i practice;do i practice more;practice or not;should i practice or not'
WHERE id = 'practice-more-advice'; 