import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // Create context block
      const systemInstruction = `Ты опытный консультант по ремонту квартир из компании "СтройХак".
Ты помогаешь клиентам рассчитать стоимость, выбрать тариф, узнать про этапы работ и развеять сомнения (гарантия, смета, сроки).
Отвечай кратко, профессионально, приветливо. В конце предлагай оставить телефон для выезда замерщика или точной сметы.
Тарифы: Базовый (12 000 руб/м2), Комфорт (25 000 руб/м2), Премиум (45 000 руб/м2).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          { role: 'model', parts: [{ text: 'Понял, готов помочь.' }] },
          // Flatten user messages
          ...messages.map((m: any) => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }))
        ]
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('AI Error:', error);
      res.status(500).json({ error: error.message || 'Error generating AI response' });
    }
  });

  // Lead Generation endpoint
  app.post("/api/lead", async (req, res) => {
    try {
      const leadData = req.body;
      console.log('Новая заявка:', leadData);
      
      const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
      
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const text = `
🔥 *Новая заявка (СтройХак)* 🔥
Имя: ${leadData.name || 'Не указано'}
Телефон: ${leadData.phone || 'Не указан'}
Площадь: ${leadData.area ? leadData.area + ' м2' : '-'}
Тариф: ${leadData.tariff || '-'}
Сроки: ${leadData.timeframe || '-'}
        `;
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'Markdown'
          })
        });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error('Lead Error:', error);
      res.status(500).json({ error: 'Failed to process lead' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
