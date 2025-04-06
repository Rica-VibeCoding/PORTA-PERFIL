/**
 * Módulo de armazenamento de dados
 * Gerencia o armazenamento e recuperação de configurações de portas
 * utilizando o localStorage do navegador
 */

// Chave usada para armazenar as configurações no localStorage
const STORAGE_KEY = 'portasPerfisConfiguracoes';

// Chave para armazenar a última configuração usada
const LAST_CONFIG_KEY = 'portasPerfisUltimaConfiguracao';

/**
 * Inicializa o sistema de armazenamento
 * Verifica se já existem configurações salvas e prepara o storage
 */
function inicializarArmazenamento() {
  // Verifica se o localStorage está disponível
  if (!window.localStorage) {
    console.error('LocalStorage não disponível no navegador');
    return false;
  }
  
  // Verifica se já existe um registro de configurações
  if (!localStorage.getItem(STORAGE_KEY)) {
    // Se não existe, cria um array vazio
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
  
  console.log('Sistema de armazenamento inicializado');
  return true;
}

/**
 * Obtém todas as configurações salvas
 * @returns {Array} Array de objetos de configuração
 */
function obterTodasConfiguracoes() {
  try {
    const configuracoesSalvas = localStorage.getItem(STORAGE_KEY);
    if (!configuracoesSalvas) {
      return [];
    }
    
    return JSON.parse(configuracoesSalvas);
  } catch (erro) {
    console.error('Erro ao obter configurações:', erro);
    return [];
  }
}

/**
 * Salva uma nova configuração
 * @param {Object} configuracao - A configuração a ser salva
 * @param {string} nome - Nome da configuração
 * @returns {boolean} true se salvou com sucesso, false caso contrário
 */
function salvarConfiguracao(configuracao, nome) {
  if (!configuracao || !nome) {
    console.error('Configuração ou nome inválidos');
    return false;
  }
  
  try {
    // Obtém as configurações existentes
    const configuracoes = obterTodasConfiguracoes();
    
    // Verifica se já existe uma configuração com este nome
    const indiceExistente = configuracoes.findIndex(c => c.nome === nome);
    
    // Prepara o objeto a ser salvo com timestamp
    const configParaSalvar = {
      ...configuracao,
      nome: nome,
      dataCriacao: new Date().toISOString()
    };
    
    // Atualiza ou adiciona a nova configuração
    if (indiceExistente >= 0) {
      configuracoes[indiceExistente] = configParaSalvar;
    } else {
      configuracoes.push(configParaSalvar);
    }
    
    // Salva no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configuracoes));
    
    // Salva também como última configuração usada
    localStorage.setItem(LAST_CONFIG_KEY, JSON.stringify(configParaSalvar));
    
    console.log(`Configuração "${nome}" salva com sucesso`);
    return true;
  } catch (erro) {
    console.error('Erro ao salvar configuração:', erro);
    return false;
  }
}

/**
 * Carrega uma configuração específica pelo nome
 * @param {string} nome - Nome da configuração a ser carregada
 * @returns {Object|null} A configuração carregada ou null se não encontrada
 */
function carregarConfiguracao(nome) {
  try {
    const configuracoes = obterTodasConfiguracoes();
    const configuracao = configuracoes.find(c => c.nome === nome);
    
    if (!configuracao) {
      console.warn(`Configuração "${nome}" não encontrada`);
      return null;
    }
    
    // Salva como última configuração usada
    localStorage.setItem(LAST_CONFIG_KEY, JSON.stringify(configuracao));
    
    // Atualiza a configuração atual
    atualizarConfiguracao(configuracao);
    
    console.log(`Configuração "${nome}" carregada com sucesso`);
    return configuracao;
  } catch (erro) {
    console.error('Erro ao carregar configuração:', erro);
    return null;
  }
}

/**
 * Exclui uma configuração pelo nome
 * @param {string} nome - Nome da configuração a ser excluída
 * @returns {boolean} true se excluiu com sucesso, false caso contrário
 */
function excluirConfiguracao(nome) {
  try {
    let configuracoes = obterTodasConfiguracoes();
    const indiceParaExcluir = configuracoes.findIndex(c => c.nome === nome);
    
    if (indiceParaExcluir < 0) {
      console.warn(`Configuração "${nome}" não encontrada para exclusão`);
      return false;
    }
    
    // Remove a configuração do array
    configuracoes.splice(indiceParaExcluir, 1);
    
    // Salva o array atualizado
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configuracoes));
    
    console.log(`Configuração "${nome}" excluída com sucesso`);
    return true;
  } catch (erro) {
    console.error('Erro ao excluir configuração:', erro);
    return false;
  }
}

/**
 * Carrega a última configuração utilizada
 * @returns {Object|null} A última configuração ou null se não encontrada
 */
function carregarUltimaConfiguracao() {
  try {
    const ultimaConfig = localStorage.getItem(LAST_CONFIG_KEY);
    
    if (!ultimaConfig) {
      console.log('Nenhuma configuração anterior encontrada');
      return null;
    }
    
    const config = JSON.parse(ultimaConfig);
    
    // Atualiza a configuração atual
    atualizarConfiguracao(config);
    
    console.log('Última configuração carregada com sucesso');
    return config;
  } catch (erro) {
    console.error('Erro ao carregar última configuração:', erro);
    return null;
  }
}