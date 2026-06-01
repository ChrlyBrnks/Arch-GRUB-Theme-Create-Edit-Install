import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAi() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST Api: Generate a customizable GRUB theme using Gemini
app.post("/api/generate-theme", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Falta el prompt para generar el tema." });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return a fallback theme styled beautifully with a notice
      res.json({
        success: true,
        isDemo: true,
        message: "Clave de API de Gemini no configurada. Cargando plantilla de demostración.",
        theme: {
          name: prompt.substring(0, 20) + " AI Demo",
          description: "Tema generado (Modo Demostración sin clave de API)",
          backgroundColorStart: "#0a0f1d",
          backgroundColorEnd: "#020408",
          backgroundType: "gradient",
          textColorNormal: "#9ece6a",
          textColorSelected: "#ffffff",
          textBgColorSelected: "#1a1b26",
          borderColorNormal: "#444b6a",
          borderColorSelected: "#7aa2f7",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 16,
          itemHeight: 28,
          itemSpacing: 8,
          menuWidth: 60,
          menuHeight: 50,
          menuLeft: 20,
          menuTop: 25,
          countdownSeconds: 10,
          terminalVisible: true,
        }
      });
      return;
    }

    const ai = getAi();
    const systemPrompt = `You are an elite Linux GRUB core theme designer.
Your goal is to parse a text prompt and output a perfectly formatted color palette and layout configuration for a custom GRUB Theme in JSON format.
GRUB bootloader limits colors to hex values (e.g., #RRGGBB).

Return a valid JSON object matching this schema:
{
  "name": "A short aesthetic name for the theme",
  "description": "A poetic description of the layout",
  "backgroundColorStart": "six-character hex color (e.g. #0d1117)",
  "backgroundColorEnd": "six-character hex color (e.g. #161b22)",
  "backgroundType": "gradient" or "solid",
  "textColorNormal": "hex color for standard menu items (e.g. #c9d1d9)",
  "textColorSelected": "hex color for selected item (e.g. #58a6ff)",
  "textBgColorSelected": "hex color for selection highlight box (e.g. #21262d)",
  "borderColorNormal": "hex color for standard menu box frame",
  "borderColorSelected": "hex color for active menu box selection frame",
  "fontFamily": "aesthetic font suggestion e.g. 'Space Grotesk, sans-serif', 'Playfair Display, serif', 'JetBrains Mono, monospace'",
  "fontSize": integer (e.g. 14, 16, 18),
  "itemHeight": integer (e.g. 24, 28, 32),
  "itemSpacing": integer (e.g. 6, 8, 12),
  "menuWidth": integer percentage (e.g. 50, 60, 70),
  "menuHeight": integer percentage (e.g. 40, 50, 60),
  "menuLeft": integer percentage (e.g. 15, 20, 25),
  "menuTop": integer percentage (e.g. 20, 25, 30),
  "countdownSeconds": integer seconds (e.g. 5, 8, 10),
  "terminalVisible": boolean
}

Make sure colors are extremely contrast-rich, compliant with eye safety, and perfectly matching the prompt vibes (e.g. cyberpunk, nordic, minimal-black, matrix, volcanic, deep-sea).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Prompt del usuario: ${prompt}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            backgroundColorStart: { type: Type.STRING },
            backgroundColorEnd: { type: Type.STRING },
            backgroundType: { type: Type.STRING },
            textColorNormal: { type: Type.STRING },
            textColorSelected: { type: Type.STRING },
            textBgColorSelected: { type: Type.STRING },
            borderColorNormal: { type: Type.STRING },
            borderColorSelected: { type: Type.STRING },
            fontFamily: { type: Type.STRING },
            fontSize: { type: Type.INTEGER },
            itemHeight: { type: Type.INTEGER },
            itemSpacing: { type: Type.INTEGER },
            menuWidth: { type: Type.INTEGER },
            menuHeight: { type: Type.INTEGER },
            menuLeft: { type: Type.INTEGER },
            menuTop: { type: Type.INTEGER },
            countdownSeconds: { type: Type.INTEGER },
            terminalVisible: { type: Type.BOOLEAN },
          },
          required: [
            "name", "description", "backgroundColorStart", "backgroundColorEnd", 
            "backgroundType", "textColorNormal", "textColorSelected", "textBgColorSelected",
            "borderColorNormal", "borderColorSelected", "fontFamily", "fontSize",
            "itemHeight", "itemSpacing", "menuWidth", "menuHeight", "menuLeft", "menuTop",
            "countdownSeconds", "terminalVisible"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se pudo obtener una respuesta estructurada de Gemini.");
    }

    const parsedTheme = JSON.parse(text.trim());
    res.json({
      success: true,
      theme: parsedTheme
    });

  } catch (err: any) {
    console.error("Error generating theme:", err);
    res.status(500).json({ error: err.message || "Error interno al procesar el tema." });
  }
});

// Configure Vite integration for develop, or static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server runs on port ${PORT}`);
  });
}

startServer();
