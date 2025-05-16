function moveBlock(blockId, newListName) {
  if (!blockId || !newListName) {
    console.error("Caminho inválido!😒");
    return null; // Retorna null em caso de erro
  }
  
  let data = JSON.parse(localStorage.getItem("userData")) || {};
  let foundBlock = null;
  let parentArray = null;
  let blockIndex = -1;
  
  // Função recursiva para encontrar e remover o bloco pelo ID
  function findAndRemoveBlock(obj) {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] && obj[i].id === blockId) {
          foundBlock = obj[i];
          parentArray = obj;
          blockIndex = i;
          return true;
        } else if (typeof obj[i] === "object" && obj[i] !== null) {
          if (findAndRemoveBlock(obj[i])) return true;
        }
      }
    } else if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        if (findAndRemoveBlock(obj[key])) return true;
      }
    }
    return false;
  }
  
  // Função recursiva para encontrar a lista de destino
  function findList(obj) {
    if (Array.isArray(obj)) {
      for (let item of obj) {
        if (typeof item === "object" && item !== null) {
          let found = findList(item);
          if (found) return found;
        }
      }
    } else if (typeof obj === "object" && obj !== null) {
      if (obj[newListName] && Array.isArray(obj[newListName])) {
        return obj[newListName];
      }
      for (const key in obj) {
        let found = findList(obj[key]);
        if (found) return found;
      }
    }
    return null;
  }
  
  if (!findAndRemoveBlock(data)) {
    console.error("Bloco não encontrado.");
    return null; // Retorna null se o bloco não for encontrado
  }
  
  if (foundBlock && parentArray && blockIndex !== -1) {
    parentArray.splice(blockIndex, 1);
  }
  
  let targetList = findList(data);
  
  if (!targetList) {
    console.error("Lista de destino não encontrada dentro da estrutura.");
    return null; // Retorna null se a lista de destino não for encontrada
  }
  
  targetList.push(foundBlock);
  localStorage.setItem("userData", JSON.stringify(data));
  
  console.log("Bloco movido com sucesso!");
  return data; // Retorna os dados atualizados
}

// Função para exibir os dados no console (opcional)
/*function displayData() {
  const data = JSON.parse(localStorage.getItem("userData")) || {};
  console.log("Dados no LocalStorage:", JSON.stringify(data, null, 2));
}*/

// Exemplo de uso
const updatedData = moveBlock("123", "novaLista");
if (updatedData) {
  console.log("Dados atualizados:", updatedData);
}

// Exibir dados no console (opcional)
displayData();