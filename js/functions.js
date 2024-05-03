// Usuário e senha fictícios para teste
var testUser = '22341688802';
var testPassword = 'teste';

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Verifica se o nome de usuário e a senha inseridos correspondem ao usuário e senha de teste
    if(username === testUser && password === testPassword) {
        alert('Login bem sucedido!');
        window.location.href = `html/admin.html`;
    } else {
        alert('Nome de usuário ou senha incorretos!');
    }
});
