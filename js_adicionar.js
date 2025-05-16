let selectedKey = null;

function addData() {
  const keyBase = document.getElementById('key').value.trim();
  const value = document.getElementById('value').value.trim();
  const defaultImageUrl = "imagemvetorial.svg";
  let description = document.getElementById('description').value.trim();
  const pageUrl = document.getElementById('pageUrl').value.trim();
  const searchValue = document.getElementById('search').value.trim();

  // Variável para evitar chamadas duplicadas
  let alreadyProcessed = false;

  // Verifica se a imagem é válida
  const img = new Image();
  img.src = value;

  img.onload = function() {
    if (!alreadyProcessed) {
      alreadyProcessed = true; // Garante que o código só será executado uma vez
      saveData(value);
    }
  };

  img.onerror = function() {
    if (!alreadyProcessed) {
      alreadyProcessed = true; // Garante que o código só será executado uma vez
      saveData(defaultImageUrl);
    }
  };

  // Se não houver valor, usa o link padrão imediatamente
  if (!value) {
    alreadyProcessed = true; // Evita chamada duplicada
    saveData(defaultImageUrl);
    return;
  }

  function saveData(imageUrl) {
    // Detectar e separar múltiplas tags
    let tags = [];
    let nome = null;

    // Processa tags com #
    description = description.replace(/#(\w+)/g, (match, capturedTag) => {
      tags.push(capturedTag);
      return '';
    }).trim();

    // Processa tags com /nome/
    description = description.replace(/\/([^/]+)\//g, (match, capturedNome) => {
      nome = capturedNome.trim();
      return '';
    }).trim();

    const tagString = tags.length > 0 ? tags.join(',') : null;

    let data = JSON.parse(localStorage.getItem('userData')) || {};

    function generateUniqueId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    if (selectedKey) {
      const keyPath = selectedKey.split('.');
      let target = data;

      for (let i = 0; i < keyPath.length - 1; i++) {
        target = target[keyPath[i]];
        if (!target) {
          alert('Erro: Caminho inválido.');
          return;
        }
      }

      const finalKey = keyPath[keyPath.length - 1];
      if (!Array.isArray(target[finalKey])) {
        alert('Erro: A chave selecionada não contém um array válido.');
        return;
      }

      if (keyBase) {
        let newSubKey = {
          [keyBase]: [{}] // Cria chave vazia por padrão
        };
        // Verifica se há campos preenchidos
        if (value || description || pageUrl || tags.length > 0 || nome) {
          newSubKey[keyBase] = [{
            id: generateUniqueId(),
            link: imageUrl,
            descricao: description || null,
            url: pageUrl || null,
            tag: tagString,
            nome: nome
          }];
        }
        target[finalKey].push(newSubKey);
      } else {
        target[finalKey].push(
          value || description || pageUrl || tags.length > 0 || nome ?
          {
            id: generateUniqueId(),
            link: imageUrl,
            descricao: description || null,
            url: pageUrl || null,
            tag: tagString,
            nome: nome
          } :
          {}
        );
      }
    } else {
      const defaultKey = searchValue || keyBase || 'default';

      if (!Array.isArray(data[defaultKey])) {
        data[defaultKey] = [];
      }

      // Adiciona objeto vazio ou com valores
      data[defaultKey].push(
        value || description || pageUrl || tags.length > 0 || nome ?
        {
          id: generateUniqueId(),
          link: imageUrl,
          descricao: description || null,
          url: pageUrl || null,
          tag: tagString,
          nome: nome
        } :
        {}
      );

    }

    localStorage.setItem('userData', JSON.stringify(data));
    // Limpa os campos de entrada
    document.getElementById('key').value = '';
    document.getElementById('value').value = '';
    document.getElementById('description').value = '';
    document.getElementById('pageUrl').value = '';

    displayData();
    updateImagePreview();
  }
}

// Função para exibir os dados armazenados no LocalStorage
function displayData() {
  const data = JSON.parse(localStorage.getItem('userData')) || {};
  document.getElementById('dataDisplay').textContent = JSON.stringify(data, null, 2);
}

