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

3. **Determinação da Posição Horizontal (X)**:
   ```javascript
   const deslocamento = (config.puxador?.deslocamento !== undefined) ? 
     (config.puxador.deslocamento * CONFIG.escala) : 0;
     
   if (ladoDireito) {
     // Dobradiças à direita, puxador à esquerda (com deslocamento da borda esquerda)
     posX = x + deslocamento;
   } else {
     // Dobradiças à esquerda, puxador à direita (com deslocamento da borda direita)
     posX = x + larguraPorta - comprimentoPuxador - deslocamento;
   }
   ```
   - O deslocamento é aplicado a partir da borda esquerda (para puxador à esquerda) ou a partir da borda direita (para puxador à direita)
   - O valor vem do campo "Dist. Lateral" do formulário

### Sistema de Cotas

#### Princípios Gerais

1. **Conversão de Unidades**:
   - Todos os cálculos internos são em pixels (escala do SVG)
   - Valores exibidos nas cotas são convertidos para milímetros (divisão por CONFIG.escala)
   - Exemplo: `distanciaTopo = Math.round((posY - y) / CONFIG.escala);`

2. **Evitar Sobreposições**:
   - Cotas horizontais e verticais são posicionadas estrategicamente para evitar sobreposições
   - Para o puxador horizontal, a cota de largura da porta é posicionada no lado oposto ao puxador

#### Cotas do Puxador Vertical

1. **Posições das Cotas**:
   ```javascript
   const posXCota = ladoDireito ? 
     x - 25 : // Lado esquerdo da porta
     x + larguraPorta + 25; // Lado direito da porta
     
   const posXCotaPuxador = ladoDireito ? 
     x - 45 : // Para cota de altura do puxador, mais afastada
     x + larguraPorta + 45;
   ```
   - Posicionamento das cotas do mesmo lado que o puxador
   - Três cotas: superior (até o início do puxador), central (altura do puxador) e inferior (do fim do puxador até a base)

2. **Valores Exibidos**:
   - Superior: `distanciaTopo` (cota superior do formulário)
   - Central: `alturaPuxadorMm` (altura do puxador conforme selecionado)
   - Inferior: `distanciaBase` (calculado como altura total - superior - altura puxador)

#### Cotas do Puxador Horizontal

1. **Deslocamento Lateral**:
   ```javascript
   desenharCotaSVG(
     x,
     ehPortaInferior ? y - 45 : y + altura + 45,
     posX,
     ehPortaInferior ? y - 45 : y + altura + 45,
     `${config.puxador?.deslocamento || 0}`,
     'middle',
     CONFIG.corCotaPuxador
   );
   ```
   - Para dobradiças à direita: mostra distância da borda esquerda até o puxador
   - Para dobradiças à esquerda: mostra distância da borda direita até o puxador
   - Posição vertical depende se porta é inferior (cota acima) ou superior (cota abaixo)

2. **Valor Exibido**:
   - Diretamente do formulário: `config.puxador?.deslocamento || 0`
   - Não precisa de conversão pois já está em mm

#### Cotas da Porta (Largura e Altura)

1. **Largura**:
   ```javascript
   const cotaEmCima = ehPuxadorHorizontal ? !ehPortaInferior : ehPortaInferior;
   
   desenharCotaSVG(
     posX, 
     cotaEmCima ? posY - 30 : posY + alturaPorta + 30,
     posX + larguraPorta, 
     cotaEmCima ? posY - 30 : posY + alturaPorta + 30,
     `${config.largura} mm`,
     'middle',
     CONFIG.corCotaPorta
   );
   ```
   - Posição inteligente baseada no tipo de porta e puxador
   - Se puxador horizontal: cota fica do lado oposto
   - Se puxador vertical: cota fica em cima para porta inferior, embaixo para porta superior

2. **Altura**:
   ```javascript
   const posXCotaAltura = ladoDireito ? 
     posX + larguraPorta + 65 :
     posX - 65;
   ```
   - Posicionada do mesmo lado das dobradiças
   - Afastada 65px para não conflitar com outras cotas

### Desafios Solucionados

1. **Puxador Horizontal Não Alinhado à Borda**
   - **Problema**: Puxador não ficava rente à borda da porta (principalmente em portas inferiores)
   - **Solução**: Remoção dos ajustes verticais desnecessários e definição direta: `posY = y;` para portas inferiores

2. **Deslocamento do Puxador Horizontal Ignorado**
   - **Problema**: O campo "Dist. Lateral" no formulário não influenciava o posicionamento
   - **Solução**: Aplicação direta do deslocamento com base no lado do puxador e considerando a escala

3. **Cotas Sobrepostas**
   - **Problema**: Cotas da porta e do puxador se sobrepondo
   - **Solução**: Posicionamento inteligente baseado no tipo de porta e local do puxador

4. **Inconsistência no Lado do Puxador**
   - **Problema**: Puxador não estava consistentemente no lado oposto às dobradiças
   - **Solução**: Unificação da lógica para ambos os tipos de puxador (vertical e horizontal)

## Alterações e Correções Realizadas

### Configuração Padrão

1. **Valor Fixo para "Instalação"**
   - Campo "Instalação" na legenda agora exibe sempre "-"

2. **Valor Padrão para Puxador**
   - Puxador com valor padrão "150" para novos projetos
   - Cotas automáticas: superior = 950mm, inferior = 1000mm
   - Posição padrão agora é "horizontal" para todos os tipos de porta

### Ajustes de Layout

1. **Ajuste do SVG para Tamanho A4**
   - SVG mantém proporções de A4 independente do zoom do navegador
   - Dimensões ajustadas para 595x842px (75% do tamanho A4)
   - Escala reduzida para 0.15 para manter proporções corretas

2. **Aparência Visual do Documento**
   - Adicionada sombra e borda para dar aparência de folha A4
   - Fundo branco para melhorar a impressão

3. **Posicionamento de Cotas**
   - Cotas da porta: reduzidas distâncias de 40px para 30px
   - Cotas do puxador: reduzidas distâncias laterais para melhor leitura
   - Cota vertical da altura: reduzida de 100px para 65px

### Correções no Posicionamento de Elementos

1. **Puxador Horizontal**
   - Corrigido o posicionamento para ficar rente à borda da porta