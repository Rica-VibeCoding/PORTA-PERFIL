/**
 * Handler para a calculadora de materiais
 * Integra o componente HTML com as funções de cálculo
 */

import { gerarRelatorioMateriais } from './calculo-materiais.js';
import { formatarMoeda } from './utils.js';

/**
 * Inicializa a calculadora de materiais
 */
export function inicializarCalculadoraMateriais() {
  // Eventos
  document.getElementById('calcularMateriaisBtn')?.addEventListener('click', calcularMateriais);
  document.getElementById('limparCalculadoraBtn')?.addEventListener('click', limparCalculadora);
  document.getElementById('imprimirResultadoBtn')?.addEventListener('click', imprimirResultado);
  document.getElementById('exportarPdfBtn')?.addEventListener('click', exportarPDF);
  
  // Configuração inicial
  configurarValidacao();
}

/**
 * Realiza o cálculo de materiais com base nos valores do formulário
 */
function calcularMateriais() {
  // Verifica se o formulário é válido
  const form = document.getElementById('calculadoraMateriaisForm');
  if (!validarFormulario(form)) {
    mostrarNotificacao('Por favor, corrija os erros no formulário.', 'error');
    return;
  }
  
  // Obtém valores do formulário
  const dimensoes = {
    largura: parseFloat(document.getElementById('larguraPortao').value),
    altura: parseFloat(document.getElementById('alturaPortao').value),
    espessuraPerfil: parseFloat(document.getElementById('espessuraPerfil').value)
  };
  
  const precos = {
    perfilPorMetro: parseFloat(document.getElementById('precoPerfilMetro').value),
    parafusoPorUnidade: parseFloat(document.getElementById('precoParafusoUnidade').value),
    dobradicaPorUnidade: parseFloat(document.getElementById('precoDobradicaUnidade').value),
    fechaduraPorUnidade: parseFloat(document.getElementById('precoFechaduraUnidade').value),
    pesoPorMetro: parseFloat(document.getElementById('pesoPorMetro').value)
  };
  
  // Gera relatório de materiais
  const relatorio = gerarRelatorioMateriais(dimensoes, precos);
  
  // Exibe os resultados
  exibirResultados(relatorio);
}

/**
 * Valida o formulário da calculadora
 * @param {HTMLFormElement} form - Formulário a ser validado
 * @returns {boolean} - Indica se o formulário é válido
 */
function validarFormulario(form) {
  let valido = true;
  
  // Validar todos os campos numéricos
  const camposNumericos = form.querySelectorAll('input[type="number"]');
  
  camposNumericos.forEach(campo => {
    const valor = parseFloat(campo.value);
    const minimo = parseFloat(campo.getAttribute('min') || '0');
    const maximo = parseFloat(campo.getAttribute('max') || '999999');
    
    // Verificar se o valor é um número válido
    if (isNaN(valor)) {
      mostrarErroValidacao(campo, 'Por favor, insira um número válido');
      valido = false;
      return;
    }
    
    // Verificar se está dentro dos limites
    if (valor < minimo) {
      mostrarErroValidacao(campo, `O valor mínimo é ${minimo}`);
      valido = false;
      return;
    }
    
    if (valor > maximo) {
      mostrarErroValidacao(campo, `O valor máximo é ${maximo}`);
      valido = false;
      return;
    }
    
    // Se chegou aqui, o campo é válido
    removerErroValidacao(campo);
  });
  
  return valido;
}

/**
 * Exibe os resultados do cálculo na interface
 * @param {Object} relatorio - Relatório de materiais gerado
 */
function exibirResultados(relatorio) {
  // Dimensões
  document.getElementById('resultadoLargura').textContent = `${relatorio.dimensoes.largura} m`;
  document.getElementById('resultadoAltura').textContent = `${relatorio.dimensoes.altura} m`;
  document.getElementById('resultadoEspessura').textContent = `${relatorio.dimensoes.espessuraPerfil} cm`;
  
  // Materiais
  document.getElementById('resultadoPerfilTotal').textContent = `${relatorio.materiais.metrosLineares.toFixed(2)} metros`;
  document.getElementById('resultadoPeso').textContent = `${relatorio.materiais.peso.toFixed(2)} kg`;
  document.getElementById('resultadoParafusos').textContent = `${relatorio.materiais.parafusos} unidades`;
  document.getElementById('resultadoDobradiças').textContent = `${relatorio.materiais.dobradiças} unidades`;
  document.getElementById('resultadoFechaduras').textContent = `${relatorio.materiais.fechaduras} unidades`;
  
  // Custos
  document.getElementById('resultadoCustoPerfil').textContent = relatorio.formatado.custoPerfil;
  document.getElementById('resultadoCustoParafusos').textContent = relatorio.formatado.custoParafusos;
  document.getElementById('resultadoCustoDobradiças').textContent = relatorio.formatado.custoDobradiças;
  document.getElementById('resultadoCustoFechaduras').textContent = relatorio.formatado.custoFechaduras;
  document.getElementById('resultadoCustoTotal').textContent = relatorio.formatado.custoTotal;
  
  // Exibir a seção de resultado
  document.getElementById('resultadoCalculoMateriais').classList.remove('d-none');
  
  // Rolar para os resultados
  document.getElementById('resultadoCalculoMateriais').scrollIntoView({ behavior: 'smooth' });
  
  // Mostrar notificação de sucesso
  mostrarNotificacao('Cálculo realizado com sucesso!', 'success');
}

/**
 * Limpa o formulário e oculta os resultados
 */
function limparCalculadora() {
  // Limpar formulário
  document.getElementById('calculadoraMateriaisForm').reset();
  
  // Ocultar resultados
  document.getElementById('resultadoCalculoMateriais').classList.add('d-none');
  
  // Mostrar notificação
  mostrarNotificacao('Formulário limpo', 'info');
}

/**
 * Imprime o resultado do cálculo
 */
function imprimirResultado() {
  // Criar uma versão para impressão
  const conteudoImpressao = document.createElement('div');
  conteudoImpressao.innerHTML = `
    <h2 style="text-align: center; margin-bottom: 20px;">Relatório de Materiais - Portão</h2>
    <div style="margin-bottom: 10px;">Data: ${new Date().toLocaleDateString('pt-BR')}</div>
    <h3>Dimensões do Portão</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Parâmetro</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Valor</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Largura</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoLargura').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Altura</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoAltura').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Espessura do Perfil</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoEspessura').textContent}</td>
      </tr>
    </table>
    
    <h3>Materiais Necessários</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Material</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantidade</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Total de Perfis</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoPerfilTotal').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Peso Aproximado</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoPeso').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Parafusos</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoParafusos').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Dobradiças</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoDobradiças').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Fechaduras</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoFechaduras').textContent}</td>
      </tr>
    </table>
    
    <h3>Custos Estimados</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Valor</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Custo dos Perfis</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoCustoPerfil').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Custo dos Parafusos</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoCustoParafusos').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Custo das Dobradiças</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoCustoDobradiças').textContent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Custo das Fechaduras</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoCustoFechaduras').textContent}</td>
      </tr>
      <tr style="background-color: #e6f7ff; font-weight: bold;">
        <td style="border: 1px solid #ddd; padding: 8px;">Custo Total Estimado</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('resultadoCustoTotal').textContent}</td>
      </tr>
    </table>
    
    <div style="font-size: 12px; margin-top: 30px; text-align: center;">
      <p>Este é um cálculo estimado baseado nas dimensões fornecidas.</p>
      <p>Os resultados podem variar dependendo dos materiais específicos utilizados.</p>
    </div>
  `;
  
  // Abrir janela de impressão
  const janelaImpressao = window.open('', '_blank');
  janelaImpressao.document.write(`
    <html>
      <head>
        <title>Relatório de Materiais - Portão</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        ${conteudoImpressao.innerHTML}
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()">Imprimir</button>
        </div>
      </body>
    </html>
  `);
  
  janelaImpressao.document.close();
}

/**
 * Exporta o resultado para PDF
 * Utiliza a biblioteca jsPDF que deve estar incluída no projeto
 */
function exportarPDF() {
  // Verificar se a biblioteca jsPDF está disponível
  if (typeof jsPDF === 'undefined') {
    mostrarNotificacao('Biblioteca jsPDF não encontrada', 'error');
    
    // Alternativa: usar impressão
    mostrarNotificacao('Utilizando impressão como alternativa.', 'warning');
    imprimirResultado();
    return;
  }
  
  try {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Materiais - Portão', 105, 15, { align: 'center' });
    
    // Data
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 25);
    
    // Dimensões
    doc.setFontSize(14);
    doc.text('Dimensões do Portão', 20, 35);
    
    doc.setFontSize(10);
    doc.text('Largura:', 20, 45);
    doc.text(document.getElementById('resultadoLargura').textContent, 70, 45);
    
    doc.text('Altura:', 20, 52);
    doc.text(document.getElementById('resultadoAltura').textContent, 70, 52);
    
    doc.text('Espessura do Perfil:', 20, 59);
    doc.text(document.getElementById('resultadoEspessura').textContent, 70, 59);
    
    // Materiais
    doc.setFontSize(14);
    doc.text('Materiais Necessários', 20, 70);
    
    doc.setFontSize(10);
    doc.text('Total de Perfis:', 20, 80);
    doc.text(document.getElementById('resultadoPerfilTotal').textContent, 70, 80);
    
    doc.text('Peso Aproximado:', 20, 87);
    doc.text(document.getElementById('resultadoPeso').textContent, 70, 87);
    
    doc.text('Parafusos:', 20, 94);
    doc.text(document.getElementById('resultadoParafusos').textContent, 70, 94);
    
    doc.text('Dobradiças:', 20, 101);
    doc.text(document.getElementById('resultadoDobradiças').textContent, 70, 101);
    
    doc.text('Fechaduras:', 20, 108);
    doc.text(document.getElementById('resultadoFechaduras').textContent, 70, 108);
    
    // Custos
    doc.setFontSize(14);
    doc.text('Custos Estimados', 20, 120);
    
    doc.setFontSize(10);
    doc.text('Custo dos Perfis:', 20, 130);
    doc.text(document.getElementById('resultadoCustoPerfil').textContent, 70, 130);
    
    doc.text('Custo dos Parafusos:', 20, 137);
    doc.text(document.getElementById('resultadoCustoParafusos').textContent, 70, 137);
    
    doc.text('Custo das Dobradiças:', 20, 144);
    doc.text(document.getElementById('resultadoCustoDobradiças').textContent, 70, 144);
    
    doc.text('Custo das Fechaduras:', 20, 151);
    doc.text(document.getElementById('resultadoCustoFechaduras').textContent, 70, 151);
    
    // Custo total
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Custo Total Estimado:', 20, 160);
    doc.text(document.getElementById('resultadoCustoTotal').textContent, 70, 160);
    
    // Rodapé
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('Este é um cálculo estimado baseado nas dimensões fornecidas.', 105, 180, { align: 'center' });
    doc.text('Os resultados podem variar dependendo dos materiais específicos utilizados.', 105, 185, { align: 'center' });
    
    // Salvar PDF
    doc.save('relatorio-materiais-portao.pdf');
    
    mostrarNotificacao('PDF exportado com sucesso', 'success');
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    mostrarNotificacao('Erro ao exportar PDF. Verifique o console para mais detalhes.', 'error');
  }
}

// Expor função de inicialização para uso global
window.inicializarCalculadoraMateriais = inicializarCalculadoraMateriais;