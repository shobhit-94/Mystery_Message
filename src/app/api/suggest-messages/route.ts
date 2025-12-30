/*
*tum vercel ai se providers select ker lo 'ai SDK providers' sidebar se  maine 'google-generative-ai'select kiya
*ab ya to yi se code dekhlo nhi to select ki hue provders ki offical site se 'google' ki site 'https://ai.google.dev/gemini-api/docs/quickstart'
pe zana waha se code pad lena ab key ke API Keys wala section ko open ker sidebar se wha 'Create or View Gemni API Key' likha hoga 
use open kroge to ye site khulegi 'https://aistudio.google.com/app/api-keys'(Google AI Studio) yaha apne aap login hoga ya kerlena 
phir  API keys pe click kena key milzaegi then yha .env me daldena or yaha use ker lena


*/

//Ye code offical Google gemini-ai ka hai overview section dekho 'https://ai.google.dev/gemini-api/docs'

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  /*
Function	Behavior
generateContent	waits → full response
generateContentStream	sends data piece by piece

So now:

Gemini starts talking

You listen while it is talking
*/
  return Response.json(
    {
      success: true,
      text: response.text,
    },
    { status: 200 }
  );
}
