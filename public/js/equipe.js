import { gerenciarCPF, formatarTelefone, validarTelefone } from './functions.js';

document.addEventListener('DOMContentLoaded', function () {

    carregarEventos();
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
            if (link.getAttribute('href') === '#nadadoresSection') {
                console.log("Chamou nadadores");
                carregarEquipesSelect();
                carregarNadadores(equipeId);
            }
            if (link.getAttribute('href') === '#inscricaoSection') {
                console.log("Chamou inscrição");
                carregarEquipesSelect();
                carregarNadadores(equipeId);
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


    /**************************************************************************************************************************************************************** */


    /******************************************* */
    /** PAGINA NADADORES */



    /**************************************************************************************************************************************************************** */

    /******************************************* */

    /*PAGINA INSCRIÇÕES*/

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

    const selectEquipeInscricao = document.getElementById('selectEquipeInscricao');
    if (selectEquipeInscricao) {
        selectEquipeInscricao.addEventListener('change', function () {
            const equipeId = selectEquipeInscricao.value;
            const eventoId = document.getElementById('selectEventoInscricao').value;
            if (eventoId) {
                carregarNadadoresInscricao(equipeId, eventoId);
            }
        });
    } else {
        console.error('Elemento #selectEquipeInscricao não encontrado.');
    }

    //SELECIOA
    const selectEventoInscricao = document.getElementById('selectEventoInscricao');
    if (selectEventoInscricao) {
        selectEventoInscricao.addEventListener('change', function () {
            const eventoId = selectEventoInscricao.value;
            const equipeId = document.getElementById('selectEquipeInscricao').value;
            if (equipeId) {
                carregarNadadoresInscricao(equipeId, eventoId);
            }
        });
    } else {
        console.error('Elemento #selectEventoInscricao não encontrado.');
    }

    const editarAdicionarNadadorForm = document.getElementById('formEditarAdicionarNadador');
    if (editarAdicionarNadadorForm) {
        editarAdicionarNadadorForm.addEventListener('submit', function (event) {
            event.preventDefault();
            salvarEdicaoAdicaoNadador();
        });
    } else {
        console.error('Elemento #formEditarAdicionarNadador não encontrado.');
    }

    const btnInscrever = document.getElementById('btnInscrever');
    if (btnInscrever) {
        btnInscrever.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('Botão de inscrever clicado'); // Verifique se esse log aparece no console
            salvarInscricao();
        });
    } else {
        console.error('Elemento #btnInscrever não encontrado.');
    }
}); //FECHA O DOM



function carregarEquipesSelect() {
    fetch('/equipe/buscarEquipes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(equipes => {
            const selectEquipe = document.getElementById('selectEquipe');
            const selectEquipeInscricao = document.getElementById('selectEquipeInscricao');

            equipes.forEach(equipe => {
                const option = document.createElement('option');
                option.value = equipe.id;
                option.textContent = equipe.nome;
                selectEquipe.appendChild(option);

                const optionClone = option.cloneNode(true);
                selectEquipeInscricao.appendChild(optionClone);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar equipes:', error);
        });
}

function listarEquipes() {
    let ordenacao = {
        coluna: 'nome',
        ordem: 'asc'
    };

    fetch('/equipe/listarEquipes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro listar equipes: ${response.status}`);
            }
            return response.json();
        })
        .then(equipes => {
            const listaEquipeContainer = document.querySelector('.lista-equipes-container');
            listaEquipeContainer.innerHTML = '';

            const tabela = criarTabela();
            listaEquipeContainer.appendChild(tabela);

            atualizarTabela(equipes, tabela);

            // Selecionar Cabeçalhos
            const thEquipe = tabela.querySelector('thead th:nth-child(1)');
            const thTreinador = tabela.querySelector('thead th:nth-child(2)');

            // Função para adicionar/atualizar ícone de ordenação
            function atualizarIconeOrdenacao(th, coluna) {
                const icone = th.querySelector('i');
                if (icone) {
                    icone.classList.remove('fa-sort-up', 'fa-sort-down');
                    icone.classList.add(ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
                } else {
                    th.innerHTML += ' <i class="fas fa-sort"></i>';
                    atualizarIconeOrdenacao(th, coluna);
                }
            }

            // Função para lidar com o clique nos cabeçalhos
            function ordenarTabela(coluna) {
                ordenacao.coluna = coluna;
                ordenacao.ordem = ordenacao.ordem === 'asc' ? 'desc' : 'asc';
                equipes = ordenarDados(equipes, ordenacao.coluna, ordenacao.ordem);
                atualizarTabela(equipes, tabela);
                atualizarIconeOrdenacao(thEquipe, 'equipe');
                atualizarIconeOrdenacao(thTreinador, 'treinador');
            }

            // Adicionando o evento de clique aos cabeçalhos
            thEquipe.addEventListener('click', () => ordenarTabela('equipe'));
            thTreinador.addEventListener('click', () => ordenarTabela('treinador'));
        })
        .catch(error => {
            console.error('Erro ao carregar equipes:', error);
        });
}


