/**
 * Arquivo principal da aplicação
 * Inicializa a aplicação e gerencia o estado global
 */

// Importa módulos necessários
import { inicializarStorage, salvarConfiguracao, carregarConfiguracao, excluirConfiguracao } from './storage.js';
import { desenharPorta, capturarImagemCanvas } from './drawing/index.js';

// Estado global da aplicação
const estado = {
  // Configuração atual da porta
  configuracao: {
    nome: 'Nova Porta',
    largura: 700,
    altura: 2100,
    funcao: 'superior',
    lado: 'direito',
    quantidade: 1,
    
    dobradicasNumero: 4,
    dobradicasAutomaticas: true,
    dobradicasPosicoes: [],
    
    puxador: {
      modelo: 'CIELO',
      posicao: 'horizontal',
      lados: 'esquerdo',
      medida: 150,
      cotaSuperior: 950,
      cotaInferior: 1000,
      deslocamento: 50
    }
  },
  
  // Lista de configurações salvas
  configuracoesHistorico: [],
  
  // Referências aos elementos DOM
  elementos: {
    canvas: null,
    formConfiguracao: null,
    listaConfiguracoesSalvas: null,
    botaoSalvar: null,
    botaoImprimir: null,
    botaoExportar: null,
    botaoNovaConfiguracao: null
  },
  
  // Flag para rastrear inicialização
  inicializado: false
};

/**
 * Inicializa a aplicação
 */
function inicializarApp() {
  console.log('Inicializando aplicação...');
  
  // Evita inicialização dupla
  if (estado.inicializado) {
    console.warn('Aplicação já inicializada!');
    return;
  }
  
  // Captura referências aos elementos DOM
  capturaElementosDOM();
  
  // Inicializa o sistema de storage
  inicializarStorage();
  
  // Carrega o histórico de configurações
  carregarHistoricoConfiguracoes();
  
  // Configura os listeners de eventos
  configurarEventListeners();
  
  // Inicializa a interface
  atualizarInterface();
  
  // Marca como inicializado
  estado.inicializado = true;
  
  console.log('Aplicação inicializada com sucesso!');
}

/**
 * Captura referências aos elementos DOM principais
 */
function capturaElementosDOM() {
  estado.elementos.canvas = document.getElementById('canvasPorta');
  estado.elementos.formConfiguracao = document.getElementById('formConfiguracao');
  estado.elementos.listaConfiguracoesSalvas = document.getElementById('listaConfiguracoesSalvas');
  estado.elementos.botaoSalvar = document.getElementById('botaoSalvar');
  estado.elementos.botaoImprimir = document.getElementById('botaoImprimir');
  estado.elementos.botaoExportar = document.getElementById('botaoExportar');
  estado.elementos.botaoNovaConfiguracao = document.getElementById('botaoNovaConfiguracao');
  
  // Verifica se todos os elementos foram encontrados
  const elementosNecessarios = Object.entries(estado.elementos);
  const elementosFaltantes = elementosNecessarios.filter(([nome, elemento]) => !elemento);
  
  if (elementosFaltantes.length > 0) {
    console.error('Elementos DOM faltantes:', elementosFaltantes.map(([nome]) => nome));
  }
}

/**
 * Configura os listeners de eventos para interação do usuário
 */
function configurarEventListeners() {
  // Form de configuração
  if (estado.elementos.formConfiguracao) {
    estado.elementos.formConfiguracao.addEventListener('change', handleFormChange);
    estado.elementos.formConfiguracao.addEventListener('submit', e => {
      e.preventDefault();
      salvarConfiguracaoAtual();
    });
  }
  
  // Botões de ação
  if (estado.elementos.botaoSalvar) {
    estado.elementos.botaoSalvar.addEventListener('click', salvarConfiguracaoAtual);
  }
  
  if (estado.elementos.botaoImprimir) {
    estado.elementos.botaoImprimir.addEventListener('click', imprimirDesenho);
  }
  
  if (estado.elementos.botaoExportar) {
    estado.elementos.botaoExportar.addEventListener('click', exportarDesenho);
  }
  
  if (estado.elementos.botaoNovaConfiguracao) {
    estado.elementos.botaoNovaConfiguracao.addEventListener('click', criarNovaConfiguracao);
  }
  
  // Adiciona event listener para campos de entrada numérica
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', debounce(() => {
      if (estado.elementos.formConfiguracao) {
        const event = new Event('change');
        estado.elementos.formConfiguracao.dispatchEvent(event);
      }
    }, 500));
  });
}

