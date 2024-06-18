// Importando módulos
const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const rateLimit = require('express-rate-limit');
const https = require('https');

// Conexão com banco de dados e passport
const db = require('./config/db');
require('./config/passport');

// Criando app Express
const app = express();

// Definindo porta e inicializando dotenv
const port = process.env.PORT || 3000;
dotenv.config();

// Pastas estáticas e middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirecionamento HTTP para HTTPS
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

// Configuração da sessão com MySQLStore
const sessionStore = new MySQLStore({}, db);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2 // 2 horas
  }
}));

// Inicializando Passport e Flash
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Limitador de requisições para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite de 5 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente após 15 minutos.'
});

// Rotas de autenticação
app.use('/auth', require('./routes/authRoutes'));

// Middleware de autenticação
const ensureAuthenticated = require('./middlewares/authMiddleware');

// Exemplo de rota protegida
app.get('/pagina-protegida', ensureAuthenticated, (req, res) => {
  res.send('Esta é uma página protegida');
});

// Rota para página principal (pública)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Importando e utilizando rotas
const inscricaoRoute = require('./routes/inscricaoRoute');
const resultadosRoute = require('./routes/resultadosRoute');
const adminRoute = require('./routes/adminRoute');

app.use('/inscricao', inscricaoRoute);
app.use('/resultados', resultadosRoute);
app.use('/admin', adminRoute);

// Página não encontrada
app.use((req, res) => {
  res.status(404).send('Desculpe, não conseguimos encontrar isso!');
});

// Opções e inicialização do servidor HTTPS
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Servidor rodando em https://localhost:${port}`);
});

// Exportando conexão com banco de dados
module.exports = db;
