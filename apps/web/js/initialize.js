/**
 * Funções de inicialização do sistema
 * Responsável por carregar configurações iniciais, verificar compatibilidade do navegador,
 * e preparar o ambiente de execução
 */

// Configuração padrão do sistema
const CONFIGURACAO_PADRAO = {
  cliente: '',
  ambiente: '',
  largura: 700,
  altura: 2100,
  quantidade: 1,
  vidro: 'Incolor',
  perfil: 'Anodizado',
  corPerfil: '#666666',
  funcao: 'superiorDireita',
  
  // Configurações de dobradiças
  dobradicasNumero: 4,
  dobradicasPosicoes: [
    { distanciaTopo: 200, distanciaBase: 200 },
    { distanciaTopo: 600, distanciaBase: 600 },
    { distanciaTopo: 1200, distanciaBase: 1200 },
    { distanciaTopo: 1600, distanciaBase: 1800 }
  ],
  
  // Configurações de puxador
  puxador: {
    modelo: 'CIELO',
    posicao: 'horizontal',
    lados: 'esquerdo',
    medida: 150,
    cotaSuperior: 950,
    cotaInferior: 1000,
    deslocamento: 50
  },
  
  // Observações
  observacoes: ''
};

// Variável global para armazenar a configuração atual
let configuracaoAtual = {};

/**
 * Inicializa o sistema
 * Deve ser chamada quando a página é carregada
 */
function inicializar() {
  console.log('Inicializando sistema...');
  
  // Verifica compatibilidade do navegador
  if (!verificarCompatibilidade()) {
    // Em caso de incompatibilidade, exibe mensagem e interrompe inicialização
    alert('Seu navegador não é compatível com todas as funcionalidades. Recomendamos Chrome, Firefox ou Edge em suas versões mais recentes.');
    return false;
  }
  
  // Inicializa o armazenamento local e carrega configurações
  inicializarArmazenamento();
  
  // Define a configuração padrão
  configuracaoAtual = { ...CONFIGURACAO_PADRAO };
  
  console.log('Sistema inicializado com sucesso.');
  return true;
}

/**
 * Verifica se o navegador é compatível com as funcionalidades necessárias
 * @returns {boolean} true se o navegador é compatível, false caso contrário
 */
function verificarCompatibilidade() {
  // Verifica se o navegador suporta localStorage
  if (!window.localStorage) {
    console.error('LocalStorage não suportado');
    return false;
  }
  
  // Verifica se o navegador suporta SVG
  if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) {
    console.error('SVG não suportado');
    return false;
  }
  
  // Verifica se o navegador suporta APIs Canvas
  try {
    const canvas = document.createElement('canvas');
    if (!canvas.getContext || !canvas.getContext('2d')) {
      console.error('Canvas não suportado');
      return false;
    }
  } catch (e) {
    console.error('Erro ao verificar suporte a Canvas', e);
    return false;
  }
  
  return true;
}

/**
 * Obtém a configuração atual do sistema
 * @returns {Object} Objeto com a configuração atual
 */
function obterConfiguracaoAtual() {
  return { ...configuracaoAtual };
}

/**
 * Atualiza a configuração atual com novos valores
 * @param {Object} novaConfig - Objeto com os novos valores de configuração
 */
function atualizarConfiguracao(novaConfig) {
  // Faz uma cópia profunda para evitar referências compartilhadas
  configuracaoAtual = { ...configuracaoAtual, ...novaConfig };
  
  // Redesenha a porta com as novas configurações
  if (typeof desenharPorta === 'function') {
    desenharPorta();
  }
}