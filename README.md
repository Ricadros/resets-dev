# Resets Informática

Site institucional da Resets Informática, empresa de tecnologia em Manaus. Apresenta os serviços oferecidos e direciona os visitantes aos canais de contato para solicitar orçamentos.

## Tecnologias

- HTML5 para o conteúdo das páginas.
- CSS para o visual responsivo, com tema preto e azul.
- JavaScript puro para as interações, sem bibliotecas externas.
- Google Fonts para as fontes Archivo Black, Space Grotesk e IBM Plex Sans.

O projeto é estático: não utiliza backend, banco de dados, gerenciador de pacotes ou etapa de build.

## Como abrir

Abra o arquivo `index.html` em um navegador. Não é necessário instalar dependências para visualizar o site.

As fontes do Google e os destinos externos, como WhatsApp e Instagram, precisam de conexão com a internet.

## Estrutura

```text
resets-dev/
├── index.html                         # Página inicial
├── README.md                          # Documentação do projeto
├── logo.jpeg                          # Logo e favicon
├── assets/
│   ├── style.css                      # Estilos compartilhados
│   └── main.js                        # Interações compartilhadas
└── servicos/
    ├── sistemas-e-web.html             # Sistemas e sites
    ├── manutencao-e-montagem.html       # Manutenção e montagem de PCs
    ├── redes-e-infraestrutura.html     # Redes e infraestrutura
    ├── seguranca-eletronica.html       # Segurança eletrônica
    └── logo.jpeg
```

## Funcionalidades

- Página inicial com apresentação da empresa, serviços e contato.
- Páginas individuais com detalhes dos serviços e perguntas frequentes.
- Menu para dispositivos móveis.
- Animações de entrada ao rolar a página, respeitando a preferência por movimento reduzido.
- Perguntas frequentes com apenas um item aberto por lista.
- Ano atualizado automaticamente no rodapé.
- Links para solicitar orçamento pelo WhatsApp ou enviar e-mail.

## Manutenção

Edite `index.html` para atualizar o conteúdo da página inicial e os arquivos em `servicos/` para alterar os detalhes de cada serviço.

O arquivo `assets/style.css` concentra os estilos de todas as páginas. As variáveis em `:root` definem as cores, fontes e medidas principais. As interações ficam em `assets/main.js`.

Cabeçalhos, rodapés e dados de contato estão repetidos nos arquivos HTML. Ao alterá-los, confira todas as páginas para manter as informações consistentes.

Preserve os caminhos relativos: a página inicial usa `assets/`, enquanto as páginas de serviço usam `../assets/`.

## Verificação manual

O projeto não possui testes automatizados configurados. Depois de fazer alterações:

1. Abra a página inicial e as quatro páginas de serviço.
2. Confira a navegação, os links de contato e o carregamento dos estilos e imagens.
3. Teste o layout em larguras de celular e computador, incluindo o menu móvel.
4. Verifique as perguntas frequentes e as animações de entrada.
5. Confira se o console do navegador apresenta erros.

## Publicação

O site pode ser servido por uma hospedagem de arquivos estáticos. Publique `index.html`, `logo.jpeg` e as pastas `assets/` e `servicos/`, preservando a estrutura de diretórios. Não é necessário executar um build.

## Contato

- [WhatsApp](https://wa.me/5592985129159)
- [Instagram](https://www.instagram.com/resets.dev)
- E-mail: [resets.dev@gmail.com](mailto:resets.dev@gmail.com)
