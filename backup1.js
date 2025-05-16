// Função para baixar os dados salvos como arquivo JSON
function baixarBackup() {
  const userData = localStorage.getItem('userData'); // Dados do seu projeto atual
  if (!userData) {
    alert('Nenhum dado disponível para salvar.');
    return;
  }
  const blob = new Blob([userData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'backup_userData.json'; // Nome do arquivo para salvar
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Função para restaurar os dados a partir de um arquivo JSON
function restaurarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const dadosRestaurados = JSON.parse(e.target.result);
      localStorage.setItem('userData', JSON.stringify(dadosRestaurados));
      alert('Backup restaurado com sucesso. Atualize a página!');
      displayData(); // Atualiza a exibição dos dados no seu projeto atual
    } catch (error) {
      //alert('Erro ao restaurar o backup: Arquivo inválido.');
    }
  };
  reader.readAsText(file);
}

// Configuração dos botões
document.getElementById('backup-btn').addEventListener('click', baixarBackup);

const inputFile = document.createElement('input');
inputFile.type = 'file';
inputFile.accept = 'application/json';
inputFile.style.display = 'none';
document.body.appendChild(inputFile);

// Abre o seletor de arquivos para restaurar
document.getElementById('restore-btn').addEventListener('click', function() {
  inputFile.click();
});

// Associa o evento de mudança de arquivo à função de restauração
inputFile.addEventListener('change', restaurarBackup);