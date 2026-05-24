import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Lead Generation endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = req.body;
      console.log('Новая заявка с AI:', leadData);
      
      const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
      
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const text = `
🔥 *Новая заявка (AI)* 🔥
Имя: ${leadData.name || 'Не указано'}
Телефон: ${leadData.phone || 'Не указан'}
Площадь: ${leadData.area ? leadData.area + ' м2' : '-'}
Тип объекта: ${leadData.objectType || '-'}
Тариф: ${leadData.repairType || '-'}
Комментарий: ${leadData.comment || '-'}
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
      
      res.json({ success: true, leadId: "lead_" + Date.now() });
    } catch (error: any) {
      console.error('Lead Error:', error);
      res.status(500).json({ error: 'Failed to process lead' });
    }
  });

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
