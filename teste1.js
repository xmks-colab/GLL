function searchAndDeleteKey(searchKey) {
  let data = JSON.parse(localStorage.getItem('userData')) || {};

  const result = findKeyRecursively(data, searchKey);

  if (result) {
    const keyPath = result.fullKey.split('.');
    let target = data;

    for (let i = 0; i < keyPath.length - 1; i++) {
      target = target[keyPath[i]];
    }

    const finalKey = keyPath[keyPath.length - 1];
    delete target[finalKey];

    localStorage.setItem('userData', JSON.stringify(data));
    //alert('Chave apagada com sucesso!');
  } else {
    alert('Chave não encontrada!');
  }

  displayData();
}

// Função recursiva para buscar uma chave em um objeto ou array com suporte a caminhos
function findKeyRecursively(data, searchValue, parentKey = '') {
  const searchSegments = searchValue.split('/');
  const currentSearch = searchSegments[0];

  if (typeof data !== 'object' || data === null) return null;

  for (const key in data) {
    const currentKeyPath = parentKey ? `${parentKey}.${key}` : key;

    if (key === currentSearch) {
      if (searchSegments.length === 1) {
        return { fullKey: currentKeyPath, value: data[key] };
      } else {
        const remainingPath = searchSegments.slice(1).join('/');
        const result = findKeyRecursively(data[key], remainingPath, currentKeyPath);
        if (result) return result;
      }
    }

    if (typeof data[key] === 'object') {
      const result = findKeyRecursively(data[key], searchValue, currentKeyPath);
      if (result) return result;
    }
  }

  return null;
}

// Função para exibir os dados armazenados no localStorage
function displayData() {
  const data = JSON.parse(localStorage.getItem('userData')) || {};
  document.getElementById('dataDisplay').textContent = JSON.stringify(data, null, 2);
}