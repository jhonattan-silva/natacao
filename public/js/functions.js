// Usuário e senha fictícios para teste
var testUser = '22341688802';
var testPassword = '123';

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


// Função para formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    // Lógica de validação de CPF
    // ...
    return true;
}

// Função para formatar telefone
function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
    telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
    telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');
    return telefone;
}

// Função para validar telefone
function validarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    // Lógica de validação de telefone
    // ...
    return true;
}

export { formatarCPF, validarCPF, formatarTelefone, validarTelefone };
