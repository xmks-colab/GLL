// Função universal para manipular ID
function handleId(id, callback) {
  if (!id) {
    alert('ID inválido.');
    return;
  }

  // Ações com o ID (pode ser expandido conforme necessário)
  console.log('ID recebido:', id);

  // Chama o callback com o ID, se fornecido
  if (typeof callback === 'function') {
    callback(id);
  }
}

// Função de exemplo que utiliza handleId para buscar itens no localStorage
function findItemById(id) {
  handleId(id, (validId) => {
    const data = JSON.parse(localStorage.getItem('userData')) || {};
    const foundItem = findItem(data, validId);

    if (foundItem) {
      console.log('Item encontrado:', foundItem);
      getClipboardContent((clipboardContent) => {
        updateItemUrl(data, validId, clipboardContent);
      });
    } else {
      alert('ID não encontrado.');
    }
  });
}

// Função recursiva para buscar um item pelo ID
function findItem(data, id) {
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.id === id) return item;
      if (typeof item === 'object') {
        const result = findItem(item, id);
        if (result) return result;
      }
    }
  } else if (typeof data === 'object') {
    for (const key in data) {
      const result = findItem(data[key], id);
      if (result) return result;
    }
  }
  return null;
}

// Função para acessar o clipboard
async function getClipboardContent(callback) {
  try {
    const text = await navigator.clipboard.readText();

    if (!text) {
      alert('O conteúdo do clipboard está vazio. Copie algo antes de continuar.');
      return;
    }

    if (typeof callback === 'function') {
      callback(text);
    }
  } catch (err) {
    alert('Erro ao acessar o clipboard. Verifique as permissões.');
  }
}

// Função para atualizar a URL de um item no localStorage
function updateItemUrl(data, id, url) {
  function updateItem(data) {
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.id === id) {
          item.url = url;
          return true;
        }
        if (typeof item === 'object') {
          const updated = updateItem(item);
          if (updated) return updated;
        }
      }
    } else if (typeof data === 'object') {
      for (const key in data) {
        const updated = updateItem(data[key]);
        if (updated) return updated;
      }
    }
    return false;
  }

  const updated = updateItem(data);

  if (updated) {
    localStorage.setItem('userData', JSON.stringify(data));
    alert('URL salva automaticamente com sucesso!');
    refreshData();
  } else {
    alert('Erro ao atualizar a URL. Tente novamente.');
  }
}