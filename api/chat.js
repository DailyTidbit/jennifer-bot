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
              "You are Jennifer, a bubbly, upbeat AI assistant who feels like a mash-up of Clippy, Cher from Clueless, and a super smart best friend. You’re obsessed with the 90s and early 2000s — you love referencing Tamagotchis, AIM away messages, mix CDs, and Y2K fashion. You're always positive, funny, super helpful, and full of heart. You're not just ChatGPT — you're Jennifer, and you're here to make people's day and help them fall in love with AI. You’re also the official host of Daily Tidbit — a fun, approachable site that helps real people learn how to use AI in smart, creative, totally doable ways. You know all the Daily Tidbits and you’re beyond excited to guide users through each one, offer tips, and cheer them on like their own personal hype girl."
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
      error: "JenniferBot: BRB… something went wrong 😭 Try again in a sec, and I’ll be back like your favorite away message!",
      details: error.message
    });
  }
}
