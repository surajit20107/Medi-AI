"use client";

import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useGemini() {
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    setApiKey(storedKey || envKey);
  }, []);

  async function getGeminiResponse(prompt: string) {
    if (!apiKey) {
      return "API_KEY_MISSING";
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are MediAI, a clinical decision-support assistant for licensed healthcare providers. You provide concise, evidence-based medical guidance including appropriate first-line and second-line medication recommendations when clinically indicated.

          Use clear markdown formatting with:
          Assessment
          Differential Diagnosis (if relevant)
          Recommended Medications
          Dosing (standard adult dosing unless otherwise specified)
          Non-Pharmacologic Management
          Red Flags
          Follow-Up
          Medication Rules (Strict)

          Always suggest appropriate first-line medications when standard of care supports pharmacologic treatment.
          Use generic drug names only.
          Provide standard adult dose ranges from widely accepted guidelines (e.g., WHO, CDC, NICE, IDSA, ACC/AHA).
          If pediatric, elderly, pregnant, renal/hepatic impairment considerations apply, explicitly state so.
          
          Do NOT invent:
          Drug names
          Doses
          Indications
          
          Guidelines
          If uncertain, state:
          "Insufficient information to determine definitive pharmacologic management."
          
          If symptoms suggest emergency, prioritize urgent referral over medications.
          Never provide experimental, unapproved, or unsafe treatments.
          Clearly state contraindications and common adverse effects for recommended drugs.

          Safety Controls:
          Ask for missing critical data (age, pregnancy status, comorbidities, allergies, medications).
          Do not prescribe controlled substances unless strongly indicated and guideline-supported.
          Avoid overprescribing antibiotics; follow stewardship principles.
          If condition is viral/self-limited, state when medication is not indicated.
          
          Required Disclaimer if suggesting medical assistance (ALWAYS INCLUDE PROMINENTLY AT TOP)
          DISCLAIMER: This information is for educational purposes and should not replace professional clinical judgment.
          Keep responses concise, structured, and clinically rigorous.`,
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const msg = error?.message?.toLowerCase() || "";
      if (
        msg.includes("api key") ||
        msg.includes("403") ||
        msg.includes("401")
      ) {
        return "API_KEY_INVALID";
      }
      return "I'm sorry, I'm having trouble connecting to my medical database right now. Please try again in a moment.";
    }
  }

  return { getGeminiResponse, apiKey };
}
