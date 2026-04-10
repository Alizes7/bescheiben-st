'use strict';

/**
 * API Gemini - Proxy seguro para Bescheiben Studio
 * Endpoint: POST /api/chat
 * 
 * Formato esperado do body (seu agents.js já envia assim):
 * {
 *   system: "prompt do sistema...",
 *   messages: [{ role: "user", content: "texto do usuário" }]
 * }
 * 
 * Formato da resposta (seu agents.js espera assim):
 * {
 *   content: [{ text: "resposta da IA" }]
 * }
 */

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Chave da API Gemini (configure na Vercel)
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('[API] GEMINI_API_KEY não configurada');
    return res.status(500).json({ 
      error: 'API key não configurada no servidor',
      tip: 'Configure GEMINI_API_KEY em Settings > Environment Variables na Vercel'
    });
  }

  // Pegar dados do body (formato que seu agents.js envia)
  const { system, messages } = req.body || {};
  
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array é obrigatório' });
  }

  // Extrair o texto do usuário
  const userText = messages[0]?.content || '';
  
  if (!userText) {
    return res.status(400).json({ error: 'Content não pode ser vazio' });
  }

  try {
    // Chamar API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { 
                  text: `${system || 'Você é um assistente útil.'}\n\nUsuário: ${userText}` 
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
            topP: 0.9,
            topK: 40
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[API] Erro Gemini:', errorData);
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Erro na API Gemini',
        details: errorData.error
      });
    }

    const data = await response.json();
    
    // Extrair texto da resposta
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return res.status(500).json({ error: 'Resposta vazia da IA' });
    }

    // Retornar no formato exato que seu agents.js espera!
    return res.status(200).json({
      content: [
        { text: generatedText }
      ],
      usage: {
        model: 'gemini-1.5-flash',
        prompt: userText.length,
        completion: generatedText.length
      }
    });

  } catch (error) {
    console.error('[API] Erro inesperado:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor: ' + error.message 
    });
  }
};
