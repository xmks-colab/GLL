window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data || event.data.type !== "MFC_FAVORITOS_RECEBIDOS") return;
  
  const favoritos = event.data.favoritos;
  if (!Array.isArray(favoritos)) return;
  
  // Carrega o conteúdo atual de userData ou cria um novo objeto
  let userData = {};
  try {
    userData = JSON.parse(localStorage.getItem("userData")) || {};
  } catch {
    userData = {};
  }
  
  // Garante que 'default' é um array
  if (!Array.isArray(userData.default)) {
    userData.default = [];
  }
  
  // Cria um Set com as URLs já existentes para evitar duplicatas
  const urlsExistentes = new Set(userData.default.map(item => item.url));
  
  // Filtra apenas os itens com URLs que ainda não existem
  const novosItens = favoritos
    .filter(fav => fav.link && !urlsExistentes.has(fav.link))
    .map(fav => ({
      id: "m" + Math.random().toString(36).slice(2, 18),
      nome: fav.titulo || null,
      link: fav.imagem || "https://placehold.co/600x400/png", // Fallback para placeholder
      url: fav.link || null,
      descricao: null,
      tag: null
    }));
  
  // Adiciona os novos itens em userData.default
  userData.default.push(...novosItens);
  
  // Salva de volta no localStorage
  localStorage.setItem("userData", JSON.stringify(userData));
  
  // Notifica que os favoritos foram processados
  window.postMessage({
    type: "MFC_FAVORITOS_PROCESSADOS",
    favoritosIDs: favoritos.map(fav => fav.link)
  }, "*");
  
  console.log("Novos itens adicionados em userData.default!");
  refreshData();
});


