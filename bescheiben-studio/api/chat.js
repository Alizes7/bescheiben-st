module.exports = async function handler(req, res) {
  // CORS obrigatório
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Use Gemini (gratuito) - obtenha chave em makersuite.google.com
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY não configurada');
    return res.status(500).json({ error: 'API key não configurada' });
  }

  const { messages, system } = req.body || {};
  const prompt = messages?.[0]?.content || '';
  
  // Contexto B2B específico para a Bescheiben
  const b2bContext = system || `Você é um especialista em marketing B2B da agência Bescheiben. 
    Crie conteúdo estratégico focado em geração de leads qualificados, não awareness genérico. 
    Tom: profissional, autoridade, dados-driven.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: `${b2bContext}\n\nSolicitação: ${prompt}` }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1500,
            topP: 0.9
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro na API Gemini');
    }

    const data = await response.json();
    
    // Formato compatível com seu frontend
    return res.status(200).json({
      content: [{ text: data.candidates[0].content.parts[0].text }],
      usage: { model: 'gemini-1.5-flash' }
    });

  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ 
      error: 'Falha na geração: ' + error.message 
    });
  }
};
