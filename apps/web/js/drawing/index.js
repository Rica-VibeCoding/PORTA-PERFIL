/**
 * Módulo de desenho - Ponto de entrada
 * Exporta as principais funções de desenho para uso no aplicativo
 */

/**
 * Desenha a porta com a configuração atual
 * Função principal que coordena todo o processo de desenho
 */
function desenharPorta() {
  // Obtém a configuração atual
  const config = obterConfiguracaoAtual();
  
  // Redefine o SVG
  inicializarCanvas();
  
  // Calcula as dimensões da porta em pixels
  const larguraPorta = config.largura * CONFIG.escala;
  const alturaPorta = config.altura * CONFIG.escala;
  
  // Calcula a posição X e Y para centralizar a porta no canvas
  const posX = (CONFIG.svgGlobais.largura - larguraPorta) / 2;
  const posY = 80; // Margem superior fixa
  
  // Verifica o tipo de porta para desenhar corretamente
  const isDeslizante = config.funcao === 'deslizante';
  
  // Desenha o fundo do SVG
  criarRetanguloSVG(0, 0, CONFIG.svgGlobais.largura, CONFIG.svgGlobais.altura, '#ffffff');
  
  if (isDeslizante) {
    // Desenha porta deslizante
    desenharPortaDeslizante(posX, posY, larguraPorta, alturaPorta, config);
  } else {
    // Desenha porta de abrir (dobradiças)
    desenharPortaAbrir(posX, posY, larguraPorta, alturaPorta, config);
  }
  
  // Desenha informações, cotas e legendas
  desenharLegenda(config, CONFIG.svgGlobais.largura, CONFIG.svgGlobais.altura);
}

/**
 * Captura o canvas atual como imagem para impressão ou exportação
 * @returns {Promise<string>} Uma Promise que resolve para o data URL da imagem
 */
function capturarImagemCanvas() {
  return new Promise((resolve, reject) => {
    try {
      const svgElement = document.getElementById('desenho-svg');
      
      if (!svgElement) {
        reject(new Error('Elemento SVG não encontrado'));
        return;
      }
      
      // Cria um clone do SVG para evitar modificar o original
      const cloneSvg = svgElement.cloneNode(true);
      cloneSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      // Converte o SVG para string
      const svgData = new XMLSerializer().serializeToString(cloneSvg);
      
      // Cria um data URL do SVG
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      
      // Cria uma imagem para carregar o SVG
      const img = new Image();
      img.onload = function() {
        // Cria um canvas para desenhar a imagem
        const canvas = document.createElement('canvas');
        canvas.width = CONFIG.svgGlobais.largura;
        canvas.height = CONFIG.svgGlobais.altura;
        
        // Obtém o contexto 2D
        const ctx = canvas.getContext('2d');
        
        // Preenche o fundo com branco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenha a imagem SVG no canvas
        ctx.drawImage(img, 0, 0);
        
        // Converte o canvas para data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Resolve a Promise com o data URL
        resolve(dataUrl);
      };
      
      img.onerror = function(error) {
        reject(new Error('Erro ao carregar imagem SVG: ' + error));
      };
      
      // Carrega a imagem com o data URL do SVG
      img.src = svgDataUrl;
    } catch (error) {
      reject(new Error('Erro ao capturar imagem: ' + error.message));
    }
  });
}