function criarTabela() {
    const tabela = document.createElement('table');
    tabela.classList.add('table', 'table-sm', 'table-hover', 'table-striped', 'text-white');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const thEquipe = document.createElement('th');
    thEquipe.textContent = 'Equipe';
    const thTreinador = document.createElement('th');
    thTreinador.textContent = 'Treinador';
    const thAcoes = document.createElement('th');
    thAcoes.textContent = 'Ações';
    headerRow.appendChild(thEquipe);
    headerRow.appendChild(thTreinador);
    headerRow.appendChild(thAcoes);
    thead.appendChild(headerRow);
    tabela.appendChild(thead);

    const tbody = document.createElement('tbody');
    tabela.appendChild(tbody);

    return tabela;
}

function atualizarTabela(dados, tabela) {
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = '';

    dados.forEach(equipe => {
        const row = tbody.insertRow();

        const cellEquipe = row.insertCell();
        cellEquipe.textContent = equipe.equipe;

        const cellTreinador = row.insertCell();
        cellTreinador.textContent = equipe.treinador;

        const cellAcoes = row.insertCell();
        cellAcoes.classList.add('cellAcoes');
        cellAcoes.innerHTML = `
            <button class="btn btn-sm btn-primary" onclick="abrirModalEditarAdicionarEquipe(${equipe.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="removerEquipe(${equipe.id})">Remover</button>
        `;
    });
}

function ordenarDados(dados, coluna, ordem) {
    return dados.sort((a, b) => {
      const aValue = a[coluna].toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      const bValue = b[coluna].toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  
      if (aValue < bValue) {
        return ordem === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return ordem === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }


function carregarEventos() {
    fetch('/equipe/buscarEventos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(eventos => {
            const selectEventoInscricao = document.getElementById('selectEventoInscricao');
            eventos.forEach(evento => {
                const option = document.createElement('option');
                option.value = evento.id;
                option.textContent = evento.nome;
                selectEventoInscricao.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar eventos:', error);
        });
}

function carregarNadadores(equipeId) {
    fetch(`/equipe/buscarNadadores?equipeId=${equipeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(nadadores => {
            const listaEquipeContainer = document.querySelector('.lista-equipe-container');
            listaEquipeContainer.innerHTML = ''; // Limpa o conteúdo atual

            const table = document.createElement('table');
            table.classList.add('table', 'table-sm', 'table-hover', 'table-striped');
            table.id = 'listaNadadores';

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Nome</th>
                <th>Ações</th>
            `;
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');

            nadadores.forEach(nadador => {
                const row = tbody.insertRow();
                row.dataset.id = nadador.id; // Adiciona o ID do nadador como data-attribute na linha

                const cellNome = row.insertCell(0);
                cellNome.textContent = nadador.nome;

                const cellAcoes = row.insertCell(1);
                cellAcoes.innerHTML = `
                    <button class="btn btn-sm btn-primary" onclick="abrirModalEditarAdicionarNadador(${nadador.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="removerNadador(${nadador.id})">Remover</button>
                `;
            });

            table.appendChild(tbody);
            listaEquipeContainer.appendChild(table);
        })
        .catch(error => {
            console.error('Erro ao carregar nadadores:', error);
        });
}

function carregarNadadoresInscricao(equipeId, eventoId) {
    fetch(`/equipe/buscarNadadores?equipeId=${equipeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(nadadores => {
            fetch(`/equipe/buscarProvas?eventoId=${eventoId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(provas => {
                    const listaInscricaoContainer = document.querySelector('.lista-inscricao-container');
                    listaInscricaoContainer.innerHTML = ''; // Limpa o conteúdo atual

                    nadadores.forEach(nadador => {
                        const nadadorDiv = document.createElement('div');
                        nadadorDiv.classList.add('mb-3');

                        const nadadorLabel = document.createElement('label');
                        nadadorLabel.textContent = nadador.nome;
                        nadadorLabel.classList.add('form-label', 'font-weight-bold');
                        nadadorDiv.appendChild(nadadorLabel);

                        const provasFiltradas = provas.filter(prova => prova.sexo === nadador.sexo);

                        provasFiltradas.forEach(prova => {
                            const provaDiv = document.createElement('div');
                            provaDiv.classList.add('form-check');

                            const provaCheckbox = document.createElement('input');
                            provaCheckbox.type = 'checkbox';
                            provaCheckbox.classList.add('form-check-input');
                            provaCheckbox.value = `${nadador.id}-${prova.id}`;
                            provaCheckbox.name = `nadador-${nadador.id}`;
                            provaCheckbox.addEventListener('change', function () {
                                limitarCheckboxes(nadador.id);
                            });

                            const provaLabel = document.createElement('label');
                            provaLabel.classList.add('form-check-label');
                            provaLabel.textContent = prova.nome;

                            provaDiv.appendChild(provaCheckbox);
                            provaDiv.appendChild(provaLabel);
                            nadadorDiv.appendChild(provaDiv);
                        });

                        listaInscricaoContainer.appendChild(nadadorDiv);
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar provas:', error);
                });
        })
        .catch(error => {
            console.error('Erro ao carregar nadadores:', error);
        });
}

function limitarCheckboxes(nadadorId) {
    const checkboxes = document.querySelectorAll(`input[name="nadador-${nadadorId}"]`);
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    if (checkedCheckboxes.length >= 2) {
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.disabled = true;
            }
        });
    } else {
        checkboxes.forEach(checkbox => {
            checkbox.disabled = false;
        });
    }
}

function salvarEdicaoAdicaoNadador() {
    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNasc = document.getElementById('data-nasc').value;
    const telefone = document.getElementById('telefone').value;
    const sexo = document.getElementById('sexo').value;

    let url;
    let method;
    if (id) {
        url = `/equipe/editarNadador/${id}`;
        method = 'PUT';
    } else {
        url = '/equipe/adicionarNadador';
        method = 'POST';
    }

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            cpf: cpf.replace(/\D/g, ''), // Remove a formatação do CPF
            data_nasc: dataNasc,
            telefone,
            sexo
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            $('#editarNadadorModal').modal('hide');
            const selectEquipe = document.getElementById('selectEquipe');
            const equipeId = selectEquipe.value;
            carregarNadadores(equipeId);

            const mensagemSucesso = document.getElementById('mensagem-sucesso');
            mensagemSucesso.classList.remove('d-none');
            alert('Nadador salvo com sucesso!');

            setTimeout(() => {
                mensagemSucesso.classList.add('d-none');
            }, 5000);
        })
        .catch(error => {
            console.error('Erro ao salvar nadador:', error);
        });
}

