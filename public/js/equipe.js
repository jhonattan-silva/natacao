import { gerenciarCPF } from './functions.js';

document.addEventListener('DOMContentLoaded', function () {
    gerenciarCPF();

    // Listener do SIDEBAR (remove o none ao clicar no link e adiciona o none aos outros)
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevenir o comportamento padrão do link

            // Ocultar todas as seções de conteúdo
            document.querySelectorAll('section').forEach(section => section.classList.add('d-none'));

            const targetSection = document.querySelector(link.getAttribute('href'));
            targetSection.classList.remove('d-none'); //faz aparecer o clicado
            if (link.getAttribute('href') === '#equipeSection') {
                console.log("Chamou equipe");
                listarEquipes();
            }
            if (link.getAttribute('href') === '#nadadoresSection') { //QUANDO CLICCAR NA SECTION DE NADADORES
                console.log("Chamou nadadores");
                // Chamar as funções para popular o select
                carregarEquipesSelect('#selectEquipe');
            }
            if (link.getAttribute('href') === '#inscricaoSection') {
                console.log("Chamou inscrição");
                carregarEventosSelect();
                carregarEquipesSelect('#selectEquipeInscricao');
            }
        });
    });


    /**************************************************************************************************************************** */
    //ADICIONAR NOVA EQUIPE
    const btnAdicionarEquipe = document.getElementById('btnAdicionarEquipe');
    const formularioEquipe = document.getElementById('formularioEquipe');
    const formAdicionarEquipe = document.getElementById('formAdicionarEquipe');
    const btnCancelar = document.getElementById('btnCancelar');

    const treinadorInput = document.getElementById('treinadorInput');
    const listaTreinadores = document.getElementById('listaTreinadores');
    const treinadorId = document.getElementById('treinadorId');
    const salvarEquipe = document.getElementById('btnSalvarEquipe');

    // Mostrar o formulário ao clicar no botão "ADICIONAR NOVA EQUIPE"
    if (btnAdicionarEquipe) {
        btnAdicionarEquipe.addEventListener('click', function () {
            formularioEquipe.classList.remove('d-none');
            formAdicionarEquipe.reset();
            document.getElementById('equipeId').value = '';
        });
    } else {
        console.error('Elemento #btnAdicionarEquipe não encontrado.');
    }

    // Ocultar o formulário ao clicar no botão "Cancelar"
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function () {
            formularioEquipe.classList.add('d-none');
        });
    } else {
        console.error('Elemento #btnCancelar não encontrado.');
    }


    // Buscar treinadores conforme o usuário digita
    treinadorInput.addEventListener('input', async (event) => {
        const query = event.target.value;

        if (query.length >= 1) {
            try {
                const response = await fetch(`/equipe/buscarTreinadores?query=${encodeURIComponent(query)}`);
                const treinadores = await response.json();

                // Limpar a lista antes de adicionar novos resultados
                listaTreinadores.innerHTML = '';

                treinadores.forEach(treinador => {
                    const li = document.createElement('li');
                    li.textContent = treinador.nome;
                    li.addEventListener('click', () => {
                        // Atribuir o ID do treinador selecionado ao campo oculto e limpar a lista
                        treinadorId.value = treinador.id;
                        treinadorInput.value = treinador.nome; // Atualizar o campo de entrada com o nome selecionado
                        listaTreinadores.innerHTML = '';
                    });
                    listaTreinadores.appendChild(li);
                });
            } catch (error) {
                console.error('Erro ao buscar treinadores:', error);
            }
        } else {
            // Limpar a lista quando o campo de pesquisa estiver vazio
            listaTreinadores.innerHTML = '';
        }
    });

    //Quando clicar em algum nome ou fora
    treinadorInput.addEventListener('blur', () => {
        treinadorInput.disabled = true;
        console.log(treinadorInput.value);
        console.log(treinadorId.value);
    });

    //AO SALVAR O FORMULÁRIO
    formAdicionarEquipe.addEventListener('submit', async (event) => {
        event.preventDefault();

        const equipeNome = document.getElementById('nomeEquipe').value;
        console.log(equipeNome);
        console.log(treinadorId.value);

        // Validação básica
        if (!equipeNome || !treinadorId) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const response = await fetch('/equipe/adicionarEquipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: equipeNome,
                    treinadorId: treinadorId.value
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Equipe adicionada com sucesso! ${data.nome}`); //puxa da 201 do backend
                formularioEquipe.classList.add('d-none');
                listarEquipes();
            } else {
                const errorData = await response.json(); // Tentar obter informações de erro do servidor
                alert(`Erro ao adicionar equipe: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao salvar equipe:', error);
            alert('Ocorreu um erro inesperado ao conectar-se ao servidor. Por favor, tente novamente mais tarde.');
        }
    });


    //SELECIONAR A EQUIPE
    const selectEquipe = document.getElementById('selectEquipe');
    if (selectEquipe) {
        selectEquipe.addEventListener('change', function () {
            const equipeId = selectEquipe.value;
            carregarNadadores(equipeId);
        });
    } else {
        console.error('Elemento #selectEquipe não encontrado.');
    }

}); //FECHA O DOM *********************************************************************************


