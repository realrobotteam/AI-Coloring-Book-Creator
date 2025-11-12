
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
  
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface PagePrompts {
  coverPrompt: string;
  pagePrompts: string[];
}

export async function generateColoringPages(theme: string): Promise<PagePrompts> {
    const prompt = `Generate 5 unique and simple coloring page ideas and 1 cover page idea based on the theme "${theme}". The ideas should be suitable for a young child. The cover should be a welcoming scene related to the theme.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    coverPrompt: {
                        type: Type.STRING,
                        description: "A prompt for the cover page image.",
                    },
                    pagePrompts: {
                        type: Type.ARRAY,
                        description: "An array of 5 distinct prompts for the coloring pages.",
                        items: {
                            type: Type.STRING,
                        },
                    },
                },
                required: ["coverPrompt", "pagePrompts"],
            },
        },
    });

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        // Basic validation
        if (parsedJson.coverPrompt && Array.isArray(parsedJson.pagePrompts) && parsedJson.pagePrompts.length > 0) {
            return parsedJson;
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }
    } catch (error) {
        console.error("Failed to parse JSON response:", jsonText, error);
        throw new Error("Could not generate coloring page ideas.");
    }
}


export async function generateImage(prompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '4:3',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("Image generation failed.");
    }
}
