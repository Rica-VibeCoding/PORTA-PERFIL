# Documentação do Projeto PORTAS PERFIS

## Visão Geral

Este projeto consiste em um aplicativo web para desenho técnico de portas e perfis, permitindo a configuração de diversos parâmetros como dimensões, tipo de vidro, perfil, dobradiças e puxadores. O desenho é gerado dinamicamente usando SVG, resultando em uma representação técnica precisa.

## Estrutura do Projeto

### Arquivos Principais

- **js/drawing.js**: Responsável pelo desenho SVG da porta e todos seus componentes
- **js/ui-controls.js**: Gerencia os controles da interface e eventos do formulário
- **js/initialize.js**: Inicializa o sistema com valores padrão
- **js/storage-functions.js**: Gerencia o armazenamento e recuperação de configurações
- **js/main.js**: Ponto de entrada do aplicativo
- **js/sidebar.js**: Controle da barra lateral
- **index.html**: Interface do usuário e formulário de configuração
- **css/styles.css**: Estilos da aplicação

## Funcionalidades Implementadas

### 1. Renderização Básica da Porta
- Desenho SVG de porta completo com dimensões ajustáveis
- Suporte para diferentes cores de perfil e tipos de vidro
- Efeitos de reflexo no vidro para visual mais realista

### 2. Controle de Dobradiças
- Número de dobradiças configurável (0-10)
- Posicionamento personalizado ou automático das dobradiças
- Cotas para exibir as distâncias entre dobradiças

### 3. Sistema de Puxadores
- Suporte para puxadores verticais e horizontais
- Controle preciso de dimensões e posicionamento
- Opções para tamanho do puxador (100mm-1000mm ou tamanho da porta)

### 4. Função da Porta
- Suporte para diferentes tipos de abertura:
  - Superior Direita
  - Superior Esquerda
  - Inferior Direita
  - Inferior Esquerda
  - Deslizante

### 5. Legenda Técnica
- Exibição de informações completas sobre o produto
- Campos para cliente, ambiente, medidas, quantidade
- Área para observações

## Linha de Raciocínio para Cotas e Posicionamento

### Lógica de Posicionamento de Puxadores

#### Puxador Vertical

1. **Princípio Fundamental**:
   - O puxador vertical deve sempre ficar do lado **oposto às dobradiças**
   - Isso reflete o uso real: o puxador fica no lado onde a porta é puxada para abrir

2. **Determinação do Lado**:
   - A variável `ladoDireito` (calculada com `config.funcao?.includes('Direita')`) determina o lado das dobradiças
   - Se `ladoDireito` for `true`, as dobradiças estão à direita e o puxador à esquerda
   - Se `ladoDireito` for `false`, as dobradiças estão à esquerda e o puxador à direita

3. **Cálculo da Posição X**:
   ```javascript
   if (ladoDireito) {
     // Dobradiças à direita, puxador à esquerda (junto ao perfil)
     posX = x + 0;
   } else {
     // Dobradiças à esquerda, puxador à direita (junto ao perfil)
     posX = x + larguraPorta - espessuraPuxador;
   }
   ```
   - Quando à esquerda: posicionado a partir da borda esquerda da porta
   - Quando à direita: posicionado a partir da borda direita, compensando a espessura do puxador

4. **Posição Y e Altura**:
   - Determinada pelo campo "Cota Superior" ou centralizado automaticamente
   - Verificação para garantir que o puxador não ultrapasse os limites da porta

#### Puxador Horizontal

1. **Princípio Fundamental**:
   - O puxador horizontal deve ficar rente à borda superior (para portas inferiores) ou inferior (para portas superiores)
   - Horizontalmente, deve ficar no lado oposto às dobradiças, assim como o puxador vertical

