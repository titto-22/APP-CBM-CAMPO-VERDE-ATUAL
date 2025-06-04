# APP-CBM-CAMPO-VERDE

Projeto de desenvolvimento de um aplicativo para emergências do corpo de bombeiros militar de Campo verde, onde será possível informar incidentes através do celular

## Linguagem de programação

`React.Native`

Criando arquitetura do projeto React.Native
`npx create-expo-app MudeNomeAqui --template blank`

Para executar o servidor que roda o projeto `npx expo start`

Pode ocorrer de não conseguir conseguir conectar ao projeto por problemas com firewall ou isolamento de AP no roteador.
Nesse caso pode usar `npx expo start -c --tunnel`

## Bibliotecas

### Biblioteca de Navegação

[biblioteca de navegação](https://reactnavigation.org/)

`npm install @react-navigation/native`

`npx expo install react-native-screens react-native-safe-area-context`

#### Biblioteca para uso de SVG

[Documentação do Expo Go](https://docs.expo.dev/versions/latest/sdk/svg/)

`npx expo install react-native-svg`

`yarn add --dev react-native-svg-transformer -D`

#### Biblioteca para localização

`npm install @react-native-community/geolocation --save`

[Video Tutorial](https://www.youtube.com/watch?v=7DY1tHHudtM)

## Manual de orientações do Projeto

### Registro e identificação de operações

* Toda operação de **inclusão**  realizada dentro do sistema tem que ter registro da data e usuário que incluiu
* Toda operação de **alteração** deve registrar data e usuário que realizou a alteração.

#### Atenção!!!

Os campos de registro de inclusão `date`e `user` **não devem jamais ser alterados**.

Os dados de alteração serão registrados em campos diferentes

## Banco de dados

Utilizaremos o banco de dado **postgresql** por ser open source, utilizaremos todo o serviço de banco de dados com o **Docker**, usaremos a imagem `bitnami/postgresql:latest`.

Utilizaremos o [ORM Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch) para gerenciar nosso banco de dados.

### Preparações

Inicialmente é necessário instalar o `docker` e o `prisma`.

```javascript
//Instalação do prisma
npm install @prisma/client
//Esta instalação é sem typescript
//Para typescript -- npm install prisma typescript tsx @types/node --save-dev
npm install prisma -D
npx prisma
//Cria a pasta prisma no projeto
npx prisma init
```

Depois de instalar o prisma é necessário criar o arquivo `docker-compose.yml` onde será configurado as informações para criar o banco de dados.

```yml
//Exemplo de um arquivo docker-compose
version: '3.7'

name: NomeDoDocker

services:
  pg:
    container_name: NomeDoDocker
    image: bitnami/postgresql:latest
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=NomeDoUsuarioDoBancoDeDados
      - POSTGRES_PASSWORD=Senha
      - POSTGRES_DB=NomeDoBancoDeDados
```

Além da pasta prisma será criado um arquivo `.env`,  será necessário configurar os dados de conexão nele.

```env
DATABASE_URL="postgresql://NomeDoUsuarioDoBancoDeDados:Senha@localhost:5432/NomeDoBancoDeDados?schema=public"
```

Inicia o docker e para iniciar o serviço do banco de dados executar `docker compose up -d`.

Após carregar teremos um banco de dados rodando, sendo necessário criar as tabelas.

Criar as tabelas na pasta `prisma/esquema.prisma` conforme [documentação.](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-prismaPostgres?utm_source=docs)

``` node
npx prisma migrate dev --name init
```

### Atualização de versão dos pacotes

Caso comece a informar que os pacotes instalados são de versão anterior a esperada, basta usar o comando `npx expo install --fix`para atualizar.
