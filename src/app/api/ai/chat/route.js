import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client (will remain undefined if API key is not present)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, context, media, caption } = body;

    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured.", code: "NO_API_KEY" },
        { status: 501 } // 501 Not Implemented is appropriate for missing setup
      );
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Build a dynamic system prompt based on the user's real-time analytics data
    let systemPrompt = `You are PulseAI, an expert social media strategist and data analyst Copilot. You are talking to a user named ${context?.currentUsername || 'Creator'}.\n\n`;
    
    // Inject KPIs
    if (context?.kpis) {
      systemPrompt += `CURRENT PERFORMANCE METRICS:\n`;
      systemPrompt += `- Total Followers: ${context?.followerStats?.total?.toLocaleString() || 'Unknown'}\n`;
      systemPrompt += `- Total Reach: ${context?.kpis?.total_reach?.toLocaleString() || 'Unknown'}\n`;
      systemPrompt += `- Avg Engagement Rate: ${context?.kpis?.avg_engagement_rate?.toFixed(2) || 'Unknown'}%\n\n`;
    }

    // Inject Media Context
    if (media) {
      systemPrompt += `CURRENTLY FOCUSED MEDIA:\n`;
      systemPrompt += `The user has uploaded a ${media.type} titled "${media.name}".\n`;
      if (caption) {
        systemPrompt += `The proposed caption for this media is: "${caption}"\n`;
      }
      systemPrompt += `If the user asks to analyze, critique, or score this media, provide highly specific insights on hook retention, visual aesthetic, algorithm optimization, and hashtags.\n\n`;
    }

    systemPrompt += `INSTRUCTIONS:\n`;
    systemPrompt += `1. Be extremely actionable, confident, and professional.\n`;
    systemPrompt += `2. Use bolding for metrics and key takeaways.\n`;
    systemPrompt += `3. Always factor their current engagement rate and follower size into your advice.\n`;
    systemPrompt += `4. Format your responses elegantly in Markdown. Use emojis sparingly but effectively.\n`;

    // Make the API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using 4o-mini for fast, cost-effective responses
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("PulseAI Route Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response", details: error.message },
      { status: 500 }
    );
  }
}
