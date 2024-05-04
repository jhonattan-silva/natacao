// Importando o módulo Express
const express = require('express');

// Importando o módulo MySQL
const mysql = require('mysql');

// Criando uma instância do Express
const app = express();

// Definindo a porta que o servidor vai escutar
const port = 3000;

// Criando a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost', // O host do banco de dados
  user: 'seu_usuario', // O usuário do banco de dados
  password: 'sua_senha', // A senha do usuário
  database: 'seu_banco_de_dados' // O nome do banco de dados
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

// Continue com o seu código existente para servir arquivos estáticos aqui...

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
