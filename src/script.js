const form = document.getElementById('pergunta-form');
const respostaBox = document.getElementById('resposta-box');
const respostaInput = document.getElementById('input-api-answer');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pergunta = document.getElementById('input-api-question').value.trim();
  if (!pergunta) return;

  try {
    // Simulação de chamada à API
    const data = await new Promise((resolve) => {
      setTimeout(() => resolve({ texto: `Resposta para: ${pergunta}` }), 1000);
    });

    respostaInput.value = data.texto;
    respostaBox.style.display = 'block';
  } catch (error) {
    respostaInput.value = 'Erro ao buscar resposta';
    respostaBox.style.display = 'block';
  }
});
