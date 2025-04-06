/**
 * Utilitários para desenho
 * Funções auxiliares utilizadas pelos módulos de desenho
 */

/**
 * Determina se a função da porta indica que a dobradiça fica no lado direito
 * @param {string} funcao - Função da porta (superiorDireita, inferiorEsquerda, etc)
 * @returns {boolean} true se a dobradiça fica no lado direito, false caso contrário
 */
function ehDobradicaDireita(funcao) {
  return funcao && (funcao.includes('Direita'));
}

/**
 * Determina se a função da porta indica que é uma porta inferior
 * @param {string} funcao - Função da porta (superiorDireita, inferiorEsquerda, etc)
 * @returns {boolean} true se é uma porta inferior, false caso contrário
 */
function ehPortaInferior(funcao) {
  return funcao && (funcao.includes('inferior'));
}

/**
 * Formata um número para exibição como medida
 * @param {number} valor - Valor a ser formatado
 * @param {boolean} comUnidade - Indica se deve incluir a unidade (mm)
 * @returns {string} Valor formatado
 */
function formatarMedida(valor, comUnidade = true) {
  if (typeof valor !== 'number') {
    return comUnidade ? '0 mm' : '0';
  }
  
  // Arredonda para o inteiro mais próximo
  const valorArredondado = Math.round(valor);
  
  return comUnidade ? `${valorArredondado} mm` : `${valorArredondado}`;
}

/**
 * Calcula posições equilibradas para dobradiças
 * @param {number} altura - Altura da porta em pixels
 * @param {number} numero - Número de dobradiças a posicionar
 * @returns {Array} Array de objetos {posY, escala, distanciaTopo, distanciaBase}
 */
function calcularPosicoesDobradicasAutomaticas(altura, numero) {
  // Se não houver dobradiças, retorna array vazio
  if (numero <= 0) {
    return [];
  }
  
  // Altura em mm
  const alturaMm = altura / CONFIG.escala;
  
  const posicoes = [];
  
  if (numero === 1) {
    // Uma única dobradiça fica no meio
    const posY = altura / 2;
    const distanciaTopo = Math.round(posY / CONFIG.escala);
    const distanciaBase = Math.round((altura - posY) / CONFIG.escala);
    
    posicoes.push({
      posY,
      distanciaTopo,
      distanciaBase
    });
  } else {
    // Margem mínima do topo e da base (em mm)
    const margemMinima = 150;
    
    // Altura útil para distribuição (desconta as margens)
    const alturaUtil = alturaMm - (margemMinima * 2);
    
    // Espaçamento entre dobradiças
    const espacamento = alturaUtil / (numero - 1);
    
    for (let i = 0; i < numero; i++) {
      // Posição Y em mm (a partir do topo)
      const posYmm = margemMinima + (i * espacamento);
      
      // Converte para pixels
      const posY = posYmm * CONFIG.escala;
      
      // Calcula distâncias para o topo e base
      const distanciaTopo = Math.round(posYmm);
      const distanciaBase = Math.round(alturaMm - posYmm);
      
      posicoes.push({
        posY,
        distanciaTopo,
        distanciaBase
      });
    }
  }
  
  return posicoes;
}

/**
 * Valida se as posições de dobradiças estão dentro dos limites da porta
 * e ajusta se necessário
 * @param {Array} posicoes - Array de posições de dobradiças
 * @param {number} altura - Altura da porta em mm
 * @returns {Array} Posições ajustadas
 */
function validarPosicoesDobradicasAutomaticas(posicoes, altura) {
  return posicoes.map(pos => {
    // Cria uma cópia para não alterar o original
    const posCopia = { ...pos };
    
    // Garante que a distância do topo não seja menor que o mínimo
    const distanciaTopoMin = 100;
    if (posCopia.distanciaTopo < distanciaTopoMin) {
      posCopia.distanciaTopo = distanciaTopoMin;
      posCopia.posY = posCopia.distanciaTopo * CONFIG.escala;
      posCopia.distanciaBase = Math.round(altura - posCopia.distanciaTopo);
    }
    
    // Garante que a distância da base não seja menor que o mínimo
    const distanciaBaseMin = 100;
    if (posCopia.distanciaBase < distanciaBaseMin) {
      posCopia.distanciaBase = distanciaBaseMin;
      posCopia.posY = (altura - posCopia.distanciaBase) * CONFIG.escala;
      posCopia.distanciaTopo = Math.round(altura - posCopia.distanciaBase);
    }
    
    return posCopia;
  });
}