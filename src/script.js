const sendQuestion = document.getElementById('form-question');
const sendAPIKey = document.getElementById('form-key');
const respostaBox = document.getElementById('box-answer');

const respostaInput = document.getElementById('txtarea-api-answer');
const copyAnswer = document.getElementById('btn-copy');
const labelKey = document.getElementById('label-key');

const btnApiKey = document.getElementById('btn-send');
const btnLoading = document.getElementById('btn-loading');
const btnSend = document.getElementById('btn-api-key');

const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
let userApiKey = '';

sendAPIKey.addEventListener('submit', async (e) => {
  e.preventDefault();

  disableButton();

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
      userApiKey = apiKeyInput;
      alert('API key validada com sucesso!');
      document.getElementById('input-api-key').value = userApiKey;
    }

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao validar a API key. Verifique sua conexão.');
  }

  enableButton();

})

sendQuestion.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pergunta = document.getElementById('input-api-question').value.trim();
  if (!pergunta) {
    alert('Campo de pergunta vazio.')
    enableButton();
    return;
  }

  if (!userApiKey) {
    alert('Por favor, insira e valide sua API key.');
    return;
  }

  respostaInput.value = 'Carregando...';
  respostaBox.style.display = 'block';
  respostaBox.style.height = "auto";
  respostaBox.style.height = respostaBox.scrollHeight + "px";

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

      localStorage.setItem('resposta', resposta);

      copyAnswer.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('click disparou');
        if (localStorage.getItem('resposta')) {
          try {
            navigator.clipboard.writeText(localStorage.getItem('resposta')).then(() => alert('Texto copiado!'));
            console.log("disparou")
          } catch (error) {
            error => console.error('Erro ao copiar:', error)
            console.log("não disparou")
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro:', error);
    respostaInput.value = 'Erro ao buscar resposta. Verifique sua conexão.';
  }
});

function disableButton() {
  btnLoading.disabled = false;
  btnApiKey.disabled = true;
  btnSend.disabled = true;

  btnApiKey.style.display = 'none';
  btnLoading.style.display = 'block';
}

function enableButton() {
  btnApiKey.style.display = 'block';
  btnLoading.style.display = 'none';
  btnSend.disabled = false;
}
