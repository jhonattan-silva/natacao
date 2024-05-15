var equipesRetornadas = []; //equipes retornadas na busca ajax
var todosPreenchidos = false; //verificador se todos os campos estão preenchidos
var cpfOK = false; //cpf valido e preenchido
var foneOK = false; //tel valido e preenchido

/*BUSCA EQUIPE AJAX*/
$(document).ready(function () {
    var inputEquipe = $('input[name="equipe"]');
    // Campo oculto para armazenar o valor selecionado
    var equipeSelecionada = $('<input>').attr('type', 'hidden').appendTo('form');
    // Flag para verificar se a seleção foi feita a partir do autocomplete
    var selecionadoDoAutocomplete = false;
    inputEquipe.on('input', function () {
        var input = $(this).val();
        if (input.length >= 1) { //ao digitar o segundo caracter
            $.ajax({
                url: '/buscarEquipes',
                data: { equipe: input },
                success: function (data) {
                    var nomesDasEquipes = data.map(function (equipe) {
                        return equipe.nome;
                    });
                    inputEquipe.autocomplete({
                        source: nomesDasEquipes,
                        select: function (event, ui) {
                            // Quando um item é selecionado, atualiza o valor do campo de entrada
                            inputEquipe.val(ui.item.value);
                            // Armazena o valor selecionado no campo oculto
                            equipeSelecionada.val(ui.item.value);
                            // Define a flag como verdadeira
                            selecionadoDoAutocomplete = true;
                        }
                    });
                }
            });
        }
    });
    /*  FIM BUSCA EQUIPES   */

        /*  VALIDA SE ESCOLHEU EQUIPE DO BANCO  */
    // Adiciona um ouvinte de evento para o evento 'change'
    inputEquipe.on('change', function () {
        // Se o valor atual do campo de entrada não estiver na lista de equipes retornadas e a seleção não foi feita a partir do autocomplete, limpa o campo de entrada
        if (!equipesRetornadas.includes($(this).val()) && !selecionadoDoAutocomplete) {
            $(this).val('');
            equipeSelecionada.val('');
        }
        // Redefine a flag
        selecionadoDoAutocomplete = false;
    });
    /*  FIM VALIDA EQUIPE*/

    /*  AVANÇAR COM ENTER   */
    $(document).on('keypress', function (e) {
        if (e.which == 13) { // 13 é o código de tecla para Enter
            // Aciona o evento de clique no botão
            $('.next').click();
        }
    });
    /*  FIM AVANÇA COM ENTER */


    /*  Valida CPF  */
    var inputCPF = $('input[name="cpf"]');
    inputCPF.mask('000.000.000-00');

    inputCPF.on('keyup', function () {
        var cpf = $(this).val().replace(/[^0-9]/g, '').toString();
        if (cpf.length == 11) {
            var v = [];
            //Calcula o primeiro dígito de verificação.
            v[0] = 0;
            for (var i = 0; i < 9; i++) {
                v[0] += parseInt(cpf.charAt(i)) * (10 - i);
            }
            v[0] = 11 - (v[0] % 11);
            if (v[0] > 9) v[0] = 0;
            //Calcula o segundo dígito de verificação.
            v[1] = 0;
            for (var i = 0; i < 10; i++) {
                v[1] += parseInt(cpf.charAt(i)) * (11 - i);
            }
            v[1] = 11 - (v[1] % 11);
            if (v[1] > 9) v[1] = 0;
            //Retorna Verdadeiro se os dígitos de verificação são os esperados.
            if ((v[0] != cpf.charAt(9)) || (v[1] != cpf.charAt(10))) {
                $(this).addClass('is-invalid');
                $('#cpf-icon').html('<i class="fas fa-exclamation-circle"></i>');
                $('#cpf-error').text('CPF inválido'); // Adiciona a mensagem de erro
            } else {
                $(this).removeClass('is-invalid');
                $('#cpf-icon').html('');
                $('#cpf-error').text(''); // Limpa a mensagem de erro
            }
        } else {
            $(this).addClass('is-invalid');
            $('#cpf-icon').html('<i class="fas fa-exclamation-circle"></i>');
        }
    });

    inputCPF.blur(function () {
        var cpf = $(this).val().replace(/[^0-9]/g, '').toString();
        if (cpf.length != 11) { //se estiver faltando digitos do cpf
            alert('CPF inválido');
        }else{
            cpfOK = true;
        }
    });
    /*  FIM VALIDA CPF*/

    /*    VALIDA DATA NASC   */
    // Função para converter a data de nascimento para o formato MySQL
function convertToMySQLDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
    /*   FIM VALIDA DATA NASC   */
    
    /*    VALIDA TELEFONE     */
    var inputFone = $('input[name="fone"]');
    inputFone.mask('(00) 00000-0000');

    inputFone.blur(function () {
        var telefone = inputFone.val().replace(/[^0-9]/g, '').toString();
        if (telefone.length < 9 || telefone.length > 11) { //se tiver menos digitos que telefone fixo ou mais que celular
            alert('Telefone inválido');
        }else{
            foneOK = true;
        }
    });
    /*  FIM VALIDA TELEFONE */


    /*  MODAL DESEJA CONTINUAR  */
    $('.submit').on('click', function (e) {
        todosPreenchidos = true;
        // Verifica cada campo de entrada no formulário
        $('form').find('input').each(function () {
            // Se o campo de entrada está vazio
            if (!$(this).val()) {
                todosPreenchidos = false;
                // Sai do loop
                return false;
            }
        });

        if (!todosPreenchidos || !foneOK || !cpfOK) { //se está tudo preenchido, o telefone e o cpf foram validados
            e.preventDefault(); // Impede a submissão do formulário
            alert('Por favor, preencha todos os campos corretanente antes de salvar.');
        } else {
            // Se todos os campos estão preenchidos, exibe o modal
            $('#confirmationModal').modal('show');
        }
        /*Fim verificações de preenchimento*/
// Coleta os dados do formulário
var nome = $('input[name="nome"]').val();
var cpf = $('input[name="cpf"]').val();
var dtnasc = convertToMySQLDate(new Date($('input[name="dtnasc"]').val())); // Converte a data
var telefone = $('input[name="fone"]').val();
var idEquipe = $('input[type="hidden"]').val();

// Envia os dados para o servidor usando uma requisição AJAX
fetch('/salvarNadador', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: nome,
        cpf: cpf,
        dtnasc: dtnasc,
        telefone: telefone,
        idEquipe: idEquipe
    })
})
.then(response => response.json())
.then(data => {
    // Trate a resposta do servidor (por exemplo, exiba uma mensagem de sucesso)
    console.log(data.message);
})
.catch(error => {
    // Trate erros (por exemplo, exiba uma mensagem de erro)
    console.error('Erro ao salvar nadador:', error);
});




    });


    /*  CONTROLE DO MODAL   */
    $('#adicionaOutro').on('click', function () {
        limparCampos();
        $('#confirmationModal').modal('hide');
    });

    function limparCampos() {
        $('#cadNadador').find('input').val('');
    }

    // Quando o botão 'Encerrar' é clicado
    $('#encerraCadastro').on('click', function () {
        alert("Nadador cadastrado com sucesso!");
        window.location.href = 'http://localhost:3000/html/admin.html';
    });
    /*  FIM MODAL DESEJA CONTINUAR */






});//fecha $(document).ready



