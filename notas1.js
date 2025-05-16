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

// Função para buscar itens no localStorage e adicionar texto à descrição
function searchItemByIdAndUpdate(id, texto) {
  handleId(id, (validId) => {
    const data = JSON.parse(localStorage.getItem('userData')) || {};
    const foundItem = findItem(data, validId);

    if (foundItem) {
      console.log('Item encontrado:', foundItem);
      updateItemDescricao(data, validId, texto);
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

// Função para atualizar a descrição de um item no localStorage
function updateItemDescricao(data, id, texto) {
  function updateItem(data) {
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.id === id) {
          // Substitui o texto existente na descrição pelo novo
          item.descricao = texto;
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
    alert('Descrição atualizada com sucesso!');
  } else {
    alert('Erro ao atualizar a descrição. Tente novamente.');
  }
}