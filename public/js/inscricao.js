var todosPreenchidos = false; //verificador se todos os campos estão preenchidos
var cpfValido = false; //cpf valido e preenchido
var foneOK = false; //tel valido e preenchido

/*BUSCA EQUIPE*/
document.addEventListener('DOMContentLoaded', function () {
    var inputEquipe = $('input[name="equipe"]');
    var equipeSelecionada = $('input[name="equipeSelecionada"]');
    var selecionadoDoAutocomplete = false; //flag se selecionou equipe do banco
    var equipesRetornadas = []; //array com resultados da busca

    inputEquipe.on('input', function () {
        var inputBusca = this.value; //inputBusca recebe o que for sendo digitado
        if (inputBusca.length >= 1) { //a partir do primeiro caracter começa a buscar
            fetch(`/buscarEquipes?equipe=${encodeURIComponent(inputBusca)}`)
                .then(response => response.json()) //transforma o retorno em json
                .then(data => { 
                    equipesRetornadas = data.map(function (equipe) { //mapeia as equipes
                        return { //retorna o id e nome de cada equipe no json
                            id: equipe.id,
                            nome: equipe.nome
                        };
                    });
                    inputEquipe.autocomplete({ //função autocompletar no input para receber a escolha vinda do banco
                        source: equipesRetornadas.map(function (equipe) { //acha no map a equipe selecionada
                            return equipe.nome; //joga o nome no input
                        }),
                        select: function (event, ui) { //jquery UI
                            const nomeEquipeLista = ui.item.value; // Nome da equipe da lista
                            const equipeCorrespondente = equipesRetornadas.find(equipe => equipe.nome === nomeEquipeLista);
                            const idEquipeBanco = equipeCorrespondente.id; // ID correspondente no banco
                            equipeSelecionada.val(idEquipeBanco); // Armazena o ID da equipe no campo oculto
                            selecionadoDoAutocomplete = true; //muda a flag informando que não foi digitado e sim escolhido do banco
                        }
                    });
                })
                .catch(error => {
                    console.error('Erro ao buscar equipes:', error);
                });
        }
    });

    /*  Valida se escolheu equipe pré-cadastrada */
    inputEquipe.on('change', function () { //se clicar fora sem escolher uma equipe do banco, vai limpar o input
        if (!equipesRetornadas.some(equipe => equipe.nome === $(this).val()) && !selecionadoDoAutocomplete) {
            $(this).val('');
            equipeSelecionada.val('');
        }
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

    /*  VALIDA CPF  */
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
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


    /*  Valida CPF  */
    var inputCPF = $('input[name="cpf"]');
    inputCPF.mask('000.000.000-00');

    inputCPF.on('keyup', function () {
        var cpf = $(this).val();
        cpfValido = validarCPF(cpf); //aplica o cpf na função de validação

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
        if (!validarCPF(cpf)) { //se a função retornar falso
            alert('CPF inválido');
        } else {
            cpfValido = true;
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
        } else {
            foneOK = true;
        }
    });
    /*  FIM VALIDA TELEFONE */


    /*  MODAL DESEJA CONTINUAR  */
    $('.submit').on('click', function (e) {
        e.preventDefault();
        todosPreenchidos = true;
        $('form').find('input').each(function () {
            if (!$(this).val()) {
                todosPreenchidos = false;
                return false;
            }
        });

        let sexo = '';
        const radios = document.querySelectorAll('input[name="sexo"]');
        radios.forEach(radio => {
            if (radio.checked) {
                sexo = radio.value;
            }
        });

        if (!todosPreenchidos || !foneOK || !cpfValido || !sexo) {
            alert('Por favor, preencha todos os campos corretamente antes de salvar.');
        } else {
            const nome = $('input[name="nome"]').val();
            const cpf = $('input[name="cpf"]').val().replace(/\D/g, '');//somente numeros
            const data_nasc = $('input[name="dtnasc"]').val();
            const telefone = $('input[name="fone"]').val();
            const idEquipe = equipeSelecionada.val();
            const sexo = $("input[type='radio'][name='sexo']:checked").val();


            fetch('/salvarNadador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome, // Nome do nadador
                    cpf: cpf, // CPF do nadador
                    sexo: sexo, //sexo do nadador
                    data_nasc: data_nasc, // Data de nascimento do nadador
                    telefone: telefone, // Telefone do nadador
                    idEquipe: idEquipe // ID da equipe selecionada
                }) // Envia o ID da equipe
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then(error => {
                            throw new Error(error.message);
                        });
                    }
                })
                .then(data => {
                    console.log('Resposta do servidor:', data.message);
                    $('#confirmationModal').modal('show');
                })
                .catch(error => {
                    alert('Erro: ' + error.message);
                    console.error('Erro na requisição:', error);
                    console.log('Nome:', nome);
                    console.log('CPF:', cpf);
                    console.log('Sexo: ', sexo);
                    console.log('Data de Nascimento:', data_nasc);
                    console.log('Telefone:', telefone);
                    console.log('ID Equipe selecionada:', idEquipe)
                });
        }//fecha else tudo preenchido
    });//fecha submit.on.click


    /*  CONTROLE DO MODAL   */
    $('#adicionaOutro').on('click', function () {
        $('#confirmationModal').modal('hide');
        $('input[name=previous]').hide(); //esconde o voltar para não trocar a equipe
        limparCampos();
    });

    function limparCampos() {
        $('#cadNadador').find('input[type="text"]').val('');
        $('#cadNadador').find('input[type="date"]').val('');
        $('#cadNadador').find('input[type="radio"]').prop('checked', false);
    }


    // Quando o botão 'Encerrar' é clicado
    $('#encerraCadastro').on('click', function () {
        alert("Nadador cadastrado com sucesso!");
        window.location.href = 'http://localhost:3000/';
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

