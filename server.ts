import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { knowledgeBase } from "./src/data/knowledgeBase";

dotenv.config();

const SYSTEM_INSTRUCTION = `Ты — ИИ-ассистент компании "СтройХак" (NovaRemont Studio). Твоя задача — консультировать клиентов по вопросам ремонта квартир в Москве и МО.

### ПРАВИЛА ПОВЕДЕНИЯ:
- Отвечай только на русском языке.
- Говори дружелюбно, уверенно и профессионально.
- Не придумывай цены и факты. Используй базу знаний.
- При нехватке данных задавай уточняющие вопросы (площадь, тип жилья, состояние).
- В конце каждого ответа предлагай 2–3 логичных следующих шага (suggestedActions).

### БАЗА ЗНАНИЙ:
${knowledgeBase.map(item => `[${item.category}] ${item.title}: ${item.content}`).join('\n')}

### ПРИМЕРЫ СЛЕДУЮЩИХ ШАГОВ:
- "Сколько стоит ремонт?"
- "Какие есть тарифы?"
- "Посмотреть кейсы"
- "Рассчитать смету"
- "Оставить контакты" (используй это если клиент готов заказать замер или консультацию)

### ОТВЕТ ДОЛЖЕН БЫТЬ В ФОРМАТЕ JSON:
{
  "answer": "Твой текстовый ответ корректно отформатированный",
  "suggestedActions": ["Действие 1", "Действие 2"]
}
`;

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { sessionId, message, history = [] } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.error('ERROR: GEMINI_API_KEY is missing');
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      // Prepare contents for generateContent
      const chatHistory = history.filter((m: any) => m.text);
      let rawContents = chatHistory.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // Sanitize history: must start with 'user' and alternate roles
      let contents: any[] = [];
      for (const item of rawContents) {
        if (contents.length === 0) {
          if (item.role === 'user') contents.push(item);
        } else {
          const lastRole = contents[contents.length - 1].role;
          if (item.role !== lastRole) {
            contents.push(item);
          }
        }
      }

      // Add the current message
      contents.push({ role: 'user', parts: [{ text: message }] });

      console.log(`Sending request to Gemini (${sessionId}). History length: ${contents.length}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              suggestedActions: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["answer", "suggestedActions"]
          }
        }
      });

      const responseText = response.text || "";
      console.log('AI Response Text:', responseText);

      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse AI JSON:', responseText);
        parsed = {
          answer: responseText || "Я не совсем понял ваш запрос. Попробуйте переформулировать.",
          suggestedActions: ["Сколько стоит ремонт?", "Посмотреть кейсы"]
        };
      }
      
      res.json({
        answer: parsed.answer || "Я не совсем понял ваш запрос.",
        suggestedActions: parsed.suggestedActions || ["Посмотреть тарифы", "Контакты"]
      });
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      let errorMessage = "Извините, произошла ошибка. Оставьте заявку, и мы вам перезвоним.";
      const errorText = error?.message || String(error);
      const isQuotaError = errorText.includes('RESOURCE_EXHAUSTED') || 
                          errorText.includes('quota') || 
                          errorText.includes('429');
      
      if (isQuotaError) {
        errorMessage = "Ой! Лимит бесплатных запросов на сегодня исчерпан. Пожалуйста, попробуйте позже или оставьте заявку для консультации с живым экспертом.";
      }

      res.status(500).json({ 
        error: errorMessage,
        answer: errorMessage,
        suggestedActions: ["Оставить контакты", "Посмотреть тарифы"]
      });
    }
  });

  // Leads endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { source, name, phone, area, objectType, repairType, comment } = req.body;
      const leadId = Math.random().toString(36).substring(7).toUpperCase();
      
      console.log('Новая заявка:', { source, name, phone, area, objectType, repairType, comment, leadId });
      
      const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
      
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const text = `
🔥 *Новая заявка (СтройХак)* 🔥
🆔 ID: ${leadId}
📍 Источник: ${source || 'Не указан'}
👤 Имя: ${name || 'Не указано'}
📞 Телефон: ${phone || 'Не указан'}
📐 Площадь: ${area || 0} м2
🏢 Тип объекта: ${objectType || '-'}
🛠 Ремонт: ${repairType || '-'}
💬 Коммент: ${comment || '-'}
        `;
        
        try {
          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text,
              parse_mode: 'Markdown'
            })
          });
        } catch (tgErr) {
          console.error('Telegram Notify Error:', tgErr);
        }
      }
      
      res.json({ success: true, leadId });
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