/******DECLARAÇÃO DE TABELAS PARA LISTAGENS (passar as colunas desejadas como parametro) */
function criarTabela(colunas) {
    const tabela = document.createElement('table');
    tabela.classList.add('table', 'table-sm', 'table-hover', 'table-striped', 'text-white');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    colunas.forEach(coluna => {
        const th = document.createElement('th');
        th.textContent = coluna;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tabela.appendChild(thead);

    const tbody = document.createElement('tbody');
    tabela.appendChild(tbody);

    return tabela;
}


function ordenarDados(dados, coluna, ordem = 'asc') {
    return dados.sort((a, b) => {
        let valorA = a[coluna] ? a[coluna].toString().toLowerCase() : '';
        let valorB = b[coluna] ? b[coluna].toString().toLowerCase() : '';

        if (ordem === 'asc') {
            return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
        } else {
            return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
        }
    });
}

function configurarOrdenacaoTabela(tabela, dados, atualizarTabelaCallback, colunas) {
    let ordenacao = { coluna: colunas[0], ordem: 'asc' }; // Começar ordenação pela primeira coluna

    const thead = tabela.querySelector('thead');

    colunas.forEach((coluna, index) => {
        const th = thead.querySelector(`th:nth-child(${index + 1})`);

        // Adiciona eventos de clique a cada cabeçalho de coluna
        th.addEventListener('click', () => {
            ordenacao.coluna = coluna;
            ordenacao.ordem = ordenacao.ordem === 'asc' ? 'desc' : 'asc';
            dados = ordenarDados(dados, ordenacao.coluna, ordenacao.ordem); // Implementar a lógica de ordenação
            atualizarTabelaCallback(dados, tabela); // Função específica para atualizar a tabela
        });
    });
}


/************   EQUIPE   *********************************** */

/**
 * Atualiza um elemento select com os dados fornecidos.
 *
 * @param {string} seletor - Um seletor CSS para encontrar o elemento select a ser atualizado. Queryselector
 */
async function carregarEquipesSelect(seletor) {
    try {
        const response = await fetch('/equipe/listarEquipes');
        if (!response.ok) {
            throw new Error(`Erro ao carregar equipes: ${response.status} - ${await response.text()}`);
        }
        const equipes = await response.json();

        const selectElement = document.querySelector(seletor);

        // Limpar todas as opções exceto a padrão
        selectElement.innerHTML = '<option value="" disabled selected>Selecione a equipe...</option>';

        // Verificar se existem equipes para adicionar
        if (equipes.length > 0) {
            equipes.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.equipe;
                selectElement.appendChild(option);
            });
        } else {
            console.log("Nenhuma equipe disponível.");
        }
    } catch (error) {
        console.error('Erro ao carregar equipes:', error);
    }
}


