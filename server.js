// Importando o módulo Express
const express = require('express');
// Importando o módulo MySQL
const mysql = require('mysql2');
// Importando o módulo path
const path = require('path');
// Criando uma instância do Express
const app = express();
// Definindo a porta que o servidor vai escutar
const port = process.env.PORT || 3000;
//Iniciar o dotenv para credenciais do arquivo env
require('dotenv').config();

// Criando a conexão com o BD
const db = mysql.createConnection({
  host: process.env.DB_HOST, // O host do banco
  user: process.env.DB_USER, // O usuário do banco
  password: process.env.DB_PASS, // A senha do usuário
  database: process.env.DB_NAME // O nome do banco
});

// Conectando ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
  console.log('Conectado ao banco de dados');
});

// Adicionando middleware para analisar JSON e dados de formulários (para comunicação fetch entre server e client)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definindo os caminhos estaticos
/*
app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/html'));
app.use(express.static(__dirname + '/public/assets'));
app.use(express.static(__dirname));/*/
app.use(express.static('public'));

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

//importando a rota da inscricao
var inscricaoRoute = require('./routes/inscricaoRoute')(app, db);

//Página não encontrada (ÚLTIMA ROTA!!!!)
app.use((req, res) => {
  res.status(404).send('Desculpe, não conseguimos encontrar isso!');
});

//Exporta a conexão para outros JS
module.exports = db;

