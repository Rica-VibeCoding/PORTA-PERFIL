/**
 * Utilitários gerais da aplicação
 * Funções auxiliares usadas em diferentes partes do sistema
 */

/**
 * Debounce - Limita a frequência de execução de uma função
 * @param {Function} func - Função a ser executada após o debounce
 * @param {number} wait - Tempo de espera em milissegundos
 * @returns {Function} Função com debounce aplicado
 */
function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Formata data em formato ISO para exibição
 * @param {string} dataIso - Data em formato ISO
 * @returns {string} Data formatada
 */
function formatarData(dataIso) {
  if (!dataIso) {
    return '';
  }
  
  try {
    const data = new Date(dataIso);
    
    // Formata para DD/MM/YYYY HH:MM
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  } catch (erro) {
    console.error('Erro ao formatar data:', erro);
    return '';
  }
}

/**
 * Gera um ID único para identificação de elementos
 * @param {string} [prefixo='id'] - Prefixo para o ID
 * @returns {string} ID único
 */
function gerarId(prefixo = 'id') {
  return `${prefixo}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

/**
 * Faz o download de um arquivo
 * @param {string} conteudo - Conteúdo do arquivo
 * @param {string} nomeArquivo - Nome do arquivo para download
 * @param {string} [tipo='text/plain'] - Tipo MIME do arquivo
 */
function downloadArquivo(conteudo, nomeArquivo, tipo = 'text/plain') {
  // Cria um elemento de link para download
  const element = document.createElement('a');
  
  // Cria um blob com o conteúdo
  const blob = new Blob([conteudo], { type: tipo });
  
  // Cria uma URL para o blob
  const url = URL.createObjectURL(blob);
  
  // Configura o elemento de link
  element.setAttribute('href', url);
  element.setAttribute('download', nomeArquivo);
  element.style.display = 'none';
  
  // Adiciona o link ao documento
  document.body.appendChild(element);
  
  // Simula um clique no link
  element.click();
  
  // Remove o link do documento
  document.body.removeChild(element);
  
  // Revoga a URL para liberar memória
  URL.revokeObjectURL(url);
}

/**
 * Valida um objeto de configuração para garantir que todos os valores estão dentro dos limites
 * @param {Object} config - Configuração a ser validada
 * @returns {Object} Configuração validada
 */
function validarConfiguracao(config) {
  // Cria uma cópia para não alterar o original
  const configValidada = { ...config };
  
  // Validação de dimensões
  configValidada.largura = validarNumero(config.largura, 150, 2000, 700);
  configValidada.altura = validarNumero(config.altura, 300, 3000, 2100);
  configValidada.quantidade = validarNumero(config.quantidade, 1, 100, 1);
  
  // Validação de dobradiças
  configValidada.dobradicasNumero = validarNumero(config.dobradicasNumero, 0, 10, 4);
  
  // Garante que o array de posições das dobradiças existe
  if (!Array.isArray(configValidada.dobradicasPosicoes)) {
    configValidada.dobradicasPosicoes = [];
  }
  
  // Ajusta o tamanho do array de posições para corresponder ao número de dobradiças
  while (configValidada.dobradicasPosicoes.length < configValidada.dobradicasNumero) {
    configValidada.dobradicasPosicoes.push({
      distanciaTopo: 200 + configValidada.dobradicasPosicoes.length * 400,
      distanciaBase: 200 + configValidada.dobradicasPosicoes.length * 400
    });
  }
  
  // Trunca o array se necessário
  if (configValidada.dobradicasPosicoes.length > configValidada.dobradicasNumero) {
    configValidada.dobradicasPosicoes = configValidada.dobradicasPosicoes.slice(0, configValidada.dobradicasNumero);
  }
  
  // Garante que existe um objeto de puxador
  if (!configValidada.puxador || typeof configValidada.puxador !== 'object') {
    configValidada.puxador = {};
  }
  
  // Define valores padrão para o puxador se não existirem
  configValidada.puxador.modelo = configValidada.puxador.modelo || 'CIELO';
  configValidada.puxador.posicao = configValidada.puxador.posicao || 'horizontal';
  configValidada.puxador.lados = configValidada.puxador.lados || 'esquerdo';
  configValidada.puxador.medida = validarNumero(configValidada.puxador.medida, 100, 1000, 150);
  configValidada.puxador.cotaSuperior = validarNumero(configValidada.puxador.cotaSuperior, 0, 3000, 950);
  configValidada.puxador.cotaInferior = validarNumero(configValidada.puxador.cotaInferior, 0, 3000, 1000);
  configValidada.puxador.deslocamento = validarNumero(configValidada.puxador.deslocamento, 0, 2000, 50);
  
  return configValidada;
}

/**
 * Valida um número para garantir que está dentro dos limites
 * @param {number} valor - Valor a ser validado
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {number} padrao - Valor padrão caso esteja fora dos limites
 * @returns {number} Valor validado
 */
function validarNumero(valor, min, max, padrao) {
  // Converte para número se for string
  valor = Number(valor);
  
  // Verifica se é um número válido
  if (isNaN(valor)) {
    return padrao;
  }
  
  // Aplica limites
  return Math.max(min, Math.min(max, valor));
}