// Importando o módulo Express
const express = require('express');

// Importando o módulo MySQL
const mysql = require('mysql');

// Importando o módulo path
const path = require('path');

// Criando uma instância do Express
const app = express();

// Definindo a porta que o servidor vai escutar
const port = 3000;

// Criando a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost', // O host do banco de dados
  user: 'root', // O usuário do banco de dados
  password: 'Jhow3224', // A senha do usuário
  database: 'liga_natacao' // O nome do banco de dados
});

// Conectando ao banco de dados
db.connect((err) => {
  if (err) {
    throw err; // Se houver um erro, lance o erro
  }
  console.log('Conectado ao banco de dados'); // Se não houver erros, imprima uma mensagem de sucesso
});

// Definindo uma rota para testar a conexão com o banco de dados
app.get('/testdb', (req, res) => {
  let sql = 'SELECT * FROM sua_tabela'; // A consulta SQL para executar
  db.query(sql, (err, result) => { // Executando a consulta SQL
    if (err) throw err; // Se houver um erro, lance o erro
    console.log(result); // Se não houver erros, imprima o resultado da consulta
    res.send('Dados do banco de dados aqui...'); // Enviando uma resposta para o cliente
  });
});


// Definindo os caminhos estaticos
app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname));



// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

//Página não encontrada
app.use((req, res) => {
  res.status(404).send('Desculpe, não conseguimos encontrar isso!');
});