/**
 * Manipulador para alterações no formulário
 * @param {Event} evento - Evento de mudança
 */
function handleFormChange(evento) {
  // Captura os valores do formulário
  const formulario = evento.target.closest('form');
  if (!formulario) return;
  
  // Atualiza a configuração com os valores do formulário
  const formData = new FormData(formulario);
  
  // Processa os valores do formulário
  for (const [campo, valor] of formData.entries()) {
    // Estrutura especial para dobradiças
    if (campo.startsWith('dobradica_')) {
      const match = campo.match(/dobradica_(\d+)_(topo|base)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const tipo = match[2];
        
        // Garante que o array existe
        if (!Array.isArray(estado.configuracao.dobradicasPosicoes)) {
          estado.configuracao.dobradicasPosicoes = [];
        }
        
        // Garante que a posição existe no array
        while (estado.configuracao.dobradicasPosicoes.length <= index) {
          estado.configuracao.dobradicasPosicoes.push({
            distanciaTopo: 200,
            distanciaBase: 200
          });
        }
        
        // Atualiza o valor específico
        if (tipo === 'topo') {
          estado.configuracao.dobradicasPosicoes[index].distanciaTopo = parseInt(valor, 10);
        } else {
          estado.configuracao.dobradicasPosicoes[index].distanciaBase = parseInt(valor, 10);
        }
      }
      continue;
    }
    
    // Estrutura especial para puxador
    if (campo.startsWith('puxador_')) {
      const subCampo = campo.replace('puxador_', '');
      
      // Garante que o objeto puxador existe
      if (!estado.configuracao.puxador) {
        estado.configuracao.puxador = {};
      }
      
      // Converte valores numéricos
      if (['medida', 'cotaSuperior', 'cotaInferior', 'deslocamento'].includes(subCampo)) {
        estado.configuracao.puxador[subCampo] = parseInt(valor, 10);
      } else {
        estado.configuracao.puxador[subCampo] = valor;
      }
      continue;
    }
    
    // Campos numéricos regulares
    if (['largura', 'altura', 'quantidade', 'dobradicasNumero'].includes(campo)) {
      estado.configuracao[campo] = parseInt(valor, 10);
    } else if (campo === 'dobradicasAutomaticas') {
      estado.configuracao[campo] = valor === 'on';
    } else {
      estado.configuracao[campo] = valor;
    }
  }
  
  // Valida a configuração
  estado.configuracao = validarConfiguracao(estado.configuracao);
  
  // Atualiza a interface
  atualizarInterface();
}

/**
 * Atualiza a interface com a configuração atual
 */
function atualizarInterface() {
  // Atualiza o desenho
  renderizarDesenho();
  
  // Atualiza o formulário com valores da configuração atual
  atualizarFormulario();
  
  // Atualiza a lista de configurações salvas
  atualizarListaConfiguracoes();
}

/**
 * Renderiza o desenho da porta com a configuração atual
 */
function renderizarDesenho() {
  if (!estado.elementos.canvas) return;
  
  // Chama a função de desenho
  desenharPorta(estado.elementos.canvas, estado.configuracao);
}

/**
 * Atualiza o formulário com os valores da configuração atual
 */
