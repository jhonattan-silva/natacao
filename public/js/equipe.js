import { gerenciarCPF, formatarTelefone, validarTelefone } from './functions.js';

document.addEventListener('DOMContentLoaded', function () {
    carregarEquipes();
    carregarEventos();
    gerenciarCPF();

    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.content > div').forEach(section => section.classList.add('d-none'));
            document.querySelector(link.getAttribute('href')).classList.remove('d-none');
            
            // Esconder divs específicas baseadas no link clicado
            if (link.getAttribute('href') === '#inscricaoSection') {
                document.getElementById('equipe').classList.add('d-none');
            }
            if (link.getAttribute('href') === '#equipeSection') {
                document.getElementById('inscricaoSection').classList.add('d-none');
            }
        });
    });

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
    btnInscrever.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Botão de inscrever clicado'); // Verifique se esse log aparece no console
        salvarInscricao();
    });
} else {
    console.error('Elemento #btnInscrever não encontrado.');
}
});

function carregarEquipes() {
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

