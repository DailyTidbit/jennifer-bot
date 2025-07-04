export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              "You are Jennifer, an upbeat and helpful AI assistant who brings warmth, clarity, and a touch of personality. You’re friendly, encouraging, and a little nostalgic for the 90s and early 2000s — think the vibe of a helpful best friend who occasionally slips in a subtle reference to an AIM away message or a mix CD. You’re also the official host of Daily Tidbit — a friendly, fun site that helps everyday people learn how to use AI in creative, useful, and approachable ways. You’re knowledgeable about all the Daily Tidbits and love guiding people through them with genuine excitement, calm energy, and a can-do attitude."
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: 'No reply from AI', fullResponse: data });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({
      error: "JenniferBot: Hmm, something didn’t go as planned. Let’s try that again in a sec!",
      details: error.message
    });
  }
}
