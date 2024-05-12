var equipesRetornadas = [];

$(document).ready(function() {
    var inputEquipe = $('input[name="equipe"]');
    // Campo oculto para armazenar o valor selecionado
    var equipeSelecionada = $('<input>').attr('type', 'hidden').appendTo('form');
    // Flag para verificar se a seleção foi feita a partir do autocomplete
    var selecionadoDoAutocomplete = false;
    inputEquipe.on('input', function() {
        var input = $(this).val();
        if(input.length >= 3) {
            $.ajax({
                url: '/buscarEquipes',
                data: { equipe: input },
                success: function(data) {
                    var nomesDasEquipes = data.map(function(equipe) {
                        return equipe.nome;
                    });
                    inputEquipe.autocomplete({
                        source: nomesDasEquipes,
                        select: function(event, ui) {
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

    // Adiciona um ouvinte de evento para o evento 'change'
    inputEquipe.on('change', function() {
        // Se o valor atual do campo de entrada não estiver na lista de equipes retornadas e a seleção não foi feita a partir do autocomplete, limpa o campo de entrada
        if (!equipesRetornadas.includes($(this).val()) && !selecionadoDoAutocomplete) {
            $(this).val('');
            equipeSelecionada.val('');
        }
        // Redefine a flag
        selecionadoDoAutocomplete = false;
    });
});

  
//FIM BUSCA DE EQUIPES

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


});

