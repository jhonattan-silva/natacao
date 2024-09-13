import { gerenciarCPF, formatarTelefone, validarTelefone } from './functions.js';

document.addEventListener('DOMContentLoaded', function () {
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
            if (link.getAttribute('href') === '#nadadoresSection') {
                console.log("Chamou nadadores");
                carregarEquipesSelect();
            }
            if (link.getAttribute('href') === '#inscricaoSection') {
                console.log("Chamou inscrição");
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

//Listar no select as equipes
async function carregarEquipesSelect() { //async para carregar na ordem correta
    try {
        const response = await fetch('/equipe/listarEquipes');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const equipes = await response.json();

        const selectEquipe = document.getElementById('selectEquipe');

        equipes.forEach(equipe => {
            const option = document.createElement('option');
            option.value = equipe.id;
            option.textContent = equipe.equipe;
            selectEquipe.appendChild(option);
        });
        selectEquipe.addEventListener('change', function () {
            const equipeId = this.value; // 'this' referencia o select
            console.log("CarregarEquipesSelect retorna o equipeID", equipeId);
        });
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




/**************NADADORES */



const tabelaNadadores = criarTabela(['Nadador', 'Ações']);


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
