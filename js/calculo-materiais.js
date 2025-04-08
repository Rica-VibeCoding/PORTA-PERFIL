/**
 * Script para cálculo de materiais para portões e perfis de alumínio
 * Adaptado para o projeto PORTA-PERFIL
 */

import { formatarMoeda } from './utils.js';

// Funções úteis para cálculos de portões e perfis

/**
 * Calcula a quantidade de perfil necessária para um portão retangular
 * @param {number} largura - Largura do portão em metros
 * @param {number} altura - Altura do portão em metros
 * @param {number} espessuraPerfil - Espessura do perfil em centímetros
 * @returns {number} - Total de metros lineares de perfil necessários
 */
export function calcularPerfisPortao(largura, altura, espessuraPerfil) {
  // Perímetro básico
  const perimetro = 2 * largura + 2 * altura;
  
  // Calcular travessas horizontais (assumindo uma travessa a cada 50cm)
  const numeroTravessas = Math.ceil(altura / 0.5) - 1;
  const comprimentoTravessas = numeroTravessas * largura;
  
  // Calcular montantes verticais (assumindo um montante a cada 1m)
  const numeroMontantes = Math.ceil(largura / 1) - 1;
  const comprimentoMontantes = numeroMontantes * altura;
  
  // Total de perfis necessários
  return perimetro + comprimentoTravessas + comprimentoMontantes;
}

/**
 * Calcula o peso aproximado do portão
 * @param {number} metrosLineares - Total de metros lineares de perfil
 * @param {number} pesoPorMetro - Peso do perfil por metro linear (kg/m)
 * @returns {number} - Peso total aproximado em kg
 */
export function calcularPesoPortao(metrosLineares, pesoPorMetro) {
  return metrosLineares * pesoPorMetro;
}

/**
 * Calcula o custo aproximado dos perfis
 * @param {number} metrosLineares - Total de metros lineares de perfil
 * @param {number} custoPorMetro - Custo do perfil por metro linear
 * @returns {number} - Custo total dos perfis
 */
export function calcularCustoPerfilPortao(metrosLineares, custoPorMetro) {
  return metrosLineares * custoPorMetro;
}

/**
 * Calcula o número de parafusos necessários
 * @param {number} metrosLineares - Total de metros lineares de perfil
 * @returns {number} - Número estimado de parafusos
 */
export function calcularParafusos(metrosLineares) {
  // Estimativa de 4 parafusos por metro linear de perfil
  return Math.ceil(metrosLineares * 4);
}

/**
 * Calcula a quantidade de fechaduras e dobradiças
 * @param {number} largura - Largura do portão em metros
 * @param {number} altura - Altura do portão em metros
 * @returns {Object} - Objeto com quantidade de fechaduras e dobradiças
 */
export function calcularAcessorios(largura, altura) {
  // Cálculo baseado no tamanho do portão
  const peso = altura * largura * 15; // Estimativa grosseira de peso
  
  // Número de dobradiças baseado no peso
  let dobradiças = 2;
  if (peso > 50) dobradiças = 3;
  if (peso > 100) dobradiças = 4;
  
  // Normalmente uma fechadura por portão
  const fechaduras = 1;
  
  return { dobradiças, fechaduras };
}

/**
 * Gera um relatório completo de materiais
 * @param {Object} dimensoes - Objeto com dimensões do portão
 * @param {Object} precos - Objeto com preços dos materiais
 * @returns {Object} - Relatório de materiais e custos
 */
export function gerarRelatorioMateriais(dimensoes, precos) {
  const { largura, altura, espessuraPerfil } = dimensoes;
  const { perfilPorMetro, parafusoPorUnidade, fechaduraPorUnidade, dobradicaPorUnidade } = precos;
  
  const metrosLineares = calcularPerfisPortao(largura, altura, espessuraPerfil);
  const peso = calcularPesoPortao(metrosLineares, precos.pesoPorMetro || 1.2);
  const custoPerfil = calcularCustoPerfilPortao(metrosLineares, perfilPorMetro);
  
  const qtdeParafusos = calcularParafusos(metrosLineares);
  const custoParafusos = qtdeParafusos * parafusoPorUnidade;
  
  const { dobradiças, fechaduras } = calcularAcessorios(largura, altura);
  const custoDobradiças = dobradiças * dobradicaPorUnidade;
  const custoFechaduras = fechaduras * fechaduraPorUnidade;
  
  const custoTotal = custoPerfil + custoParafusos + custoDobradiças + custoFechaduras;
  
  return {
    dimensoes: {
      largura,
      altura,
      espessuraPerfil
    },
    materiais: {
      metrosLineares: parseFloat(metrosLineares.toFixed(2)),
      peso: parseFloat(peso.toFixed(2)),
      parafusos: qtdeParafusos,
      dobradiças,
      fechaduras
    },
    custos: {
      perfil: custoPerfil,
      parafusos: custoParafusos,
      dobradiças: custoDobradiças,
      fechaduras: custoFechaduras,
      total: custoTotal
    },
    formatado: {
      custoPerfil: formatarMoeda(custoPerfil),
      custoParafusos: formatarMoeda(custoParafusos),
      custoDobradiças: formatarMoeda(custoDobradiças),
      custoFechaduras: formatarMoeda(custoFechaduras),
      custoTotal: formatarMoeda(custoTotal)
    }
  };
}