function criarTabelaEquipes() {
    const listaEquipeContainer = document.querySelector('.lista-equipes-container');

    // Verificar se a tabela já existe
    let tabelaExistente = listaEquipeContainer.querySelector('table');
    if (tabelaExistente) {
        return tabelaExistente;
    }

    // Criar nova tabela se não existir
    const tabela = criarTabela(['Equipe', 'Treinador', 'Ações']);//tabela de equipes listará o nome da equipe, o treinador e a coluna auxiliar de ações
    listaEquipeContainer.appendChild(tabela); //exibe na tela dentro da div
    return tabela;
}

function atualizarTabelaEquipes(dados, tabela) { //listar os dados do banco na tabela criada
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = ''; // Limpa a tabela

    dados.forEach(equipe => {
        const row = tbody.insertRow();

        const cellEquipe = row.insertCell();
        cellEquipe.textContent = equipe.equipe; // Nome da equipe vindo do backend

        const cellTreinador = row.insertCell();
        cellTreinador.textContent = equipe.treinador; // Nome do treinador vindo do backend

        const cellAcoes = row.insertCell();
        cellAcoes.classList.add('cellAcoes');
        cellAcoes.innerHTML = `
            <button class="btn btn-sm btn-primary" onclick="abrirModalEditarEquipe(${equipe.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="removerEquipe(${equipe.id})">Remover</button>
        `;
    });
}

async function listarEquipes() { //busca as informações no banco
    try {
        const response = await fetch('/equipe/listarEquipes');
        if (!response.ok) {
            throw new Error(`Erro ao listar equipes: ${response.status}`);
        }
        const equipes = await response.json();

        const tabela = criarTabelaEquipes(); // Criar ou reutilizar tabela
        atualizarTabelaEquipes(equipes, tabela); // Atualizar dados da tabela

        // Lidar com a ordenação dos cabeçalhos da tabela
        configurarOrdenacaoTabela(tabela, equipes, atualizarTabelaEquipes, ['equipe', 'treinador']);
    } catch (error) {
        console.error('Erro ao carregar equipes:', error);
    }
}




/**************NADADORES **********************************************/
function criarTabelaNadadores() {
    const listaNadadoresContainer = document.querySelector('.lista-nadadores-container');

    // Se a tabela já existe, retorná-la
    let tabelaExistente = listaNadadoresContainer.querySelector('table');
    if (tabelaExistente) {
        return tabelaExistente;
    }

    // Se não existe, criar uma nova tabela
    const tabelaNadadores = criarTabela(['Nadador', 'Ações']);
    listaNadadoresContainer.appendChild(tabelaNadadores);
    return tabelaNadadores;
}


function atualizarTabelaNadadores(dados, tabelaNadadores) {
    const tbody = tabelaNadadores.querySelector('tbody');
    tbody.innerHTML = ''; // Limpa as linhas existentes

    dados.forEach(nadador => {
        const row = tbody.insertRow();

        const cellNadador = row.insertCell();
        cellNadador.textContent = nadador.nome;

        const cellAcoes = row.insertCell();
        cellAcoes.classList.add('cellAcoes');
        cellAcoes.innerHTML = `
            <button class="btn btn-sm btn-primary" onclick="abrirModalEditarNadador(${nadador.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="removerNadador(${nadador.id})">Remover</button>
        `;
    });
}

async function carregarNadadores(equipeId) {
    try {
        const response = await fetch(`/equipe/buscarNadadores?equipeId=${equipeId}`);
        const nadadores = await response.json();

        const tabelaNadadores = criarTabelaNadadores();
        atualizarTabelaNadadores(nadadores, tabelaNadadores);
        configurarOrdenacaoTabela(tabelaNadadores, nadadores, atualizarTabelaNadadores, ['nadador', 'acoes']);
    } catch (error) {
        console.error('Erro ao carregar Nadadores:', error);
    }
}

