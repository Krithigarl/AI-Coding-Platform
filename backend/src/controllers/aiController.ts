import { Request, Response } from "express";

/**
 * Helper to call Google Gemini API with fallback models
 */
async function callGeminiApi(prompt: string, apiKey: string): Promise<string> {
  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800
            }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${model}): ${response.status} - ${errText}`);
      }

      const data: any = await response.json();
      const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidate) {
        return candidate;
      }
    } catch (err) {
      lastError = err;
      // Try next model if available
    }
  }

  throw lastError || new Error("Failed to generate content with Gemini models.");
}

/**
 * Local rule-based analyzer as smart fallback if no API key is set yet
 */
function analyzeCodeLocally(code: string, language: string, error?: string) {
  const lines = code.split("\n");

  // Python unclosed parenthesis
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;

    if (openParens > closeParens) {
      const fixedLine = line + ")".repeat(openParens - closeParens);
      return {
        explanation: `The error is because you forgot to close the bracket in the \`${line.trim().split("(")[0]}()\` function.`,
        hint: "Check line " + (i + 1) + ". Every opening parenthesis '(' must have a matching closing parenthesis ')'.",
        suggestedCode: fixedLine.trim(),
        line: i + 1,
        source: "local-analyzer"
      };
    }

    // Python missing colon in if/for/def/while
    if (/^\s*(if|for|while|def|class|elif|else)\b/.test(line) && !line.trim().endsWith(":")) {
      return {
        explanation: `In Python, compound statements like \`${line.trim().split(" ")[0]}\` must end with a colon (:).`,
        hint: "Add a colon ':' at the end of line " + (i + 1) + ".",
        suggestedCode: `${line.trim()}:`,
        line: i + 1,
        source: "local-analyzer"
      };
    }
  }

  return {
    explanation: error
      ? `The code produced an error: ${error}. Review your syntax and variables.`
      : "Check variable declarations and function calls to make sure they are properly formatted.",
    hint: "Make sure all brackets, quotes, and indentation match correctly.",
    suggestedCode: code,
    source: "local-analyzer"
  };
}

/**
 * Controller: Get AI Hint for Code & Errors (Gemini Powered)
 * POST /api/ai/hint
 */
export const getAIHint = async (req: Request, res: Response) => {
  try {
    const { code, language = "python", error, topic = "Practice", task } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code snippet is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key configured or placeholder, use the intelligent analyzer fallback
    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
      const fallbackResult = analyzeCodeLocally(code, language, error);
      return res.json({
        success: true,
        ...fallbackResult,
        isDemoKey: true,
        note: "Add your GEMINI_API_KEY in backend/.env for live cloud Gemini AI models."
      });
    }

    const systemPrompt = `
You are CodeGenius AI Mentor, an empathetic, encouraging coding tutor assisting a student.
Context:
- Language: ${language}
- Topic: ${topic}
- Task: ${task || "Practice exercise"}
- Student's Code:
\`\`\`${language}
${code}
\`\`\`
- Current Error/Output:
${error || "No runtime error reported yet. Student asked for a hint."}

Instructions:
Respond with a strict JSON object only, with NO markdown backticks around the JSON.
The JSON must have this exact shape:
{
  "explanation": "Clear, friendly 1-2 sentence explanation of why the error happened (e.g. 'The error is because you forgot to close the bracket in the print() function.')",
  "hint": "A subtle conceptual hint to help the student learn without just giving away the solution blindly.",
  "suggestedCode": "The exact corrected line or short code snippet (e.g. 'print(age)')",
  "quickFix": "Short action instruction"
}
`;

    const rawResponse = await callGeminiApi(systemPrompt, apiKey);

    // Parse JSON from Gemini response (strip ```json if present)
    let parsedData;
    try {
      const cleanJson = rawResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      parsedData = {
        explanation: rawResponse,
        hint: "Review your syntax on the highlighted line.",
        suggestedCode: code
      };
    }

    return res.json({
      success: true,
      explanation: parsedData.explanation,
      hint: parsedData.hint,
      suggestedCode: parsedData.suggestedCode,
      quickFix: parsedData.quickFix || "Fix syntax error",
      source: "gemini-ai"
    });
  } catch (error: any) {
    console.error("Gemini Hint Error:", error);

    // Gracefully fall back to local analyzer on API issues / quota limits
    const { code, language = "python", error: codeError } = req.body;
    const fallback = analyzeCodeLocally(code || "", language, codeError);

    return res.json({
      success: true,
      ...fallback,
      warning: "Gemini API temporarily unavailable or quota reached; provided local analysis."
    });
  }
};

