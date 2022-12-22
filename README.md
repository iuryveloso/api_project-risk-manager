# API do Gerenciador de Riscos de Projetos

API utilizada para o [Gerenciador de Riscos de Projetos](https://github.com/iuryveloso/project-risk-manager), feita com [Express.js](https://nextjs.org/).

## Instalação

Primeiramente, é necessario ter instalado o [Node.js](https://nodejs.org/en/) em seu computador.

Depois, inicie em modo desenvolvedor com o comando:

```bash
yarn dev
```

Ou, inicie em modo de produção:

```bash
yarn build && yarn start
```

A api será executada em http://localhost:3333.

As configuração do sistema devem seu feitas atraves de um arquivo `.env`, que pode ser criado à partir do arquivo `.env example`.

É possivel também usar o [Docker](https://docs.docker.com/engine/install/) para rodar essa aplicação. Para isso, basta utilizar [este](https://github.com/iuryveloso/docker_project-risk-manager) repositório.
