const form = document.getElementById('form-question');
const form2 = document.getElementById('form-key');
const respostaBox = document.getElementById('resposta-box');
const respostaInput = document.getElementById('txtarea-api-answer');
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
let userApiKey = '';

form2.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiKeyInput = document.getElementById('input-api-key').value.trim();

  if (!apiKeyInput) {
    apiKeyInput.value="Vazio..."
    alert('Por favor, insira a chave da API');
    return;
  }

  try {
    const response = await fetch(`${url}?key=${apiKeyInput}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "Teste de validação da API key" }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      alert(`Erro: ${data.error.message || 'API key inválida'}`);
    } else {
      userApiKey = apiKeyInput;
      alert('API key validada com sucesso!');
      document.getElementById('input-api-key').value = '';
    }

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao validar a API key. Verifique sua conexão.');
  }
})

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pergunta = document.getElementById('input-api-question').value.trim();
  if (!pergunta) {
    alert('Campo de pergunta vazio.')
    return;
  }

  if (!userApiKey) {
    alert('Por favor, insira e valide sua API key.');
    return;
  }

  respostaInput.value = 'Carregando...';
  respostaBox.style.display = 'block';

  try {
    const response = await fetch(`${url}?key=${userApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: pergunta }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      respostaInput.value = `Erro: ${data.error.message || 'Ocorreu um erro ao processar sua pergunta'}`;
    } else {
      
      const resposta = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.candidates?.[0]?.text ||
        data.text ||
        'Sem resposta';
      respostaInput.value = resposta;
    }
  } catch (error) {
    console.error('Erro:', error);
    respostaInput.value = 'Erro ao buscar resposta. Verifique sua conexão.';
  }
});
