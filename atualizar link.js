// Função universal para manipular ID (com nome diferente)
function processarId(id, callback) {
  if (!id) {
    alert('ID inválido.');
    return;
  }
  
  console.log('ID processado:', id);
  
  if (typeof callback === 'function') {
    callback(id);
  }
}

// Função para buscar item pelo ID e atualizar o link
function atualizarLinkPorId(id) {
  processarId(id, (idValido) => {
    const dados = JSON.parse(localStorage.getItem('userData')) || {};
    const itemEncontrado = buscarItem(dados, idValido);
    
    if (itemEncontrado) {
      console.log('Item encontrado:', itemEncontrado);
      obterConteudoClipboard((conteudoClipboard) => {
        atualizarLinkItem(dados, idValido, conteudoClipboard);
      });
    } else {
      alert('ID não encontrado nos dados.');
    }
  });
}

// Função recursiva para buscar item pelo ID
function buscarItem(dados, id) {
  if (Array.isArray(dados)) {
    for (const item of dados) {
      if (item.id === id) return item;
      if (typeof item === 'object') {
        const resultado = buscarItem(item, id);
        if (resultado) return resultado;
      }
    }
  } else if (typeof dados === 'object') {
    for (const chave in dados) {
      const resultado = buscarItem(dados[chave], id);
      if (resultado) return resultado;
    }
  }
  return null;
}

// Função para acessar o clipboard
async function obterConteudoClipboard(callback) {
  try {
    const texto = await navigator.clipboard.readText();
    
    if (!texto) {
      alert('A área de transferência está vazia. Copie o link antes de continuar.');
      return;
    }
    
    if (typeof callback === 'function') {
      callback(texto);
    }
  } catch (erro) {
    alert('Erro ao acessar a área de transferência. Verifique as permissões.');
    console.error('Erro no clipboard:', erro);
  }
}

// Função para atualizar o link de um item
function atualizarLinkItem(dados, id, novoLink) {
  function atualizarItem(dados) {
    if (Array.isArray(dados)) {
      for (const item of dados) {
        if (item.id === id) {
          item.link = novoLink;
          return true;
        }
        if (typeof item === 'object') {
          const atualizado = atualizarItem(item);
          if (atualizado) return atualizado;
        }
      }
    } else if (typeof dados === 'object') {
      for (const chave in dados) {
        const atualizado = atualizarItem(dados[chave]);
        if (atualizado) return atualizado;
      }
    }
    return false;
  }
  
  const atualizado = atualizarItem(dados);
  
  if (atualizado) {
    localStorage.setItem('userData', JSON.stringify(dados));
    alert('Link atualizado com sucesso!');
    refreshData();
  } else {
    alert('Falha ao atualizar o link. Verifique o ID.');
  }
}