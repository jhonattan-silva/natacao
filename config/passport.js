// Importando módulos necessários
const passport = require('passport'); // Módulo para autenticação
const LocalStrategy = require('passport-local').Strategy; // Estratégia de autenticação local do Passport
const bcrypt = require('bcrypt'); // Módulo para criptografia de senha
const db = require('./db'); // Importa configurações do banco de dados

// Configuração da estratégia de autenticação local
passport.use(new LocalStrategy((username, password, done) => {
  // Consulta o banco de dados para encontrar o usuário pelo nome de usuário
  db.query('SELECT id, username, password FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return done(err); // Se houver um erro, retorna o erro
    if (results.length === 0) return done(null, false, { message: 'Usuário não encontrado' }); // Se o usuário não for encontrado, retorna uma mensagem de erro

    const user = results[0]; // Obtém o usuário do resultado da consulta

    // Compara a senha fornecida com a senha armazenada usando bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return done(err); // Se houver um erro, retorna o erro
      if (!isMatch) return done(null, false, { message: 'Senha incorreta' }); // Se a senha não corresponder, retorna uma mensagem de erro

      return done(null, user); // Se tudo estiver correto, retorna o usuário
    });
  });
}));

// Serializa o usuário para a sessão
passport.serializeUser((user, done) => {
  done(null, user.id); // Armazena apenas o ID do usuário na sessão
});

// Desserializa o usuário da sessão
passport.deserializeUser((id, done) => {
  // Consulta o banco de dados para encontrar o usuário pelo ID
  db.query('SELECT id, username FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err); // Se houver um erro, retorna o erro
    done(null, results[0]); // Retorna o usuário encontrado
  });
});

// Exporta o objeto passport configurado
module.exports = passport;
