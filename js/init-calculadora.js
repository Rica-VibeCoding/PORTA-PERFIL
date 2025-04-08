/**
 * Script de inicialização para a calculadora de materiais
 * Este arquivo deve ser incluído após o carregamento do DOM
 */

// Importar módulos necessários
import { inicializarCalculadoraMateriais } from './calculadora-handler.js';

// Executar inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando módulos da calculadora de materiais...');
  
  try {
    // Verificar se o elemento da calculadora existe no DOM
    if (document.querySelector('.calculadora-materiais')) {
      inicializarCalculadoraMateriais();
      console.log('Calculadora de materiais inicializada com sucesso.');
    } else {
      console.log('Componente da calculadora de materiais não encontrado no DOM.');
    }
  } catch (error) {
    console.error('Erro ao inicializar calculadora de materiais:', error);
  }
});

// Exportar as funções de inicialização para uso externo
export {
  inicializarCalculadoraMateriais
};