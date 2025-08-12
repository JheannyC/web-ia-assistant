const form = document.getElementById('pergunta-form');
const respostaBox = document.getElementById('resposta-box');
const respostaInput = document.getElementById('input-api-answer');

const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'


document.getElementById('btn-api-key').addEventListener('click', async () => {
    const prompt = document.getElementById('input-api-key').value;
    const resultadoDiv = document.getElementById('resultado');

    if (!prompt) {
        alert ('Por favor, insira a chave da API');
        console.log("clique");
        return;
            
    }

    try {
        const response = await fetch(`${url}?key=${prompt}`, { // A requisição vai para o seu próprio servidor
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'keys': ''
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: "Test" }]
              }]
            })
         
        });
           console.log(prompt)

        const data = await response.json();
        
        if (data.error) {
            resultadoDiv.textContent = `Erro: ${data.error}`;
        } else {
            console.log("logado")
               console.log(prompt)
        }

    } catch (error) {
        console.error('Erro:', error);
        resultadoDiv.textContent = 'Erro ao se comunicar com o servidor.';
    }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pergunta = document.getElementById('input-api-question').value.trim();
  if (!pergunta) return;

  try {
          const response = await fetch(url, { 
              method: 'POST',
              headers: {
                  'x-goog-api-key': `${prompt}`,
                  'Content-Type': 'application/json',
                  'keys': ''
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{ text: `${pergunta}` }]
                }]
              })
           
          });
             console.log(prompt)

    respostaInput.value = response.body.contents.parts
    respostaBox.style.display = 'block';


  // try {
  //   // Simulação de chamada à API
  //   const data = await new Promise((resolve) => {
  //     setTimeout(() => resolve({ texto: `Resposta para: ${pergunta}` }), 1000);
  //   });


  } catch (error) {
    respostaInput.value = 'Erro ao buscar resposta';
    respostaBox.style.display = 'block';
  }
});
