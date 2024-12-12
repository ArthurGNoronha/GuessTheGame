# Guess The Game

### Este projeto é totalmente ~~copiado~~ inspirado no site atual e já existente [Guess The Game](https://guessthe.game). Todos os créditos ao criador.

#### A intenção não é copiar ou roubar a ideia, e sim apenas aprofundar meus conhecimentos e entendimentos de programação, principalmente com manipulação de imagens!

---

## Estrutura do Projeto

### **1. Images**
- Pasta contendo as imagens que aparecerão para o usuário tentar adivinhar.
  - **Nota:** Caso deseje alterar as imagens, evite nomear a pasta ou os arquivos com o nome do jogo para impedir que os usuários descubram "sem querer".

### **2. Pages**
- Contém a página principal do projeto, desenvolvida utilizando EJS (HTML), CSS e JavaScript.

### **3. Routes**
- Diretório que contém todo o backend do projeto, desenvolvido inteiramente em Node.js.
  - **Arquivos:**
    - `DB.js` e `middleware.js`: Arquivos de configuração que precisam de poucos ou nenhum ajuste.
    - `game.js`: Responsável por criar as rotas utilizando Express.js e a lógica da aplicação.

### **4. Jogos.json**
- Arquivo que contém a lista de jogos para popular o banco de dados (MongoDB).
  - **Nota:** Atualmente, a lista de jogos está no frontend (`index.ejs`) e não diretamente no banco. Isso pode ser alterado para popular o banco automaticamente com um `forEach` básico dentro do index.ejs. Essa decisão foi tomada para simplificar o desenvolvimento inicial.

### **5. Server.js**
- É usado para iniciar o servidor e gerenciar as rotas.

---

## Instalação

### **Requisitos necessários:**
1. Node.js
2. MongoDB (versão local ou MongoDB Atlas)
3. Git

### **Populando o Banco de Dados**
1. Dentro do MongoDB, crie um banco de dados chamado `GuessTheGame`.
2. Adicione as coleções `games` e `users`.
3. Insira o arquivo `jogos.json` na coleção `games` para popular o banco.

## Utilizando MongoDB Atlas

1. Configure o MongoDB Atlas através do link [MongoDB Atlas](https://cloud.mongodb.com/):
   - Crie um cluster.
   - Crie o banco de dados `GuessTheGame`.
   - Adicione as coleções `games` e `users`.
   - Importe ou copie o conteúdo do arquivo `jogos.json` para a coleção `games`.

2. Edite o arquivo `DB.js` localizado na pasta `Routes`:
   - Adicione a linha:
     ```javascript
     const URI = '*Link do seu BD na nuvem*';
     ```
   - Substitua a linha:
     ```javascript
     const client = new MongoClient('mongodb://localhost:27017');
     ```
     por:
     ```javascript
     const client = new MongoClient(URI);
     ```
---

### **Inicialização do Projeto**
1. Clone o repositório com o comando:
   ```bash
   git clone https://github.com/ArthurGNoronha/GuessTheGame
   ```
2. Inicie o servidor com um dos comandos abaixo:
   ```bash
   node server
   ```
   ou
   ```bash
   npm start
   ```
3. Acesse o projeto em:
   - `localhost:3000`
   - `127.0.0.1:3000`

---

## Contribuições

- [Arthur Noronha](https://github.com/ArthurGNoronha)
- Inspirado totalmente em [Guess The Game](https://guessthe.game)

---

## Contribuindo

- Sinta-se a vontade para abrir qualquer issue ou me avisar de qualquer erro ou melhoria :)