window.removerNadador = function (nadadorId) {
    fetch(`/equipe/removerNadador/${nadadorId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const selectEquipe = document.getElementById('selectEquipe');
            const equipeId = selectEquipe.value;
            carregarNadadores(equipeId);
        })
        .catch(error => {
            console.error('Erro ao remover nadador:', error);
        });
};

window.abrirModalEditarAdicionarNadador = function (id = null) {
    console.log(`Tentando carregar detalhes do nadador com ID ${id}`);
    console.log('Editando/adicionando nadador com ID:', id);

    if (id) {
        fetch(`/equipe/buscarNadador?id=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(nadador => {
                console.log('Dados do nadador carregados:', nadador);
                preencherFormularioEditarAdicionarNadador(nadador);
            })
            .catch(error => {
                console.error('Erro ao carregar nadador:', error);
            });
    } else {
        document.getElementById('formEditarAdicionarNadador').reset();
        $('#editarNadadorModal').modal('show');
    }
};

function preencherFormularioEditarAdicionarNadador(nadador) {
    $('#editarNadadorModal').modal('show');

    const campos = {
        'id': nadador.id,
        'nome': nadador.nome,
        'cpf': nadador.cpf,
        'data-nasc': new Date(nadador.data_nasc).toISOString().slice(0, 10),
        'telefone': nadador.telefone,
        'sexo': nadador.sexo
    };

    for (const [campo, valor] of Object.entries(campos)) {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.value = valor;
        } else {
            console.error(`Elemento com ID ${campo} não encontrado.`);
        }
    }
}


function salvarInscricao() {
    console.log('Função salvarInscricao() chamada.');
    const eventoId = document.getElementById('selectEventoInscricao').value;

    const checkboxes = document.querySelectorAll('.form-check-input:checked');
    const inscricoes = Array.from(checkboxes).map(checkbox => {
        const [nadadorId, provaId] = checkbox.value.split('-');
        return { nadadorId, provaId };
    });

    fetch('/equipe/salvarInscricao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            eventoId,
            inscricoes
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            alert('Inscrição realizada com sucesso!');
            // Limpar seleções ou atualizar a interface conforme necessário
        })
        .catch(error => {
            console.error('Erro ao realizar inscrição:', error);
            alert('Erro ao realizar inscrição. Verifique o console para mais detalhes.');
        });
}


function limparSelecoesInscricao() {
    // Limpar seleções após a inscrição ser realizada
    document.querySelectorAll('.lista-inscricao-container input[type="checkbox"]:checked')
        .forEach(checkbox => {
            checkbox.checked = false;
        });
}