//ADICIONAR NOVO NADADOR
const btnAdicionarNadador = document.getElementById('btnAdicionarNadador');
const formularioNadador = document.getElementById('formularioNadador');
const btnCancelarNadador = document.createElement('button');
const listaNadadoresBase = document.getElementById('lista-nadadores-base');


// Evento para mostrar o formulário ao clicar no botão "Adicionar Nadador"
btnAdicionarNadador.addEventListener('click', function () {
    formularioNadador.style.display = 'block'; // Exibe o formulário
    listaNadadoresBase.style.display = 'none'; //esconde o restante da tela
    carregarEquipesSelect('#selectEquipeCadNadador');//id do select do fomulário;
});


function criarInput(type, name, id, placeholder, options) {
    if (type === 'radio' && options) { // se for do tipo radio e tiver opções
        const radioGroup = document.createElement('div');
        options.forEach((opcao, index) => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = name;
            radio.value = opcao.valor;
            radio.id = `${name}-${index}`; // Define um ID único para cada rádio

            const label = document.createElement('label');
            label.htmlFor = radio.id;
            label.textContent = opcao.label;

            radioGroup.appendChild(radio);
            radioGroup.appendChild(label);
        });
        return radioGroup;
    } else if (type === 'select') {
        const select = document.createElement('select');
        select.name = name;
        select.id = 'selectEquipeCadNadador'; // Atribui o ID desejado

        const defaultOption = document.createElement('option');
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        return select;
    } else {
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.id = id;
        input.placeholder = placeholder || '';
        return input;
    }
}

function criarFormulario(containerId, campos) {
    const container = document.getElementById(containerId);
    const form = document.createElement('form');
    form.id = 'form-cadastro';

    campos.forEach(campo => {
        const { tipo, nome, id, placeholder, options } = campo;
        const input = criarInput(tipo, nome, id, placeholder, options);

        const label = document.createElement('label');
        label.textContent = nome;

        form.appendChild(label);
        form.appendChild(input);
    });

    // Cria o botão de salvar cadastro
    const botaoSalvar = document.createElement('button');
    botaoSalvar.textContent = 'Salvar Cadastro';
    botaoSalvar.classList.add('btn-salvar');

    botaoSalvar.addEventListener('click', function () {
        // Lógica para salvar o cadastro
    });

    // Cria o botão de cancelar
    const botaoCancelar = document.createElement('button');
    botaoCancelar.textContent = 'Cancelar';
    botaoCancelar.classList.add('btn-cancelar');

    botaoCancelar.addEventListener('click', function (event) {
        event.preventDefault();
        formularioNadador.style.display = 'none';
        listaNadadoresBase.style.display = 'block';
    });

    form.appendChild(botaoSalvar);
    form.appendChild(botaoCancelar);
    container.appendChild(form);
}


// Criando um formulário para cadastro de Nadador
const camposCadastroNadador = [
    { tipo: 'text', nome: 'Nome', id: 'nome', placeholder: 'Nome Completo' },
    { tipo: 'text', nome: 'cpf', id: 'cpf', placeholder: 'Somente números' },
    { tipo: 'date', nome: 'Data de Nascimento', id: 'data_nasc' },
    { tipo: 'text', nome: 'Celular', id: 'celular', placeholder: 'Somente números' },
    {
        tipo: 'radio', nome: 'Sexo', options: [
            { valor: 'M', label: 'Masculino' },
            { valor: 'F', label: 'Feminino' }
        ]
    },
    { tipo: 'select', nome: 'Equipe' },
];
criarFormulario('formularioNadador', camposCadastroNadador); //exevutando o formulário

let sexoSelecionado = '';