/**
 * Controller: Run & Evaluate Code (Simulated / AI Runtime)
 * POST /api/ai/analyze
 */
export const runAndAnalyzeCode = async (req: Request, res: Response) => {
  try {
    const { code, language = "python" } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code snippet is required" });
    }

    // 1. Fast Syntax Checking for Python
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;

      if (openParens > closeParens) {
        const errorDetails = `File "main.py", line ${i + 1}\n  ${line}\n  ${" ".repeat(Math.max(0, line.length - 1))}^\nSyntaxError: '(' was never closed`;
        return res.json({
          success: false,
          hasError: true,
          error: errorDetails,
          output: "",
          errorLine: i + 1,
          autoHint: {
            explanation: `The error is because you forgot to close the bracket in the \`${trimmed.split("(")[0]}()\` function.`,
            suggestedCode: `${line})`.trim()
          }
        });
      }
    }

    // 2. If Gemini API is configured, ask Gemini to simulate real execution
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your_gemini_api_key_here" && apiKey.trim() !== "") {
      const prompt = `
Execute this ${language} code as a terminal interpreter:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with valid JSON:
{
  "hasError": boolean,
  "error": "exact terminal error string if syntax/runtime error occurs, otherwise empty string",
  "output": "standard output text produced by the code execution, otherwise empty string"
}
`;
      try {
        const raw = await callGeminiApi(prompt, apiKey);
        const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        return res.json({
          success: true,
          hasError: parsed.hasError,
          error: parsed.error || "",
          output: parsed.output || ""
        });
      } catch {
        // Continue to default simulation
      }
    }

    // 3. Simple in-memory simulator for basic Python print / variable scripts
    try {
      const prints: string[] = [];
      const scope: Record<string, any> = {};

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        // Simple variable assignment: name = "Krithiga" or age = 22
        const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (assignMatch) {
          const varName = assignMatch[1];
          let valStr = assignMatch[2];
          try {
            // evaluate simple literals
            if (valStr.startsWith('"') || valStr.startsWith("'")) {
              scope[varName] = valStr.slice(1, -1);
            } else if (!isNaN(Number(valStr))) {
              scope[varName] = Number(valStr);
            } else if (valStr === "True") {
              scope[varName] = true;
            } else if (valStr === "False") {
              scope[varName] = false;
            } else {
              scope[varName] = valStr;
            }
          } catch {
            scope[varName] = valStr;
          }
          continue;
        }

        // Simple print: print(name) or print("hello")
        const printMatch = trimmed.match(/^print\((.*)\)$/);
        if (printMatch) {
          const content = printMatch[1].trim();
          if (content.startsWith('"') || content.startsWith("'")) {
            prints.push(content.slice(1, -1));
          } else if (scope[content] !== undefined) {
            prints.push(String(scope[content]));
          } else {
            prints.push(content);
          }
          continue;
        }
      }

      return res.json({
        success: true,
        hasError: false,
        error: "",
        output: prints.length > 0 ? prints.join("\n") : "Program executed with no output."
      });
    } catch (simError: any) {
      return res.json({
        success: false,
        hasError: true,
        error: simError.message || "Runtime execution error",
        output: ""
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: "Server error during code analysis", error: error.message });
  }
};

/**
 * Controller: Chat with AI Mentor
 * POST /api/ai/chat
 */
export const chatWithMentor = async (req: Request, res: Response) => {
  try {
    const { message, codeContext, language = "python" } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
      return res.json({
        reply: `Hello! I'm your AI Mentor. To connect to real-time Gemini AI, configure GEMINI_API_KEY in backend/.env. In the meantime, I can assist with Python syntax, data types, and debugging!`,
        source: "fallback"
      });
    }

    const prompt = `
You are CodeGenius AI Mentor, a friendly, concise programming instructor.
Student Question: ${message}
${codeContext ? `Student's Current Code:\n\`\`\`${language}\n${codeContext}\n\`\`\`` : ""}

Provide a helpful, direct, and concise explanation with code examples if helpful. Keep answers under 3 paragraphs.
`;

    const reply = await callGeminiApi(prompt, apiKey);
    return res.json({ reply, source: "gemini-ai" });
  } catch (error: any) {
    console.error("Mentor chat error:", error);
    return res.status(500).json({ message: "Error communicating with AI Mentor" });
  }
};