2. **Determinação da Posição Vertical (Y)**:
   ```javascript
   if (ehPortaInferior) {
     // Para portas inferiores, o puxador fica na borda superior rente à porta
     posY = y; // Sem ajuste para ficar rente à borda superior
   } else {
     // Para portas superiores, o puxador fica na borda inferior rente à porta
     posY = y + altura - espessuraPuxador; // Alinhado com a borda inferior
   }
   ```
   - Portas inferiores: puxador na borda superior (y)
   - Portas superiores: puxador na borda inferior (y + altura - espessuraPuxador)

## Módulos do Sistema

### Módulo de Desenho (js/drawing/)

Este módulo contém toda a lógica de renderização SVG, dividida em submódulos:

- **core.js**: Funções essenciais para criação e manipulação de elementos SVG
- **elements.js**: Implementação de elementos específicos (dobradiças, puxadores)
- **door-types.js**: Lógica para diferentes tipos de portas
- **annotations.js**: Sistema de cotas e legendas
- **utils.js**: Funções utilitárias para cálculos e conversões
- **config.js**: Configurações e constantes para o desenho

### Sistema de Armazenamento (js/storage.js)

Permite salvar e carregar configurações de portas:

- Armazenamento em localStorage para persistência entre sessões
- Implementação de histórico de configurações
- Exportação e importação de configurações completas

### Interface do Usuário (js/ui-controls.js)

Gerencia a interface de usuário e eventos:

- Controles de formulário para configuração
- Atualizações em tempo real do desenho
- Feedback visual para o usuário
- Validação de entrada de dados

## API de Configuração

O sistema usa um objeto de configuração central com a seguinte estrutura:

```javascript
{
  // Dimensões básicas
  largura: 800, // em milímetros
  altura: 2200, // em milímetros
  
  // Detalhes do perfil
  perfil: {
    tipo: 'Linha 25', // ou outras linhas
    cor: '#A9A9A9', // código de cor
    capa: true // se tem capa protetora
  },
  
  // Configuração do vidro
  vidro: {
    tipo: 'comum', // comum, jateado, etc.
    espessura: 8 // em milímetros
  },
  
  // Configuração de abertura
  funcao: 'Inferior Direita', // tipo de abertura
  
  // Configuração do puxador
  puxador: {
    tipo: 'vertical', // vertical ou horizontal
    altura: 500, // para puxador vertical (em mm)
    largura: 25, // espessura do puxador (em mm)
    deslocamento: 0, // deslocamento lateral (em mm)
    cotaSuperior: 400 // distância do topo (em mm)
  },
  
  // Configuração de dobradiças
  dobradicas: {
    quantidade: 3,
    tipo: 'automático', // automático ou manual
    posicoes: [] // array com posições caso seja manual
  }
}
```

## Cálculos e Conversões

### Sistema de Escala

- Escala padrão: 0.5 pixels por milímetro
- Conversão para desenho: `valorMm * CONFIG.escala`
- Conversão para exibição: `valorPixel / CONFIG.escala`

### Posicionamento Automático

Para dobradiças em modo automático:
```javascript
function calcularPosicaoAutomatica(qtd, altura) {
  const posicoes = [];
  const espacamento = altura / (qtd + 1);
  
  for (let i = 1; i <= qtd; i++) {
    posicoes.push(Math.round(espacamento * i));
  }
  
  return posicoes;
}
```

## Funções do Sistema

### Inicialização

```javascript
function inicializar() {
  inicializarArmazenamento();
  inicializarControles();
  inicializarCanvas();
  carregarUltimaConfiguracao();
  atualizarDesenho();
}
```

### Atualização do Desenho

```javascript
function atualizarDesenho() {
  const config = obterConfiguracaoAtual();
  limparCanvas();
  desenharPorta(config);
  desenharLegenda(config);
}
```

### Salvamento de Configuração

```javascript
function salvarConfiguracao(nome) {
  const config = obterConfiguracaoAtual();
  config.nome = nome || `Configuração ${Date.now()}`;
  config.data = new Date().toISOString();
  
  const configuracoesExistentes = obterTodasConfiguracoes();
  configuracoesExistentes.push(config);
  
  localStorage.setItem('portas-perfis-configuracoes', JSON.stringify(configuracoesExistentes));
}
```