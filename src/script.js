const form = document.getElementById('pergunta-form');
const respostaBox = document.getElementById('resposta-box');
const respostaInput = document.getElementById('input-api-answer');
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
let userApiKey = '';

document.getElementById('btn-api-key').addEventListener('click', async () => {
  const apiKeyInput = document.getElementById('input-api-key').value.trim();

  if (!apiKeyInput) {
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
      // API key válida, salvar para uso posterior
      userApiKey = apiKeyInput;
      alert('API key validada com sucesso!');
      document.getElementById('input-api-key').value = '';
    }

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao validar a API key. Verifique sua conexão.');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pergunta = document.getElementById('input-api-question').value.trim();
  if (!pergunta) return;

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
      // Extrair a resposta do modelo
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