formularioNadador.addEventListener('submit', async (event) => { //CLICAR NO SALVAR
    event.preventDefault();

    // Validação básica
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const data_nasc = document.getElementById('data_nasc').value;
    const celular = document.getElementById('celular').value;
    const radiosSexo = document.querySelectorAll('input[name="Sexo"]');
    const equipeId = document.getElementById('selectEquipeCadNadador');

    console.log('nome:', nome);
    console.log('cpf:', cpf);
    console.log('data_nasc selecionado:', data_nasc);
    console.log('celular selecionado:', celular);
    console.log('Sexo selecionado: ', sexoSelecionado);
    console.log('Equipe ID; ', equipeId.value);

    // Encontrar o rádio selecionado

    radiosSexo.forEach(radio => {
        if (radio.checked) {
            sexoSelecionado = radio.value;
        }
    });

    // Verificar se sexoSelecionado tem um valor
    if (!sexoSelecionado) {
        alert('Por favor, selecione o sexo.');
        return;
    }

    if (!nome || !cpf || !data_nasc || !celular || !sexoSelecionado || !equipeId) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (!gerenciarCPF(cpf)) {
        alert('CPF inválido.');
        return;
    }


    try {
        const response = await fetch('/equipe/adicionarNadador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                cpf: cpf,
                data_nasc: data_nasc,
                telefone: celular,
                sexo: sexoSelecionado,
                equipeId: equipeId.value
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Nadador adicionada com sucesso! ${nome}`); //puxa da 201 do backend
            formularioNadador.classList.add('d-none');
            listaNadadoresBase.style.display = 'block';
        } else {
            const errorData = await response.json(); // Tentar obter informações de erro do servidor
            alert(`Erro ao adicionar nadador: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao salvar nadador:', error);
        alert('Ocorreu um erro inesperado ao conectar-se ao servidor. Por favor, tente novamente mais tarde.');
    }
});




/*INSCRIÇÃO**********************************************************/

// Listar no select os eventos
async function carregarEventosSelect() {
    try {
        const response = await fetch('/equipe/listarEventos');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const eventos = await response.json();

        const selectEvento = document.getElementById('selectEvento');

        // Limpar todas as opções exceto a padrão
        selectEvento.innerHTML = '<option value="" disabled selected>Selecione o evento...</option>';

        // Verificar se existem eventos para adicionar
        if (eventos.length > 0) {
            eventos.forEach(evento => {
                const option = document.createElement('option');
                option.value = evento.id;
                option.textContent = evento.nome;
                selectEvento.appendChild(option);
            });
        } else {
            console.log("Nenhum evento disponível.");
        }
        /* 
                selectEvento.addEventListener('change', function () {
                    const eventoId = this.value; // 'this' referencia o select
                    console.log('Evento selecionado ID:', eventoId);
                }); */
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
    }
}

async function carregarNadadoresEProvas(equipeId, eventoId) {
    try {
        const response = await fetch(`/equipe/eventoEquipe?equipeId=${equipeId}&eventoId=${eventoId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar nadadores e provas.');
        }

        const data = await response.json();
        const { nadadores, provas } = data;

        if (!nadadores.length || !provas.length) {
            alert('Não há nadadores ou provas para o evento e equipe selecionados.');
            return;
        }

        // Chama a função para criar a tabela de nadadores e provas
        criarTabelaInscricao(nadadores, provas);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados. Tente novamente.');
    }
}

function criarTabelaInscricao(nadadores, provas) {
    const container = document.querySelector('.lista-inscricao-container');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    const tabela = document.createElement('table');
    tabela.classList.add('table', 'table-striped');

    // Cabeçalho da tabela
    const thead = tabela.createTHead();
    const headerRow = thead.insertRow();
    headerRow.insertCell().textContent = 'Nadador'; // Cabeçalho para o nome do nadador
    headerRow.insertCell().textContent = 'Provas'; // Cabeçalho para as provas

    // Corpo da tabela
    const tbody = tabela.createTBody();
    nadadores.forEach(nadador => {
        const row = tbody.insertRow();

        // Célula com o nome do nadador
        const cellNadador = row.insertCell();
        cellNadador.textContent = nadador.nome; // Adiciona o nome do nadador
        cellNadador.dataset.nadadorId = nadador.id; // Armazena o ID do nadador no atributo data-nadador-id

        // Célula para as provas
        const cellProvas = row.insertCell();

        // Adiciona um checkbox para cada prova que corresponde ao sexo do nadador
        provas.forEach(prova => {
            // Verifica se o sexo do nadador corresponde ao sexo da prova
            if (nadador.sexo === prova.sexo) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = prova.id;
                checkbox.name = `prova_${nadador.id}_${prova.id}`; // Nome único para cada checkbox
                checkbox.classList.add('form-check-input');

                // Adiciona o checkbox na célula
                cellProvas.appendChild(checkbox);

                // Adiciona um label para o checkbox
                const provaLabel = document.createElement('label');
                provaLabel.htmlFor = checkbox.id; // Associar o label ao checkbox
                provaLabel.textContent = `${prova.estilo} - ${prova.distancia}m - ${prova.tipo} - ${prova.sexo}`; // Concatenando os dados
                cellProvas.appendChild(provaLabel); // Adiciona o label na célula
                cellProvas.appendChild(document.createElement('br')); // Adiciona quebra de linha para melhor visualização
                // Adiciona um evento para verificar a seleção dos checkboxes
                checkbox.addEventListener('change', () => {
                    const checkboxes = cellProvas.querySelectorAll('input[type="checkbox"]');
                    const checkedCount = Array.from(checkboxes).filter(chk => chk.checked).length;

                    // Habilita ou desabilita os checkboxes com base na contagem de checkboxes selecionados
                    checkboxes.forEach(chk => {
                        if (checkedCount >= 2 && !chk.checked) {
                            chk.disabled = true; // Desabilita checkboxes não selecionados
                        } else {
                            chk.disabled = false; // Habilita todos os checkboxes se menos de 2 estiverem selecionados
                        }
                    });
                });
            }
        });

        // Se não houver provas disponíveis, adicione um texto informativo
        if (cellProvas.innerHTML === '') {
            cellProvas.textContent = 'Nenhuma prova disponível'; // Mensagem caso não haja provas
        }
    });

    // Adicionar a tabela ao container
    container.appendChild(tabela);
}



document.getElementById('btnCarregarDados').addEventListener('click', function () {
    const equipeId = document.getElementById('selectEquipeInscricao').value;
    const eventoId = document.getElementById('selectEvento').value;

    if (!equipeId || !eventoId) {
        alert('Por favor, selecione uma equipe e um evento.');
        return;
    }

    // Chama a função que irá buscar nadadores e provas com base nos IDs selecionados
    carregarNadadoresEProvas(equipeId, eventoId);
});


document.getElementById('btnInscrever').addEventListener('click', async function () {
    const nadadoresInscritos = [];
    const eventoId = document.getElementById('selectEvento').value; // Captura o ID do evento selecionado

    // Seleciona todas as linhas da tabela
    const rows = document.querySelectorAll('.lista-inscricao-container table tbody tr');

    rows.forEach(row => {
        const cellNadador = row.querySelector('td:first-child'); //seleciona a celula do nadador
        const nadadorId = cellNadador.dataset.nadadorId; //recebe o id dele a partir da celula acima
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                nadadoresInscritos.push({
                    nadadorId: nadadorId, // ou o ID do nadador se estiver disponível
                    provaId: checkbox.value, // ID da prova
                    eventoId: eventoId //id do evento
                });
            }
        });
    });

    if (nadadoresInscritos.length === 0) {
        alert('Nenhuma prova foi selecionada para inscrição.');
        return;
    }

    try {
        const response = await fetch('/equipe/salvarInscricao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nadadoresInscritos),
        });

        if (!response.ok) {
            throw new Error('Erro ao inscrever nadadores.');
        }

        const result = await response.json();
        console.log(result);

        alert(result.message || 'Inscrição realizada com sucesso!');

        //limpar após o sucesso
        const containerTabela = document.querySelector('.lista-inscricao-container');
        containerTabela.innerHTML = '';
    } catch (error) {
        console.log(nadadoresInscritos);

        console.error('Erro:', error);
        alert('Erro ao realizar a inscrição. Tente novamente.');
    }
});
