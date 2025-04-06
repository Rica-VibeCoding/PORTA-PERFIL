# Aplicativo de Desenho de Portas e Perfis

Este é um aplicativo web para desenho e configuração de portas, desenvolvido para a Conecta Soluções.

## Instalação

1. Instale o Node.js caso ainda não tenha (https://nodejs.org/)
2. Clone este repositório
3. Execute o comando para instalar as dependências:
   ```
   npm install
   ```
4. Para iniciar o servidor de desenvolvimento:
   ```
   npm start
   ```
5. Acesse o aplicativo em seu navegador: http://localhost:3000

## Estrutura do Projeto

```
.
├── css/                    # Estilos CSS
│   ├── styles.css          # Arquivo principal de estilos
│   ├── bootstrap-sidebar.css # Estilos específicos para o sidebar
│   └── sidebar.css         # Estilos complementares do sidebar
├── js/                     # Scripts JavaScript
│   ├── main.js             # Script principal e inicialização
│   ├── drawing/            # Módulo de desenho modular
│   │   ├── index.js        # Exportações do módulo de desenho
│   │   ├── core.js         # Funções principais de SVG
│   │   ├── elements.js     # Elementos da porta (dobradiças, puxadores)
│   │   ├── door-types.js   # Tipos de portas (abrir, deslizante)
│   │   ├── annotations.js  # Cotas e legendas
│   │   ├── utils.js        # Utilitários para desenho
│   │   └── config.js       # Configurações do desenho
│   ├── drawing.js          # Reexportação do módulo de desenho
│   ├── ui-controls.js      # Controles de interface do usuário
│   ├── form-handlers.js    # Manipuladores de formulários
│   ├── utils.js            # Funções utilitárias
│   ├── storage.js          # Persistência de dados
│   ├── printing.js         # Funções de impressão e exportação
│   ├── sidebar.js          # Controlador do sidebar
│   ├── initialize.js       # Inicialização de dependências
│   ├── notifications.js    # Sistema de notificações
│   └── diagnostico.js      # Ferramentas de diagnóstico
├── img/                    # Imagens e recursos
├── components/             # Componentes reutilizáveis
├── docs/                   # Documentação detalhada
│   ├── DOCUMENTACAO.md     # Documentação do sistema
│   └── MELHORIAS.md        # Lista de melhorias realizadas
├── tests/                  # Testes unitários e de integração
├── package.json            # Definição de dependências e scripts
└── index.html              # Página HTML principal
```

## Funcionalidades

- Configuração de dimensões e características da porta
- Visualização em tempo real com desenho técnico vetorial (SVG)
- Salvamento e carregamento de configurações
- Impressão otimizada para documentação
- Suporte a diferentes tipos de portas (deslizantes, com dobradiças)
- Personalização de materiais e puxadores
- Configuração detalhada de dobradiças e puxadores

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- SVG para desenho vetorial
- LocalStorage para persistência de dados
- Bootstrap 5 para interface de usuário
- HTML2PDF.js para exportação para PDF

## Como Usar

1. Configure o tipo de porta, dimensões e materiais no painel lateral
2. Ajuste as posições de dobradiças e puxadores conforme necessário
3. Veja o resultado em tempo real na área de desenho
4. Utilize os botões para imprimir ou exportar como PDF

## Desenvolvimento

Para contribuir com o desenvolvimento:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Testes

O projeto inclui testes automatizados utilizando Jest. Para executar os testes:

```bash
npm test
```

Para gerar relatório de cobertura:

```bash
npm run test:coverage
```

## Licença

Copyright © Conecta Soluções. Todos os direitos reservados.