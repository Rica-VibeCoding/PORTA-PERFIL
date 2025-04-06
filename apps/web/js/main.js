// Arquivo principal da aplicação
// Inicializa todos os componentes necessários

// Importações
// Essas importações são simuladas pois o projeto não usa módulos ES6 ainda
// Em uma versão futura, pode ser convertido para usar import/export apropriados
// As funções abaixo são declaradas em outros arquivos e estão disponíveis globalmente

/**
 * Inicializa a aplicação após o carregamento da página
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando aplicação Portas Perfis');
  
  try {
    // Inicializa componentes básicos
    inicializar();
    
    // Inicializa o canvas de desenho
    inicializarCanvas();
    
    // Carrega a última configuração salva (se existir)
    carregarUltimaConfiguracao();
    
    // Inicializa controles de UI
    inicializarControles();
    
    // Inicializa modais
    inicializarModais();
    
    // Inicializa seletor de logo
    inicializarSeletorLogo();
    
    // Configura o botão de diagnóstico para modo de desenvolvimento
    configurarBotaoDiagnostico();
    
    // Desenha a porta com a configuração atual
    desenharPorta();
    
    console.log('Aplicação inicializada com sucesso');
  } catch (erro) {
    console.error('Erro ao inicializar a aplicação:', erro);
    alert('Ocorreu um erro ao inicializar a aplicação. Verifique o console para mais detalhes.');
  }
});

/**
 * Configura o botão de diagnóstico (apenas visível em modo de desenvolvimento)
 */
function configurarBotaoDiagnostico() {
  const botaoDiagnostico = document.getElementById('diagnosticarBtn');
  
  // Exibe o botão apenas se estiver em ambiente de desenvolvimento (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    botaoDiagnostico.classList.remove('d-none');
    
    // Configura o evento de clique do botão
    botaoDiagnostico.addEventListener('click', function() {
      abrirModalDiagnostico();
    });
  }
}

/**
 * Abre o modal de diagnóstico e exibe informações para debug
 */
function abrirModalDiagnostico() {
  const modal = new bootstrap.Modal(document.getElementById('diagnosticoModal'));
  
  // Recupera as configurações atuais
  const configuracaoAtual = obterConfiguracaoAtual();
  
  // Exibe informações no modal
  document.getElementById('configAtualOutput').textContent = JSON.stringify(configuracaoAtual, null, 2);
  document.getElementById('armazenamentoOutput').textContent = JSON.stringify(obterTodasConfiguracoes(), null, 2);
  
  // Exibe informações do navegador
  const navegadorOutput = document.getElementById('navegadorOutput');
  navegadorOutput.innerHTML = `
    <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
    <p><strong>Plataforma:</strong> ${navigator.platform}</p>
    <p><strong>Idioma:</strong> ${navigator.language}</p>
    <p><strong>Cookies Habilitados:</strong> ${navigator.cookieEnabled}</p>
    <p><strong>Memória (se disponível):</strong> ${navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'Não disponível'}</p>
    <p><strong>Online:</strong> ${navigator.onLine}</p>
    <p><strong>Resolução:</strong> ${window.screen.width}x${window.screen.height}</p>
  `;
  
  // Configura o botão para limpar o localStorage
  document.getElementById('limparStorageBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja limpar todos os dados armazenados? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      alert('LocalStorage limpo com sucesso.');
      modal.hide();
      location.reload();
    }
  });
  
  // Exibe o modal
  modal.show();
}

// Exibe uma mensagem de boas vindas no console
console.log('%c🚪 Portas Perfis - Sistema de Desenho', 'font-size:14px;font-weight:bold;color:#0d6efd;');
console.log('%cDesenvolvido para Conecta Soluções', 'font-size:12px;color:#6c757d;');