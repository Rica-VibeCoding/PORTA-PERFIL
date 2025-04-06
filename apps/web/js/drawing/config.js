/**
 * Configurações globais do sistema de desenho
 * Define constantes, cores, escalas, etc.
 */

const CONFIG = {
  // Escala de desenho (pixels por mm)
  escala: 0.15,
  
  // Tamanho da margem ao redor da porta (em pixels)
  margemX: 10,
  margemY: 10,
  
  // Tamanho do perfil da porta (em mm)
  tamanhoPerfil: 20,
  
  // Cores padrão
  corPerfil: '#666666',
  corPerfilClaro: '#999999',
  corPerfilEscuro: '#444444',
  corFundo: '#FFFFFF',
  corVidro: 'rgba(200, 200, 255, 0.3)',
  corSombraVidro: 'rgba(100, 100, 180, 0.05)',
  corDobradicaExterna: '#888888',
  corDobradicaInterna: '#666666',
  corDobradicaSombra: '#333333',
  corPuxador: '#777777',
  corCotaPorta: '#333333',
  corCotaDobradicaVertical: '#0070C0',
  corCotaDobradicaHorizontal: '#7030A0',
  corCotaPuxador: '#C00000',
  
  // Diâmetros das dobradiças (em mm)
  diametroDobradicaExterna: 14,
  diametroDobradicaInterna: 10,
  
  // Dimensões do trilho deslizante (em mm)
  trilhoDeslizanteAltura: 30,
  trilhoDeslizanteProfundidade: 20,
  
  // Configurações do SVG
  svgGlobais: {
    largura: 595, // 75% de A4 (210mm * 0.75 * 3.78 pixels/mm)
    altura: 842,  // 75% de A4 (297mm * 0.75 * 3.78 pixels/mm)
    viewBox: '0 0 595 842'
  },
  
  // Configurações dos puxadores
  puxador: {
    espessuraVertical: 10,
    espessuraHorizontal: 10
  },
  
  // Configurações de texto para rótulos e legendas
  texto: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: 10,
    corTitulo: '#000000',
    corSubtitulo: '#333333',
    corDescricao: '#555555'
  },
  
  // Configurações de posicionamento de elementos relativos
  posicoes: {
    legendaX: 40,
    legendaY: 680
  }
};