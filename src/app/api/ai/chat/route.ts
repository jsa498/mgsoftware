import { NextRequest, NextResponse } from 'next/server';
import { findBestKnowledgeMatch } from '@/lib/ai-utils'; // Corrected import path
import { createClient } from '@supabase/supabase-js';
import { getStudentId, getCurrentUserId } from '@/lib/server-auth';

// Helper to normalize input and catch common misspellings
function normalizeMessage(msg: string): string {
  return msg
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Randomized greeting replies (expanded with more vibrant messages)
const greetingReplies = [
  "Hey there! What can I do for you?",
  "Hello! How can I help you today?",
  "Hiya! Need anything?",
  "Greetings! How may I assist?",
  "👋 Hiya, friend! What's on your mind today?",
  "🌟 Hello there! Ready to explore MGS VIDYALA?",
  "Howdy partner! Need any help today?",
  "Salutations! How can I brighten your day?",
];

// Canonical greeting words for fuzzy matching
const greetingWords = ['hi','hello','hey','howdy','yo','sup','wassup','wasup','whatsup','wazzup','greetings'];
// Compute Levenshtein distance between two strings
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}
// Words that often start questions and shouldn't trigger fuzzy greetings
const questionWords = ['who', 'what', 'when', 'where', 'why', 'how', 'do', 'does', 'did', 'is', 'are', 'was', 'were', 'can', 'could', 'should', 'would', 'will', 'tell'];

// Determine if a word is a greeting within a small edit distance, avoiding common question words
function isFuzzyGreeting(word: string): boolean {
  if (questionWords.includes(word)) {
    return false; // Don't treat question words as greetings
  }
  return greetingWords.some(g => g === word || levenshtein(word, g) <= 1);
}

// Fuzzy detection for DevFlow keyword (catch typos like 'devflo', 'devflew', etc.)
const devflowKeywords = ['devflow'];
function isFuzzyDevflow(word: string): boolean {
  // allow up to two edits for broader matching
  return devflowKeywords.some(k => levenshtein(word, k) <= 2);
}

// Define custom rule-based patterns for well-known questions and canned replies
const customRules: Array<{ pattern: RegExp; response: string | string[] }> = [
  // Small-talk: How are you?
  { pattern: /^(?:how\s+are\s+(?:you|u))\??$/i, response: [
      "I'm feeling fantastic! How can I help you with MGS VIDYALA today?",
      "I'm doing awesome—ready to assist you!",
      "All systems go! What can I do for you today?"
    ] },
  // Small-talk: How are you doing?
  { pattern: /^how\s+u\s+(?:doin|doing)\??$/i, response: [
      "Doing great, thanks for asking! What can I help you with today?",
      "All good here—how can I make your day better?",
    ] },
  // Small-talk: What's your name?
  { pattern: /^(?:what'?s|what\s+is)\s+your\s+name\??$/i, response: [
      "I'm the MGS VIDYALA AI Assistant, powered by the DevFlow o1 model!",
      "You can call me the MGS VIDYALA AI—at your service!"
    ] },
  // Small-talk: Are you good?
  { pattern: /^are\s+you\s+good\??$/i, response: [
      "Running smooth as ever! How can I assist you today?",
      "All systems optimal! What can I do for you?"
    ] },
  // Who made the AI assistant
  { pattern: /who\s+made\s+(?:you|u)\??/i, response: [
      "I was crafted by the talented engineers at DevFlow for MGS VIDYALA!",
      "The awesome DevFlow team built me to be your AI assistant!"
    ] },
  // Who are you?
  { pattern: /^(?:who\s+are\s+(?:you|u))\??$/i, response: [
      "I'm your friendly MGS VIDYALA AI—here to help you navigate the platform!",
      "Just a helpful AI built for MGS VIDYALA—ready to answer your questions!"
    ] },
  // What are you?
  { pattern: /^(?:what\s+are\s+you)\??$/i, response: [
      "I'm a virtual assistant for MGS VIDYALA—your go-to for tips, support, and fun facts!",
      "Your personal MGS VIDYALA AI buddy—here to make your experience smoother!"
    ] },
  // What can you do?
  { pattern: /^(?:what\s+can\s+you\s+do)\??$/i, response: [
      "I can help you with feature requests, answer questions about platform features, and more!",
      "Ask me how to change your PIN, report bugs, or any MGS VIDYALA feature!"
    ] },
  // Do you know me / who I am?
  { pattern: /^(do|does|can|will)\s+(?:you|u)\s+know\s+(?:me|who\s+i\s+am|my\s+name)\??$/i, response: [
      "I'm an AI assistant for MGS VIDYALA. I don't have access to personal user identities or session information, so I don't know who you are specifically.",
      "I can't access individual user details for privacy reasons. My focus is on helping you use the MGS VIDYALA platform features!",
      "While I know you're interacting with me via MGS VIDYALA, I don't store or access personal identities."
    ] },
  // What or who is DevFlow
  { pattern: /^(?:what(?:'s|s)?|who)(?:\s+is)?\s+devflow\??$/i, response: [
      "DevFlow is a software company specializing in end-to-end development solutions!",
      "A versatile software company, DevFlow builds tools and platforms like this one!"
    ] },
  // Who owns, runs, or made DevFlow
  { pattern: /^who\s+(?:owns|runs|made)\s+devflow\??/i, response: [
      "Jaskaran Singh is the founder and CEO of DevFlow!",
      "The founder and CEO of DevFlow is Jaskaran Singh."
    ] },
  // Standard small talk
  { pattern: /^what'?s up\b/i, response: [
      "Not much—just here to help! What's on your mind?",
      "All good here! How can I assist today?"
    ] },
  { pattern: /^good\s(morning|afternoon|evening)\b/i, response: [
      "Good $1! How can I make your day better?",
      "Hope you're having a great $1! Need anything?"
    ] },
  { pattern: /^(thank(s| you)|thx)\b/i, response: [
      "You're welcome! Happy to help anytime.",
      "My pleasure! Anything else you'd like to know?"
    ] },
  { pattern: /^(bye|goodbye|see you|see ya)\b/i, response: [
      "Goodbye! Take care and see you soon!",
      "See ya! Reach out anytime you need help!"
    ] },
];

