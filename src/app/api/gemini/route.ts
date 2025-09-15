import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

function extractArrayFromText(text: string, regex: RegExp): string[] {
  const match = text.match(regex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return [];
    }
  }
  return [];
}

// Helper function to extract lists from text
function extractListFromText(text: string, regex: RegExp): string[] {
  const matches = text.match(regex);
  if (matches) {
    return matches
      .map(match => match.replace(/^\d+\.\s*/, '').trim())
      .filter(item => item.length > 0)
      .slice(0, 5); // Limit to 5 items
  }
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, skills } = await request.json();

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);

    // Clean up the response text and try to parse as JSON
    let parsedResponse;
    try {
      // Remove any markdown code blocks or extra formatting
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.includes('```json')) {
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (cleanedText.includes('```')) {
        cleanedText = cleanedText.replace(/```\s*/g, '');
      }
      
      // Find JSON object in the text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      console.log('Cleaned text for parsing:', cleanedText);
      parsedResponse = JSON.parse(cleanedText);
      console.log('Successfully parsed JSON:', parsedResponse);
      
    } catch (parseError) {
      console.log('JSON parsing failed, attempting fallback parsing:', parseError);
      
      // Fallback: Try to extract information using regex
      const careerRoles = extractArrayFromText(text, /(?:career roles?|job roles?|positions?)[\s\S]*?(\[[\s\S]*?\])/i);
      const skillsToLearn = extractArrayFromText(text, /(?:skills to (?:learn|develop)|recommended skills)[\s\S]*?(\[[\s\S]*?\])/i);
      
      parsedResponse = {
        careerRoles: careerRoles.length > 0 ? careerRoles : extractListFromText(text, /(?:career roles?|positions?)[\s\S]*?(?:\n|$)/gi),
        skillsToLearn: skillsToLearn.length > 0 ? skillsToLearn : extractListFromText(text, /(?:skills to (?:learn|develop))[\s\S]*?(?:\n|$)/gi),
        careerPaths: [],
        industryInsights: text,
        rawResponse: text,
        parseError: true
      };
      console.log('Fallback parsed response:', parsedResponse);
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}