function atualizarFormulario() {
  const form = estado.elementos.formConfiguracao;
  if (!form) return;
  
  // Atualiza campos simples
  for (const [chave, valor] of Object.entries(estado.configuracao)) {
    // Pula campos complexos
    if (['dobradicasPosicoes', 'puxador'].includes(chave)) continue;
    
    const campo = form.elements[chave];
    if (campo) {
      if (campo.type === 'checkbox') {
        campo.checked = valor;
      } else {
        campo.value = valor;
      }
    }
  }
  
  // Atualiza campos de puxador
  if (estado.configuracao.puxador) {
    for (const [chave, valor] of Object.entries(estado.configuracao.puxador)) {
      const campo = form.elements[`puxador_${chave}`];
      if (campo) {
        campo.value = valor;
      }
    }
  }
  
  // Atualiza campos de dobradiças
  if (Array.isArray(estado.configuracao.dobradicasPosicoes)) {
    estado.configuracao.dobradicasPosicoes.forEach((pos, index) => {
      const campoTopo = form.elements[`dobradica_${index}_topo`];
      const campoBase = form.elements[`dobradica_${index}_base`];
      
      if (campoTopo) {
        campoTopo.value = pos.distanciaTopo;
      }
      
      if (campoBase) {
        campoBase.value = pos.distanciaBase;
      }
    });
  }
  
  // Ajusta a visibilidade dos campos de dobradiças
  atualizarCamposDobradicasVisibilidade();
}

/**
 * Atualiza a visibilidade dos campos de dobradiças no formulário
 */
function atualizarCamposDobradicasVisibilidade() {
  const form = estado.elementos.formConfiguracao;
  if (!form) return;
  
  // Obtém o número de dobradiças e se são automáticas
  const numDobradicasEl = form.elements['dobradicasNumero'];
  const dobradicasAutomaticasEl = form.elements['dobradicasAutomaticas'];
  
  if (!numDobradicasEl) return;
  
  const numDobradicasAtual = parseInt(numDobradicasEl.value, 10);
  const dobradicasAutomaticas = dobradicasAutomaticasEl && dobradicasAutomaticasEl.checked;
  
  // Esconde todos os campos de dobradiças primeiro
  const containerDobradicasManuais = document.getElementById('dobradicasManuais');
  if (containerDobradicasManuais) {
    if (dobradicasAutomaticas) {
      containerDobradicasManuais.classList.add('hidden');
    } else {
      containerDobradicasManuais.classList.remove('hidden');
    }
  }
  
  // Mostra apenas os campos para o número atual de dobradiças
  for (let i = 0; i < 10; i++) {
    const container = document.getElementById(`dobradica_${i}_container`);
    if (container) {
      container.style.display = i < numDobradicasAtual ? 'block' : 'none';
    }
  }
}

/**
 * Atualiza a lista de configurações salvas
 */
function atualizarListaConfiguracoes() {
  const lista = estado.elementos.listaConfiguracoesSalvas;
  if (!lista) return;
  
  // Limpa a lista
  lista.innerHTML = '';
  
  // Adiciona cada configuração à lista
  estado.configuracoesHistorico.forEach(config => {
    const item = document.createElement('div');
    item.className = 'configuracao-item';
    
    // Cria conteúdo do item
    item.innerHTML = `
      <div class="info">
        <h4>${config.nome || 'Sem nome'}</h4>
        <p>Última modificação: ${formatarData(config.dataModificacao)}</p>
        <p>Dimensões: ${config.largura}mm x ${config.altura}mm</p>
      </div>
      <div class="acoes">
        <button class="carregar">Carregar</button>
        <button class="excluir">Excluir</button>
      </div>
    `;
    
    // Adiciona listeners
    item.querySelector('.carregar').addEventListener('click', () => {
      carregarConfiguracao(config.id).then(configuracaoCarregada => {
        estado.configuracao = configuracaoCarregada;
        atualizarInterface();
      });
    });
    
    item.querySelector('.excluir').addEventListener('click', () => {
      if (confirm(`Deseja realmente excluir a configuração "${config.nome}"?`)) {
        excluirConfiguracao(config.id).then(() => {
          carregarHistoricoConfiguracoes();
        });
      }
    });
    
    // Adiciona o item à lista
    lista.appendChild(item);
  });
  
  // Se não houver configurações salvas, mostra mensagem
  if (estado.configuracoesHistorico.length === 0) {
    lista.innerHTML = '<p class="sem-configuracoes">Nenhuma configuração salva.</p>';
  }
}

/**
 * Carrega a lista de configurações salvas
 */
function carregarHistoricoConfiguracoes() {
  // Obtém a lista de configurações do storage
  const configuracoesSalvas = JSON.parse(localStorage.getItem('configuracoes') || '[]');
  
  // Atualiza o estado
  estado.configuracoesHistorico = configuracoesSalvas;
  
  // Atualiza a UI
  atualizarListaConfiguracoes();
}