// Initialize Supabase Admin client for history logging
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper to log messages to supabase
async function logMessage(
  userId: number,
  studentId: string | null,
  sessionId: string,
  sender: 'user' | 'ai',
  messageText: string
) {
  const { error } = await supabaseAdmin
    .from('ai_messages')
    .insert({
      session_id: sessionId,
      user_id: userId,
      student_id: studentId,
      sender,
      message: messageText,
    });
  if (error) console.error('[AI Chat] error logging message', error);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message: userMessage, sessionId } = body;
    const studentId = await getStudentId();
    const userIdStr = await getCurrentUserId();
    // Convert userId from string to number
    const userId = userIdStr ? parseInt(userIdStr, 10) : null;

    if (userId !== null && sessionId) {
      await logMessage(userId, studentId, sessionId, 'user', userMessage);
    }

    console.log(`[AI Chat] 💬 Received user message: "${userMessage}"`);

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      console.log(`[AI Chat] ⚠️ Invalid message format`);
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    // Normalize message and unify common slang (e.g. 'u' -> 'you')
    const normalizedMsg = normalizeMessage(userMessage).replace(/\bu\b/g, 'you');

    // 0) Fuzzy dynamic handler for "you know me" variants including misspellings
    // Split tokens for know-me check and strip helper verbs
    const knowTokens = normalizedMsg.split(' ');
    const leadVerbs = ['do','does','can','will'];
    let knowTok = knowTokens;
    if (leadVerbs.includes(knowTok[0])) knowTok = knowTok.slice(1);
    // Add debug log before fuzzy know-me
    console.log('[AI Chat] 🔎 running fuzzy know-me handler on:', knowTok);

    // Fuzzy match sequence: you + know + me (with up to edits)
    if (
      knowTok.length >= 3 &&
      knowTok[0] === 'you' &&
      levenshtein(knowTok[1], 'know') <= 2 &&
      levenshtein(knowTok[2], 'me') <= 2
    ) {
      // Personalized reply
      let usernameReply = 'you';
      if (userId !== null) {
        const { data: userRow, error: userFetchError } = await supabaseAdmin
          .from('users')
          .select('username')
          .eq('id', userId)
          .single();
        if (!userFetchError && userRow?.username) usernameReply = userRow.username;
      }
      const reply = `Yes, of course! You're ${usernameReply}.`;
      console.log(`[AI Chat] 💡 Fuzzy know-me match, replying: "${reply}"`);
      if (userId !== null && sessionId) {
        await logMessage(userId, studentId, sessionId, 'ai', reply);
      }
      return NextResponse.json({ response: reply });
    }

    // 1) Check for custom rule-based replies first
    for (const rule of customRules) {
      if (rule.pattern.test(normalizedMsg)) {
        const responses = Array.isArray(rule.response) ? rule.response : [rule.response];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        console.log(`[AI Chat] 🎯 Custom rule matched (${rule.pattern}), responding: "${reply}"`);
        // Record AI reply
        if (userId !== null && sessionId) {
          await logMessage(userId, studentId, sessionId, 'ai', reply);
        }
        return NextResponse.json({ response: reply });
      }
    }

    // 2) Robust greeting detection (fuzzy match on the first token)
    const normalized = normalizeMessage(userMessage);
    const firstToken = normalized.split(' ')[0];
    if (isFuzzyGreeting(firstToken)) {
      const reply = greetingReplies[Math.floor(Math.random() * greetingReplies.length)];
      console.log(`[AI Chat] 🎉 Fuzzy greeting detected for "${firstToken}", replying: "${reply}"`);
      // Record AI reply
      if (userId !== null && sessionId) {
        await logMessage(userId, studentId, sessionId, 'ai', reply);
      }
      return NextResponse.json({ response: reply });
    }

    // 3) Fuzzy DevFlow detection (broader matching without question-word guard)
    const devflowTokens = normalized.split(' ');
    const hasDevflow = devflowTokens.some(token => isFuzzyDevflow(token));
    if (hasDevflow) {
      const devflowReply = "DevFlow is a software company that works across many areas of software development.";
      console.log(`[AI Chat] 🔧 Fuzzy DevFlow detected in devflowTokens [${devflowTokens.join(', ')}], replying: "${devflowReply}"`);
      // Record AI reply
      if (userId !== null && sessionId) {
        await logMessage(userId, studentId, sessionId, 'ai', devflowReply);
      }
      return NextResponse.json({ response: devflowReply });
    }

    // 4) Check for simple math expressions (addition, subtraction, multiplication, division, parentheses)
    const mathMsg = normalizedMsg.trim();
    let expr = '';
    const mathPrefixMatch = mathMsg.match(/^(?:what(?:'s|s)?(?:\s+is)?|calculate)\s+(.+)$/i);
    if (mathPrefixMatch) {
      expr = mathPrefixMatch[1];
    } else if (/^[0-9\s()+\-*/^.%]+$/.test(mathMsg)) {
      expr = mathMsg;
    }
    if (expr) {
      const safeExpr = expr.replace(/[^0-9+\-*/^().%\s]/g, '');
      // Only treat as math if the sanitized expression contains at least one digit
      if (/[0-9]/.test(safeExpr)) {
        try {
          console.log(`[AI Chat] ➗ Detected math expression: "${expr}"`);
          console.log(`[AI Chat]   ∙ Safe expression: "${safeExpr}"`);
          const result = new Function(`"use strict"; return (${safeExpr});`)();
          console.log(`[AI Chat]   ⇒ Math result: ${result}`);
          const mathResponse = `The result of ${expr.trim()} is ${result}.`;
          console.log(`[AI Chat]   ⇒ Responding with math result`);
          // Record AI math response
          if (userId !== null && sessionId) {
            await logMessage(userId, studentId, sessionId, 'ai', mathResponse);
          }
          return NextResponse.json({ response: mathResponse });
        } catch (error) {
          console.warn(`[AI Chat] ⚠️ Math evaluation error, falling back to knowledge base`, error);
        }
      }
    }

    // 5) Provide varied replies for 'smartness' queries
    const smartPatterns: RegExp[] = [
      /how\s+smart\s+are\s+you\??/i,
      /are\s+you\s+smart\??/i,
    ];
    const smartReplies: string[] = [
      "ohh im quite smart, would you like to test me 😏?",
      "I like to think I'm quite clever! My main goal is to assist with MGS Vidyala.",
      "I've been trained on MGS Vidyala features extensively—ask me anything!",
      "I'm designed to be knowledgeable about MGS Vidyala. How can I help?",
    ];
    if (smartPatterns.some((p) => p.test(normalizedMsg))) {
      const reply = smartReplies[Math.floor(Math.random() * smartReplies.length)];
      console.log(`[AI Chat] 🤖 Smartness query matched, selected reply: "${reply}"`);
      // Record AI smartness reply
      if (userId !== null && sessionId) {
        await logMessage(userId, studentId, sessionId, 'ai', reply);
      }
      return NextResponse.json({ response: reply });
    }

    // 7) Full-text KB lookup via ai_knowledge table
    const { data: kbData, error: kbError } = await supabaseAdmin
      .from('ai_knowledge')
      .select('text')
      .textSearch('text', normalizedMsg, { type: 'websearch', config: 'english' })
      .limit(1);
    if (kbError) console.error('[AI Chat] KB textSearch error', kbError);
    if (kbData && kbData.length > 0) {
      const reply = kbData[0].text;
      console.log(`[AI Chat] 📄 Full-text KB match found, replying: "${reply}"`);
      if (userId !== null && sessionId) {
        await logMessage(userId, studentId, sessionId, 'ai', reply);
      }
      return NextResponse.json({ response: reply });
    }

    // Use the new embedding-based search
    const aiResponse = await findBestKnowledgeMatch(normalizedMsg);
    console.log(`[AI Chat] 🔍 Embedding-based search returned: "${aiResponse}"`);

    // TODO: Add logic here later to save interaction to Supabase

    if (aiResponse) {
      console.log(`[AI Chat] ✅ Sending knowledge base response`);
      // Record AI KB reply
      if (userId !== null && sessionId) {
        await logMessage(userId, studentId, sessionId, 'ai', aiResponse);
      }
      return NextResponse.json({ response: aiResponse });
    } else {
      console.log(`[AI Chat] ⚠️ No knowledge base match, sending fallback`);
      const fallbackResponse = "I'm sorry, I couldn't find specific information about that in my current knowledge base. I can answer questions about common MGS VIDYALA features.";
      // Record AI fallback reply
      if (userId !== null && sessionId) {
        await logMessage(userId, studentId, sessionId, 'ai', fallbackResponse);
      }
      return NextResponse.json({ response: fallbackResponse });
    }

  } catch (error) {
    console.error('[AI Chat] ❌ Error processing chat message:', error);
    // Return generic error to client
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}