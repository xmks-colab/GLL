// Função universal para manipular ID
function handleIdForDeletion(id, callback) {
  if (!id) {
    alert('ID inválido.');
    return;
  }

  // Log do ID recebido
  console.log('ID recebido para remoção:', id);

  // Chama o callback com o ID, se fornecido
  if (typeof callback === 'function') {
    callback(id);
  }
}

// Função para deletar item pelo ID
function deleteItemById(id) {
  handleIdForDeletion(id, (validId) => {
    let data = JSON.parse(localStorage.getItem('userData')) || {};
    const deleted = removeItemById(data, validId);

    if (deleted) {
      localStorage.setItem('userData', JSON.stringify(data));
     // alert('Bloco removido com sucesso!');
    } else {
      alert('ID não encontrado. Nenhum bloco foi removido.');
    }
  });
}

// Função recursiva para buscar e remover item pelo ID
function removeItemById(data, id) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data.splice(i, 1); // Remove o bloco pelo índice
        return true;
      }
      if (typeof data[i] === 'object') {
        const removed = removeItemById(data[i], id);
        if (removed) return removed;
      }
    }
  } else if (typeof data === 'object') {
    for (const key in data) {
      if (removeItemById(data[key], id)) {
        return true;
      }
    }
  }
  return false;
}