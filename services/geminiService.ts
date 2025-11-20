
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function auditDocuments(masterContent: string, auditContent: string): Promise<string> {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    You are an expert document auditor specializing in spreadsheet data. Your task is to compare two documents extracted from Excel files and identify all discrepancies.

    Here is the MASTER DOCUMENT, which serves as the correct template or source of truth.
    --- MASTER DOCUMENT START ---
    ${masterContent}
    --- MASTER DOCUMENT END ---

    Here is the DOCUMENT TO AUDIT, which needs to be checked against the master.
    --- DOCUMENT TO AUDIT START ---
    ${auditContent}
    --- DOCUMENT TO AUDIT END ---

    Please perform a detailed, cell-by-cell comparison if necessary. Your analysis should cover the following points for each sheet present in both documents:
    1.  **Missing Rows:** Rows present in the MASTER DOCUMENT but not in the DOCUMENT TO AUDIT.
    2.  **Extra Rows:** Rows present in the DOCUMENT TO AUDIT but not in the MASTER DOCUMENT.
    3.  **Data Mismatches:** Rows that exist in both documents but have different values in one or more columns. Clearly state the row identifier (e.g., ID or first column value), the column name, the value in the master, and the value in the audited document.
    4.  **Structural Differences:** Mention if entire sheets are missing or have been added.

    Present your findings in a clear, organized, and easy-to-read format. Use headings and bullet points. Start with a summary of findings. If no discrepancies are found across all sheets, state clearly: "No discrepancies found between the two documents."
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
}
