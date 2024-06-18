// Usuário e senha fictícios para teste
var testUser = '22341688802';
var testPassword = '123';

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) { //se na pagina tiver o um elemento com o id: loginForm - se tiver opção de login
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var username = document.getElementById('username').value; // OBTÉM O VALOR DO NOME DE USUÁRIO
            var password = document.getElementById('password').value; // OBTÉM O VALOR DA SENHA

            // Verifica se o nome de usuário e a senha inseridos correspondem ao usuário e senha de teste
            if (username === testUser && password === testPassword) {
                alert('Login bem sucedido!'); // EXIBE MENSAGEM DE SUCESSO
                window.location.href = `html/admin.html`; // REDIRECIONA PARA A PÁGINA ADMIN
            } else {
                alert('Nome de usuário ou senha incorretos!'); // EXIBE MENSAGEM DE ERRO
            }
        });
    }
}); 

// Função para validar CPF
export function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    var v = [];
    v[0] = 0;
    for (var i = 0; i < 9; i++) {
        v[0] += parseInt(cpf.charAt(i)) * (10 - i);
    }
    v[0] = 11 - (v[0] % 11);
    if (v[0] > 9) v[0] = 0;

    v[1] = 0;
    for (var i = 0; i < 10; i++) {
        v[1] += parseInt(cpf.charAt(i)) * (11 - i);
    }
    v[1] = 11 - (v[1] % 11);
    if (v[1] > 9) v[1] = 0;

    return v[0] == cpf.charAt(9) && v[1] == cpf.charAt(10);
}

// Função para gerenciar máscara e validação de CPF
export function gerenciarCPF() {
    var cpfValido = false; // CPF válido e preenchido
    var inputCPF = $('input[name="cpf"]');
    inputCPF.mask('000.000.000-00');

    inputCPF.on('keyup', function () {
        var cpf = $(this).val();
        cpfValido = validarCPF(cpf); // Aplica o CPF na função de validação

        if (cpfValido) {
            $(this).removeClass('is-invalid');
            $('#cpf-icon').html('');
            $('#cpf-error').text('');
        } else {
            $(this).addClass('is-invalid');
            $('#cpf-icon').html('<i class="fas fa-exclamation-circle"></i>');
            $('#cpf-error').text('CPF inválido');
        }
    });

    inputCPF.blur(function () {
        var cpf = $(this).val();
        cpfValido = validarCPF(cpf);
        if (!cpfValido) { // Se a função retornar falso
            alert('CPF inválido');
        }
    });

    return function() { return cpfValido; }; // Retorna uma função para verificar o status do CPF
}


// Função para formatar telefone
export function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
    telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
    telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');
    return telefone;
}

// Função para validar telefone
export function validarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    // Lógica de validação de telefone
    // ...
    return true;
}