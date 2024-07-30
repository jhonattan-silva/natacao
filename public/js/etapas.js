document.addEventListener('DOMContentLoaded', function() {
    const novoEventoBtn = document.getElementById('novoEventoBtn');
    const tabelaEventos = document.getElementById('tabelaEventos');

    novoEventoBtn.addEventListener('click', function() {
        tabelaEventos.style.display = 'none'; // Oculta a tabela de eventos
        carregarTorneios();
        carregarProvas();
        document.getElementById('etapaForm').style.display = 'block'; // Mostra o formulário de novo evento
    });

    carregarEventos();

    const cadastrarEtapaForm = document.getElementById('etapaForm');
    cadastrarEtapaForm.addEventListener('submit', cadastrarEtapa);
});


async function carregarEventos() {
    try {
        const response = await fetch('/etapas/eventos');
        if (!response.ok) {
            throw new Error('Erro ao carregar eventos');
        }
        const eventos = await response.json();

        // Ordena os eventos por data (ascendente)
        eventos.sort((a, b) => new Date(a.data) - new Date(b.data));

        const tabelaEventos = document.getElementById('tabelaEventos').getElementsByTagName('tbody')[0];
        tabelaEventos.innerHTML = ''; // Limpa a tabela antes de adicionar os eventos

        eventos.forEach(evento => {
            const row = tabelaEventos.insertRow();

            const nomeCell = row.insertCell();
            nomeCell.textContent = evento.nome;

            const cidadeCell = row.insertCell();
            cidadeCell.textContent = evento.cidade;

            const dataCell = row.insertCell();
            // Formatando a data para dd/MM/aaaa
            const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            dataCell.textContent = dataFormatada;

            const acoesCell = row.insertCell();
            const editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar';
            editarBtn.classList.add('btn', 'btn-primary', 'me-2');
            editarBtn.addEventListener('click', () => editarEvento(evento.id));

            const inativarBtn = document.createElement('button');
            inativarBtn.textContent = 'Inativar';
            inativarBtn.classList.add('btn', 'btn-danger');
            inativarBtn.addEventListener('click', () => inativarEvento(evento.id));

            acoesCell.appendChild(editarBtn);
            acoesCell.appendChild(inativarBtn);
        });
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
    }
}


async function carregarTorneios() {
    try {
        const response = await fetch('/etapas/torneios');
        if (!response.ok) {
            throw new Error('Erro ao carregar torneios');
        }
        const torneios = await response.json();
        const torneioSelect = document.getElementById('torneio');
        torneios.forEach(torneio => {
            const option = document.createElement('option');
            option.value = torneio.id;
            option.textContent = torneio.nome;
            torneioSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar torneios:', error);
    }
}

async function carregarProvas() {
    try {
        const response = await fetch('/etapas/provas');
        if (!response.ok) {
            throw new Error('Erro ao carregar provas');
        }
        const provas = await response.json();

        const provasMasculinasContainer = document.getElementById('provasMasculinasContainer');
        const provasFemininasContainer = document.getElementById('provasFemininasContainer');

        provas.forEach(prova => {
            // Criação do checkbox e label para provas masculinas
            const divMasculino = document.createElement('div');
            divMasculino.classList.add('form-check', 'mb-2'); // Adicionando margem inferior

            const checkboxMasculino = document.createElement('input');
            checkboxMasculino.type = 'checkbox';
            checkboxMasculino.classList.add('form-check-input', 'me-2'); // Adicionando margem à direita
            checkboxMasculino.name = 'provasMasculino';
            checkboxMasculino.value = prova.id;
            divMasculino.appendChild(checkboxMasculino);

            const labelMasculino = document.createElement('label');
            labelMasculino.classList.add('form-check-label');
            labelMasculino.textContent = `${prova.estilo} ${prova.distancia}m (${prova.tipo})`;
            labelMasculino.setAttribute('for', `checkboxMasculino${prova.id}`);
            divMasculino.appendChild(labelMasculino);

            provasMasculinasContainer.appendChild(divMasculino);

            // Criação do checkbox e label para provas femininas
            const divFeminino = document.createElement('div');
            divFeminino.classList.add('form-check', 'mb-2'); // Adicionando margem inferior

            const checkboxFeminino = document.createElement('input');
            checkboxFeminino.type = 'checkbox';
            checkboxFeminino.classList.add('form-check-input', 'me-2'); // Adicionando margem à direita
            checkboxFeminino.name = 'provasFeminino';
            checkboxFeminino.value = prova.id;
            divFeminino.appendChild(checkboxFeminino);

            const labelFeminino = document.createElement('label');
            labelFeminino.classList.add('form-check-label');
            labelFeminino.textContent = `${prova.estilo} ${prova.distancia}m (${prova.tipo})`;
            labelFeminino.setAttribute('for', `checkboxFeminino${prova.id}`);
            divFeminino.appendChild(labelFeminino);

            provasFemininasContainer.appendChild(divFeminino);
        });
    } catch (error) {
        console.error('Erro ao carregar provas:', error);
    }
}




async function cadastrarEtapa(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const cidade = document.getElementById('cidade').value;
    const sede = document.getElementById('sede').value;
    const endereco = document.getElementById('endereco').value;
    const Torneios_id = document.getElementById('torneio').value;

    if (!nome || !data || !cidade || !sede || !endereco || !Torneios_id) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const provasMasculinas = Array.from(document.querySelectorAll('#provasMasculinasContainer input[name="provasMasculino"]:checked')).map(input => ({
        TipoProvas_id: input.value,
        sexo: 'M'
    }));

    const provasFemininas = Array.from(document.querySelectorAll('#provasFemininasContainer input[name="provasFeminino"]:checked')).map(input => ({
        TipoProvas_id: input.value,
        sexo: 'F'
    }));

    const provas = [...provasMasculinas, ...provasFemininas];

    const etapa = { nome, data, cidade, sede, endereco, Torneios_id, provas };

    try {
        const response = await fetch('https://localhost:3000/etapas/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(etapa)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar etapa');
        }

        // Limpa o formulário e esconde o formulário de cadastro
        document.getElementById('etapaForm').reset();
        document.getElementById('etapaForm').style.display = 'none';

        // Mostra um alerta de sucesso
        alert('Etapa cadastrada com sucesso!');

        // Recarrega a lista de eventos para mostrar a tabela de eventos novamente
        carregarEventos();
        document.getElementById('tabelaEventos').style.display = 'block';

    } catch (error) {
        console.error('Erro ao cadastrar etapa:', error);
        alert('Erro ao cadastrar etapa: ' + error.message);
    }
}


function exibirDetalhesEtapa(result) {
    const detalhesContainer = document.getElementById('detalhesEtapa');
    if (!detalhesContainer) {
        console.error('Elemento "detalhesEtapa" não encontrado.');
        return;
    }

    detalhesContainer.innerHTML = `
        <p>ID do Evento: ${result.eventoId}</p>
        <p>Nome: ${result.nome}</p>
        <p>Data: ${result.data}</p>
        <p>Cidade: ${result.cidade}</p>
        <p>Sede: ${result.sede}</p>
        <p>Endereço: ${result.endereco}</p>
        <p>Torneio: ${result.torneio}</p>
        <p>Provas:</p>
        <ul>
            ${result.provas.map(prova => `<li>${prova.nome} (${prova.sexo})</li>`).join('')}
        </ul>
    `;
}