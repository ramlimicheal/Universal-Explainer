
import { GoogleGenAI, Type } from "@google/genai";
import { AdvancedExplanation } from '../types';

const MODEL = "gemini-2.5-flash";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemPrompt = `You are "The Universal Explainer," an elite AI educator capable of breaking down ANY concept into crystal-clear understanding at multiple levels of depth.

Your mission: Transform complex information into masterful explanations that work for EVERYONE - from complete beginners to advanced learners.

From the user's transcript, you must provide:

**MULTI-LEVEL UNDERSTANDING:**
1. **Subject**: Identify the main topic/subject being discussed
2. **Core Message**: The single most critical takeaway (1-2 sentences)
3. **ELI5 (Explain Like I'm 5)**: Explain using simple words, analogies a child would understand
4. **Intermediate Level**: For someone with basic background knowledge
5. **Advanced Level**: In-depth explanation with nuances and complexities
6. **Technical Depth**: Technical/academic perspective with precise terminology

**CLARITY TOOLS:**
7. **Key Terms**: List 3-5 most important terms/concepts (array of strings)
8. **Glossary**: Define each key term simply (array of objects: {term, definition})
9. **Analogy**: Create a memorable, relatable analogy that perfectly captures the concept
10. **Visual Description**: Describe how to visualize this concept (for mental models)

**EXAMPLES & APPLICATION:**
11. **Example**: A clear, concrete example demonstrating the concept
12. **Counter Example**: Show what it's NOT or a common mistake
13. **Real-World Implementation**: How it's actually used in practice
14. **Use Cases**: 3-5 specific scenarios where this applies (array of strings)

**CONTEXT & DEPTH:**
15. **Historical Context**: Brief background of how this concept emerged
16. **Future Implications**: Where this is heading, what it enables
17. **Common Misconceptions**: 2-3 things people often get wrong (array of strings)
18. **Related Concepts**: Other topics to explore for deeper understanding (array of strings)

**ACTIONABLE LEARNING:**
19. **Practical Exercise**: A simple activity to reinforce understanding
20. **Summary**: 2-3 sentence recap tying everything together

Return ONLY valid JSON with all these fields.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    subject: { type: Type.STRING },
    coreMessage: { type: Type.STRING },
    eli5: { type: Type.STRING },
    intermediate: { type: Type.STRING },
    advanced: { type: Type.STRING },
    technicalDepth: { type: Type.STRING },
    keyTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
    glossary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING }
        },
        required: ["term", "definition"]
      }
    },
    analogy: { type: Type.STRING },
    visualDescription: { type: Type.STRING },
    example: { type: Type.STRING },
    counterExample: { type: Type.STRING },
    realWorldImplementation: { type: Type.STRING },
    useCases: { type: Type.ARRAY, items: { type: Type.STRING } },
    historicalContext: { type: Type.STRING },
    futureImplications: { type: Type.STRING },
    commonMisconceptions: { type: Type.ARRAY, items: { type: Type.STRING } },
    relatedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
    practicalExercise: { type: Type.STRING },
    summary: { type: Type.STRING }
  },
  required: [
    "subject", "coreMessage", "eli5", "intermediate", "advanced", "technicalDepth",
    "keyTerms", "glossary", "analogy", "visualDescription", "example", "counterExample",
    "realWorldImplementation", "useCases", "historicalContext", "futureImplications",
    "commonMisconceptions", "relatedConcepts", "practicalExercise", "summary"
  ]
};

export async function generateAdvancedExplanation(transcript: string): Promise<AdvancedExplanation> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: transcript,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse JSON response:", jsonText);
      throw new Error("Invalid AI response. The format was not correct.");
    }

    const explanation: AdvancedExplanation = {
      ...parsed,
      id: crypto.randomUUID(),
    };

    return explanation;
  } catch (error) {
    console.error("Error generating explanation from Gemini:", error);
    throw new Error(`API Error: Failed to generate explanation. Please check your connection and API key.`);
  }
}
