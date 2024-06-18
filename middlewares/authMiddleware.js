// Função de middleware para garantir que o usuário esteja autenticado
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { // Se o usuário estiver autenticado
    return next(); // Passa para a próxima função de middleware
  }
  res.redirect('/login'); // Se o usuário não estiver autenticado, redireciona para a página de login
}

// Exporta a função de middleware
module.exports = ensureAuthenticated;
