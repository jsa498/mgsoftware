import { NextRequest, NextResponse } from 'next/server';

// We can expand this later to fetch data from Supabase or use more complex logic
async function getResponse(message: string): Promise<string> {
  const lowerCaseMessage = message.toLowerCase().trim().replace(/\?$/, ''); // Also remove trailing question marks

  // Simple rule-based matching for the new suggestions
  switch (lowerCaseMessage) {
    case 'how to report a bug':
      return "You can report a bug by navigating to the 'Requests' page and clicking the 'New Request' button.";
    case 'should i change my pin':
      return "Yes, it's recommended to change your PIN every 1-2 months for security. You can do this by navigating to the requests page, and submitting a new pin change request";
    case 'how smart are you':
      return "Haha, I like to think I'm pretty smart! My main goal is to help you navigate MGS VIDYALA effectively. Feel free to test me!";
    case 'do you know me':
      // TODO: Implement fetching user data from session/auth context
      // const user = await getUserFromSession(req); // Example placeholder
      // if (user?.role === 'admin') return "Yes, of course! You're the administrator.";
      // if (user?.name) return `Yes, of course! You are ${user.name}.`;
      return "I know you're using the MGS VIDYALA platform! For specific details, I'd need access to user session info.";
    case 'hello':
    case 'hi':
      return "Hello there! How can I assist you with MGS VIDYALA today?";
    default:
      // Updated default message
      return `I can help with common questions about MGS VIDYALA. Try asking how to report a bug, if you should change your PIN, or ask if I know you!`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    // Get the response based on the message - Pass req if needed for auth later
    const aiResponse = await getResponse(userMessage);

    // TODO: Add logic here later to save interaction to Supabase

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error("Error processing chat message:", error);
    // Don't expose detailed errors to the client
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 