// Função de busca atualizada para suportar novos caminhos
function searchKey() {
  const searchValue = document.getElementById('search').value.trim();
  const data = JSON.parse(localStorage.getItem('userData')) || {};

  // Realiza uma busca recursiva
  const result = findKeyRecursively(data, searchValue);

  if (result) {
    selectedKey = result.fullKey; // Guarda o caminho completo até a chave
    document.getElementById('search').classList.add('highlight');

    // Opcional: Exibe o valor encontrado (você pode ajustar conforme necessário)
    console.log('Valor encontrado:', result.value);
  } else {
    selectedKey = null;
    document.getElementById('search').classList.remove('highlight');
    console.log('Chave não encontrada');
  }
}

// Função recursiva para buscar uma chave em um objeto ou array com suporte a caminhos
function findKeyRecursively(data, searchValue, parentKey = '') {
  // Divide o valor de busca em segmentos
  const searchSegments = searchValue.split('/');
  const currentSearch = searchSegments[0];

  // Verifica se o dado de entrada é um objeto ou array válido
  if (typeof data !== 'object' || data === null) return null;

  for (const key in data) {
    const currentKeyPath = parentKey ? `${parentKey}.${key}` : key;

    // Verifica se a chave atual corresponde ao primeiro segmento da busca
    if (key === currentSearch) {
      // Se for o último segmento, verifica se é um objeto/array válido
      if (searchSegments.length === 1) {
  if (typeof data[key] === 'object' && data[key] !== null) {
    return { fullKey: currentKeyPath, value: data[key] };
  }
}
      // Se houver mais segmentos, continua a busca recursiva
      else {
        const remainingPath = searchSegments.slice(1).join('/');
        const result = findKeyRecursively(data[key], remainingPath, currentKeyPath);
        if (result) return result;
      }
    }

    // Continua a busca em objetos aninhados se a chave atual não corresponder
    if (typeof data[key] === 'object') {
      const result = findKeyRecursively(data[key], searchValue, currentKeyPath);
      if (result) return result;
    }
  }

  return null; // Não encontrou uma chave válida
}




// Funções para pré-visualização da imagem e reset
async function handlePreviewClick() {
  const hiddenInput = document.getElementById("hiddenInput");
  const inputField = document.getElementById("value");

  // Exibe o campo de entrada se estiver oculto
  if (hiddenInput.classList.contains("hidden")) {
    hiddenInput.classList.remove("hidden");
  }

  try {
    // Acessa o texto do clipboard
    const clipboardText = await navigator.clipboard.readText();

    // Insere o texto no campo de entrada
    inputField.value = clipboardText;

    // Atualiza a pré-visualização
    updateImagePreview();
  } catch (err) {
    console.error("Erro ao acessar o clipboard: ", err);
    alert("Não foi possível acessar o clipboard. Verifique as permissões do navegador.");
  }
}

function updateImagePreview() {
  const value = document.getElementById('value').value.trim();
  const previewImage = document.getElementById('previewImage');
  const previewContainer = document.getElementById('imagePreview');
  const errorText = "Imagem não encontrada";

  previewImage.onload = function() {
    previewImage.style.display = 'block';
    previewContainer.querySelector('span').style.display = 'none';
  };
  previewImage.onerror = function() {
    previewImage.style.display = 'none';
    previewContainer.querySelector('span').textContent = errorText;
    previewContainer.querySelector('span').style.display = 'block';
  };

  previewImage.src = value || '';
  if (!value) {
    resetImagePreview();
  }
}

function resetImagePreview() {
  const previewImage = document.getElementById('previewImage');
  const previewContainer = document.getElementById('imagePreview');

  previewImage.src = '';
  previewImage.style.display = 'none';
  previewContainer.querySelector('span').textContent = 'Imagem';
  previewContainer.querySelector('span').style.display = 'block';
}

function toggleInput() {
    const hiddenInput = document.getElementById("hiddenInput");
    if (hiddenInput.classList.contains("hidden")) {
        hiddenInput.classList.remove("hidden");
    } else {
        hiddenInput.classList.add("hidden");
    }
}

document.getElementById('value').addEventListener('input', updateImagePreview);
window.onload = displayData;