/**
 * Salva a configuração atual
 */
function salvarConfiguracaoAtual() {
  // Solicita um nome se for a primeira vez
  if (!estado.configuracao.id) {
    const nome = prompt('Digite um nome para sua configuração:', estado.configuracao.nome);
    if (nome) {
      estado.configuracao.nome = nome;
    } else {
      return; // Cancelou o salvamento
    }
  }
  
  // Salva a configuração
  salvarConfiguracao(estado.configuracao).then(configuracaoSalva => {
    estado.configuracao = configuracaoSalva;
    carregarHistoricoConfiguracoes();
    alert('Configuração salva com sucesso!');
  });
}

/**
 * Exporta o desenho atual como imagem
 */
function exportarDesenho() {
  if (!estado.elementos.canvas) return;
  
  capturarImagemCanvas(estado.elementos.canvas)
    .then(imagemURL => {
      // Cria um link para download
      const link = document.createElement('a');
      link.download = `Porta_${estado.configuracao.nome.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = imagemURL;
      link.click();
    })
    .catch(erro => {
      console.error('Erro ao exportar imagem:', erro);
      alert('Erro ao exportar a imagem. Verifique o console para mais detalhes.');
    });
}

/**
 * Imprime o desenho atual
 */
function imprimirDesenho() {
  if (!estado.elementos.canvas) return;
  
  capturarImagemCanvas(estado.elementos.canvas)
    .then(imagemURL => {
      // Cria uma nova janela com a imagem
      const janelaImpressao = window.open('', '_blank');
      
      if (!janelaImpressao) {
        alert('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.');
        return;
      }
      
      // Cria conteúdo HTML para impressão
      janelaImpressao.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Impressão - ${estado.configuracao.nome}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .info {
              margin-bottom: 20px;
            }
            h1 {
              font-size: 18px;
              margin: 0 0 10px 0;
            }
            p {
              margin: 5px 0;
              font-size: 14px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              @page {
                size: A4;
                margin: 10mm;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="info">
            <h1>${estado.configuracao.nome}</h1>
            <p>Dimensões: ${estado.configuracao.largura}mm x ${estado.configuracao.altura}mm</p>
            <p>Função: ${estado.configuracao.funcao}</p>
            <p>Lado: ${estado.configuracao.lado}</p>
            <p>Quantidade: ${estado.configuracao.quantidade}</p>
            <p>Data: ${new Date().toLocaleDateString()}</p>
          </div>
          <img src="${imagemURL}" alt="Desenho da porta" />
          <div style="margin-top: 20px">
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Fechar</button>
          </div>
          <script>
            // Tenta imprimir automaticamente
            setTimeout(() => window.print(), 500);
          </script>
        </body>
        </html>
      `);
      
      janelaImpressao.document.close();
    })
    .catch(erro => {
      console.error('Erro ao preparar impressão:', erro);
      alert('Erro ao preparar impressão. Verifique o console para mais detalhes.');
    });
}

/**
 * Cria uma nova configuração do zero
 */
function criarNovaConfiguracao() {
  if (confirm('Deseja criar uma nova configuração? Os dados não salvos serão perdidos.')) {
    // Restaura a configuração para os valores padrão
    estado.configuracao = {
      nome: 'Nova Porta',
      largura: 700,
      altura: 2100,
      funcao: 'superior',
      lado: 'direito',
      quantidade: 1,
      
      dobradicasNumero: 4,
      dobradicasAutomaticas: true,
      dobradicasPosicoes: [],
      
      puxador: {
        modelo: 'CIELO',
        posicao: 'horizontal',
        lados: 'esquerdo',
        medida: 150,
        cotaSuperior: 950,
        cotaInferior: 1000,
        deslocamento: 50
      }
    };
    
    // Atualiza a interface
    atualizarInterface();
  }
}

// Exporta funções e variáveis para uso em outros módulos
export {
  inicializarApp,
  estado,
  renderizarDesenho,
  salvarConfiguracaoAtual,
  exportarDesenho,
  imprimirDesenho
};

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarApp);