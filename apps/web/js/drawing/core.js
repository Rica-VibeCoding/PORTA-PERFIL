/**
 * Funções centrais para criar e manipular elementos SVG
 */

let svg;
let svgContainer;

/**
 * Inicializa o canvas SVG para desenho
 */
function inicializarCanvas() {
  svgContainer = document.getElementById('porta-container');
  if (!svgContainer) {
    console.error('Container para SVG não encontrado!');
    return false;
  }
  
  // Limpa o conteúdo anterior
  svgContainer.innerHTML = '';
  
  // Cria o elemento SVG com as dimensões e configurações especificadas
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', CONFIG.svgGlobais.largura);
  svg.setAttribute('height', CONFIG.svgGlobais.altura);
  svg.setAttribute('viewBox', CONFIG.svgGlobais.viewBox);
  svg.setAttribute('id', 'desenho-svg');
  
  // Adiciona o SVG ao container
  svgContainer.appendChild(svg);
  
  return true;
}

/**
 * Cria um elemento SVG genérico e define seus atributos
 * @param {string} tipo - O tipo de elemento SVG (rect, line, circle, etc)
 * @param {Object} atributos - Objeto com atributos a serem definidos no elemento
 * @return {SVGElement} - O elemento SVG criado
 */
function criarElementoSVG(tipo, atributos) {
  const elemento = document.createElementNS('http://www.w3.org/2000/svg', tipo);
  
  // Define os atributos
  if (atributos) {
    Object.keys(atributos).forEach(chave => {
      elemento.setAttribute(chave, atributos[chave]);
    });
  }
  
  return elemento;
}

/**
 * Adiciona um elemento ao SVG
 * @param {SVGElement} elemento - O elemento a ser adicionado
 */
function adicionarElementoSVG(elemento) {
  if (svg) {
    svg.appendChild(elemento);
  } else {
    console.error('SVG não inicializado. Chame inicializarCanvas() primeiro.');
  }
}

/**
 * Cria e adiciona um retângulo SVG
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {number} largura - Largura do retângulo
 * @param {number} altura - Altura do retângulo
 * @param {string} cor - Cor de preenchimento
 * @param {string} [corBorda] - Cor da borda (opcional)
 * @param {number} [espessuraBorda=1] - Espessura da borda (opcional)
 * @return {SVGElement} - O elemento SVG criado
 */
function criarRetanguloSVG(x, y, largura, altura, cor, corBorda, espessuraBorda = 1) {
  const atributos = {
    x: x,
    y: y,
    width: largura,
    height: altura,
    fill: cor
  };
  
  if (corBorda) {
    atributos.stroke = corBorda;
    atributos['stroke-width'] = espessuraBorda;
  }
  
  const retangulo = criarElementoSVG('rect', atributos);
  adicionarElementoSVG(retangulo);
  
  return retangulo;
}

/**
 * Cria e adiciona uma linha SVG
 * @param {number} x1 - Posição X inicial
 * @param {number} y1 - Posição Y inicial
 * @param {number} x2 - Posição X final
 * @param {number} y2 - Posição Y final
 * @param {string} cor - Cor da linha
 * @param {number} [espessura=1] - Espessura da linha (opcional)
 * @param {string} [tracejado] - Padrão de traço (opcional, ex: "5,5")
 * @return {SVGElement} - O elemento SVG criado
 */
function criarLinhaSVG(x1, y1, x2, y2, cor, espessura = 1, tracejado) {
  const atributos = {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    stroke: cor,
    'stroke-width': espessura
  };
  
  if (tracejado) {
    atributos['stroke-dasharray'] = tracejado;
  }
  
  const linha = criarElementoSVG('line', atributos);
  adicionarElementoSVG(linha);
  
  return linha;
}

/**
 * Cria e adiciona um círculo SVG
 * @param {number} cx - Posição X do centro
 * @param {number} cy - Posição Y do centro
 * @param {number} raio - Raio do círculo
 * @param {string} cor - Cor de preenchimento
 * @param {string} [corBorda] - Cor da borda (opcional)
 * @param {number} [espessuraBorda=1] - Espessura da borda (opcional)
 * @return {SVGElement} - O elemento SVG criado
 */
function criarCirculoSVG(cx, cy, raio, cor, corBorda, espessuraBorda = 1) {
  const atributos = {
    cx: cx,
    cy: cy,
    r: raio,
    fill: cor
  };
  
  if (corBorda) {
    atributos.stroke = corBorda;
    atributos['stroke-width'] = espessuraBorda;
  }
  
  const circulo = criarElementoSVG('circle', atributos);
  adicionarElementoSVG(circulo);
  
  return circulo;
}

/**
 * Cria e adiciona um texto SVG
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {string} texto - Conteúdo do texto
 * @param {string} [cor=#000000] - Cor do texto (opcional)
 * @param {number} [tamanho=12] - Tamanho da fonte (opcional)
 * @param {string} [ancora=start] - Alinhamento do texto (start, middle, end)
 * @return {SVGElement} - O elemento SVG criado
 */
function criarTextoSVG(x, y, texto, cor = '#000000', tamanho = 12, ancora = 'start') {
  const atributos = {
    x: x,
    y: y,
    fill: cor,
    'font-size': tamanho,
    'font-family': CONFIG.texto.fontFamily,
    'text-anchor': ancora
  };
  
  const textoElement = criarElementoSVG('text', atributos);
  textoElement.textContent = texto;
  adicionarElementoSVG(textoElement);
  
  return textoElement;
}