// Adiciona um ouvinte de evento para executar o código quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', (event) => {
    // Função para adicionar a classe 'active' ao próximo elemento da lista
    function proximoItem(currentFieldset) {
        // Obtém a barra de progresso pelo ID
        var progressBar = document.getElementById('progressbar');
        // Obtém todos os elementos da lista na barra de progresso
        var listItems = progressBar.getElementsByTagName('li');
        // Encontra o índice do fieldset atual na lista de fieldsets
        var currentIndex = Array.from(listItems).findIndex(li => li === currentFieldset);
        // Remove a classe 'active' de todos os elementos da lista
        Array.from(listItems).forEach(li => li.classList.remove('active'));
        // Se o fieldset atual não for o último, adiciona a classe 'active' ao próximo
        if (currentIndex < listItems.length - 1) {
            listItems[currentIndex + 1].classList.add('active');
        }
    }

    // Função para remover a classe 'active' do elemento atual da lista
    function deactivateCurrentListItem(currentFieldset) {
        // Obtém a barra de progresso pelo ID
        var progressBar = document.getElementById('progressbar');
        // Obtém todos os elementos da lista na barra de progresso
        var listItems = progressBar.getElementsByTagName('li');
        // Encontra o índice do fieldset atual na lista de fieldsets
        var currentIndex = Array.from(listItems).findIndex(li => li === currentFieldset);
        // Remove a classe 'active' de todos os elementos da lista
        Array.from(listItems).forEach(li => li.classList.remove('active'));
        // Se o fieldset atual não for o primeiro, adiciona a classe 'active' ao anterior
        if (currentIndex >= 0) {
            listItems[currentIndex].classList.add('active');
        }
    }

    // Função para lidar com o clique no botão 'next'
    function handleNextButtonClick(event) {
        // Obtém o fieldset atual a partir do botão que foi clicado
        var currentFieldset = event.target.parentNode;
        // Obtém o próximo fieldset
        var nextFieldset = currentFieldset.nextElementSibling;
        // Se houver um próximo fieldset...
        if (nextFieldset) {
            // Ativa o próximo item da lista na barra de progresso
            proximoItem(currentFieldset);
            // Mostra o próximo fieldset
            nextFieldset.style.display = 'block';
            // Esconde o fieldset atual
            currentFieldset.style.display = 'none';
        }
    }

    // Função para lidar com o clique no botão 'previous'
    function handlePreviousButtonClick(event) {
        // Obtém o fieldset atual a partir do botão que foi clicado
        var currentFieldset = event.target.parentNode;
        // Obtém o fieldset anterior
        var previousFieldset = currentFieldset.previousElementSibling;
        // Se houver um fieldset anterior...
        if (previousFieldset) {
            // Desativa o item atual da lista na barra de progresso
            deactivateCurrentListItem(currentFieldset);
            // Mostra o fieldset anterior
            previousFieldset.style.display = 'block';
            // Esconde o fieldset atual
            currentFieldset.style.display = 'none';
        }
    }

    // Obtém todos os botões 'next'
    var nextButtons = document.getElementsByClassName('next');
    // Adiciona um ouvinte de evento a cada botão 'next' para lidar com o clique
    Array.from(nextButtons).forEach(button => {
        button.addEventListener('click', handleNextButtonClick);
    });

    // Obtém todos os botões 'previous'
    var previousButtons = document.getElementsByClassName('previous');
    // Adiciona um ouvinte de evento a cada botão 'previous' para lidar com o clique
    Array.from(previousButtons).forEach(button => {
        button.addEventListener('click', handlePreviousButtonClick);
    });
    //FIM DO MULTIFORM


    /*SÓ AVANÇA SE ESCOLHER UMA EQUIPE*/
    function handleNextButtonClick(event) {
        var currentFieldset = event.target.parentNode;
        var nextFieldset = currentFieldset.nextElementSibling;
        // Obtém o valor do campo oculto
        var valorSelecionado = $('input[type="hidden"]').val();
        if (valorSelecionado) {
            if (nextFieldset) {
                proximoItem(currentFieldset);
                nextFieldset.style.display = 'block';
                currentFieldset.style.display = 'none';
            }
        } else {
            // Mostra uma mensagem de erro se nenhum valor foi selecionado
            alert('Por favor, escolha uma equipe válida.');
        }
    }
    /*  FIM VERIFICA EQUIPE*/
});

