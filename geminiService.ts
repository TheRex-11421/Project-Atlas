
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, ProjectSuggestion, ProjectRoadmap, SkillLevel } from "../types";

export const suggestProjects = async (prefs: UserPreferences): Promise<ProjectSuggestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a Senior Academic Advisor. Research and suggest 4 high-impact, innovative engineering project ideas for 2024-2025.
    Student Profile: ${prefs.year} year in ${prefs.branch}. 
    Focus Areas: ${prefs.interests}. 
    Current Skill Level: ${prefs.skillLevel}. 
    Timeline: ${prefs.duration}. 
    
    Requirements:
    1. Projects must be academically rigorous and suitable for a portfolio.
    2. Use real-world industry trends (utilize Google Search).
    3. Include specific learning outcomes like "Real-time Data Processing" or "Systems Integration".`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: Object.values(SkillLevel) },
            estimatedTime: { type: Type.STRING },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            learningOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["id", "title", "description", "difficulty", "estimatedTime", "techStack", "learningOutcomes"],
        },
      },
    },
  });

  try {
    const suggestions: ProjectSuggestion[] = JSON.parse(response.text);
    // Extract unique source URLs from grounding metadata
    const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter((uri: string | undefined): uri is string => !!uri) || [];
    
    const uniqueUrls = Array.from(new Set(urls)).slice(0, 3);
    
    return suggestions.map(s => ({ ...s, sourceUrls: uniqueUrls }));
  } catch (error) {
    console.error("Failed to parse project suggestions", error);
    return [];
  }
};

export const generateRoadmap = async (project: ProjectSuggestion, prefs: UserPreferences): Promise<ProjectRoadmap> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a Project Lead. Create an actionable, 4-phase execution roadmap for: "${project.title}".
    Student Context: ${prefs.year}, ${prefs.branch}, Skill: ${prefs.skillLevel}.
    
    Phases:
    1. Research & Architecture
    2. Core Prototyping
    3. Feature Integration
    4. Testing & Documentation
    
    Provide 4 tasks per phase and 2-3 specific learning resources (docs/repos).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectId: { type: Type.STRING },
          title: { type: Type.STRING },
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING },
                tasks: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                    },
                    required: ["id", "text"]
                  } 
                },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["id", "title", "description", "duration", "tasks", "resources"],
            },
          },
          finalAdvice: { type: Type.STRING },
        },
        required: ["projectId", "title", "milestones", "finalAdvice"],
      },
    },
  });

  try {
    const rawData = JSON.parse(response.text);
    return {
      ...rawData,
      milestones: rawData.milestones.map((m: any) => ({
        ...m,
        tasks: m.tasks.map((t: any) => ({ ...t, completed: false }))
      })),
      overallProgress: 0
    };
  } catch (error) {
    console.error("Roadmap generation failed", error);
    throw new Error("Failed to generate strategic roadmap.");
  }
};
