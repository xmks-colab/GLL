// Seleciona os inputs pelo ID
const pageUrlInput = document.getElementById('pageUrl');
const descriptionInput = document.getElementById('description');

// Adiciona um evento ao input do link
pageUrlInput.addEventListener('change', () => {
  const link = pageUrlInput.value; // Obtém o valor do input
  if (link) {
    const nome = extrairTituloDeLink(link); // Obtém o nome do link
    if (nome) {
      descriptionInput.value = `/${nome}/`; // Atualiza o campo de descrição com o nome
    }
  }
});

// Função para extrair o título de um link (exemplo)
function extrairTituloDeLink(link) {
  console.log(`Extraindo título do link: ${link}`);

  // Lógica fictícia para extrair o nome (você pode implementar o necessário)
  const nome = "ExemploDeNome"; // Aqui você coloca a lógica de extração real
  return nome;
}