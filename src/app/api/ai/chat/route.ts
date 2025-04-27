import { NextRequest, NextResponse } from 'next/server';
import { findBestKnowledgeMatch } from '@/lib/ai-utils'; // Corrected import path

// The old rule-based getResponse function is no longer needed and can be removed.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    // Use the new embedding-based search
    const aiResponse = await findBestKnowledgeMatch(userMessage);

    // TODO: Add logic here later to save interaction to Supabase

    if (aiResponse) {
        // Found a relevant answer in the knowledge base
        return NextResponse.json({ response: aiResponse });
    } else {
        // No good match found, provide a fallback response
        const fallbackResponse = "I'm sorry, I couldn't find specific information about that in my current knowledge base. I can answer questions about common MGS VIDYALA features.";
        return NextResponse.json({ response: fallbackResponse });
    }

  } catch (error) {
    console.error("Error processing chat message:", error);
    // Don't expose detailed errors to the client
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 