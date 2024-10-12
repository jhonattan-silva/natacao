let eventos; // Declara a variável eventos no escopo mais externo

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM completamente carregado e analisado');
    carregarEventos();

    // Seleciona o botão de balizamento
    const btnBalizar = document.getElementById('btnBalizar');

    // Adiciona evento de clique ao botão
    btnBalizar.addEventListener('click', function () {
        console.log('Botão de balizar clicado');

        // Seleciona a tabela onde os nadadores estão listados
        const tableBody = document.querySelector('#listaInscritos tbody');

        // Cria um array para armazenar os nadadores com seus tempos de record
        const nadadores = [];

        // Itera sobre cada linha da tabela de nadadores
        tableBody.querySelectorAll('tr').forEach(row => {
            const nome = row.cells[0].textContent; // Nome do nadador
            const tempoFormatado = row.cells[1].textContent.trim(); // Tempo de record formatado
            const inscricaoId = row.cells[2].textContent; // ID da inscrição (supondo que está na 3ª coluna)

            // Converte o tempo formatado para segundos
            const tempoEmSegundos = converterTempoParaSegundos(tempoFormatado);

            // Adiciona o nadador com seu tempo de record em segundos ao array
            //nadadores.push({ nome, tempoEmSegundos });
            nadadores.push({ inscricaoId, nome, tempoEmSegundos });
        });

        // Ordena nadadores sem tempo no início, seguido pelos piores tempos até os melhores tempos
        function compararNadadores(nadadorA, nadadorB) {
            if (!nadadorA.tempoEmSegundos) {
                return -1;
            } else if (!nadadorB.tempoEmSegundos) {
                return 1;
            }

            // Se ambos tiverem tempo, compare-os pelo tempo (invertido)
            return nadadorB.tempoEmSegundos - nadadorA.tempoEmSegundos;
        }
        nadadores.sort(compararNadadores);

        console.log('Após a ordenação:', nadadores);



        const resultadoContainer = document.querySelector('.resultado-container');
        // Limpa a tabela antes de reorganizar os nadadores
        resultadoContainer.innerHTML = '';

        // Divide os nadadores em grupos de 6
        const grupos = [];
        for (let i = 0; i < nadadores.length; i += 6) {
            grupos.push(nadadores.slice(i, i + 6));
        }

        // Garante no mínimo 3 nadadores por piscina
        for (let i = grupos.length - 1; i >= 0; i--) {
            while (grupos[i].length < 3 && i > 0) {
                grupos[i].push(...grupos[i - 1].splice(-1, 1)); // move 1 nadador da piscina anterior para a atual
            }
        }


        // Distribui os nadadores nas raias conforme a lógica
        grupos.forEach((grupo, index) => {
            const raia1 = grupo[1];
            const raia2 = grupo[3];
            const raia3 = grupo[5];
            const raia4 = grupo[4];
            const raia5 = grupo[2];
            const raia6 = grupo[0];

            const table = document.createElement('table');
            table.classList.add('table', 'table-bordered');

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = [
                `Piscina ${index + 1}`,
                '1',
                '2',
                '3',
                '4',
                '5',
                '6'
            ];

            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.classList.add('th-raia'); // Adiciona a classe customizada aos cabeçalhos
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Nadador</td>
                <td>${raia1 ? raia1.nome : 'N/A'}</td>
                <td>${raia2 ? raia2.nome : 'N/A'}</td>
                <td>${raia3 ? raia3.nome : 'N/A'}</td>
                <td>${raia4 ? raia4.nome : 'N/A'}</td>
                <td>${raia5 ? raia5.nome : 'N/A'}</td>
                <td>${raia6 ? raia6.nome : 'N/A'}</td>
            `;
            tbody.appendChild(row);
            table.appendChild(tbody);

            resultadoContainer.appendChild(table);


            //SALVAR BALIZAMENTO NO BANCO
            const piscina = index + 1; // Número da piscina

            // Aqui, você pode precisar do ID da prova ou evento
            const eventoSelect = document.getElementById('selectEvento');
            const provaSelect = document.getElementById('selectProva');
            const eventoId = eventoSelect.value;
            const provaId = provaSelect.value;

            // Dados a serem enviados para o backend
            const dadosBateria = {
                Provas_id: provaId,
                numero: piscina,
                nadadores: grupo.map((nadador, raiaIndex) => ({
                    Inscricoes_id: nadador.inscricaoId,
                    piscina,
                    raia: raiaIndex + 1
                }))
            };

            // Enviar os dados para o backend para salvar no banco de dados
            fetch('/balizamento/salvarBaterias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosBateria)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao salvar baterias');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Baterias salvas com sucesso:', data);
                })
                .catch(error => {
                    console.error('Erro ao salvar baterias:', error);
                });


        });



        // Geração do PDF
        const eventoSelect = document.getElementById('selectEvento');
        if (!eventoSelect) {
            console.error('Elemento selectEvento não encontrado no DOM.');
            return;
        }
        console.log('linha 1', eventoSelect);
        const eventoSelecionado = eventos.find(evento => evento.id === eventoSelect.value);
        console.log('linha 2', eventoSelecionado);

        if (!eventoSelecionado) {
            console.error('Evento selecionado inválido:', eventoSelecionado);
            return;
        }

        gerarPDF(grupos, eventoSelecionado);

    });
});

// Função para converter tempo no formato 0:01:04 para segundos
function converterTempoParaSegundos(tempo) {
    const partes = tempo.split(':').map(parseFloat);
    return partes[0] * 3600 + partes[1] * 60 + partes[2];
}

// Função para formatar o tempo de segundos para exibição
function formatarTempo(tempoEmSegundos) {
    const horas = Math.floor(tempoEmSegundos / 3600);
    const minutos = Math.floor((tempoEmSegundos % 3600) / 60);
    const segundos = tempoEmSegundos % 60;
    return `${horas}:${minutos}:${segundos}`;
}

function carregarEventos() {
    fetch('/balizamento/buscarEventos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar eventos');
            }
            return response.json();
        })
        .then(data => {
            eventos = data; // Atribui os eventos recebidos à variável eventos

            const eventoSelect = document.getElementById('selectEvento');
            eventos.forEach(evento => {
                const option = document.createElement('option');
                option.value = evento.id;
                const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR'); //formatar a data para aparecer na sequancia
                option.textContent = `${evento.nome} - ${dataFormatada}`;
                eventoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar eventos:', error);
        });
}

function carregarInscritos(provaId) {
    console.log('Carregando inscritos para a prova com ID:', provaId);
    fetch(`/balizamento/buscarInscritos?provaId=${provaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar inscritos');
            }
            return response.json();
        })
        .then(inscritos => {
            // Seleciona o contêiner onde a tabela será inserida
            const resultadoContainer = document.querySelector('.resultado-container');
            resultadoContainer.innerHTML = ''; // Limpa o conteúdo atual

            // Cria a tabela
            const table = document.createElement('table');
            table.classList.add('table', 'table-sm', 'table-hover', 'table-striped');
            table.id = 'listaInscritos';

            // Cria o cabeçalho da tabela
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Nome</th>
                <th>Record</th>
                <th>Inscrição</ht>
            `;
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Cria o corpo da tabela
            const tbody = document.createElement('tbody');

            // Preenche o corpo da tabela com os inscritos
            inscritos.forEach(inscrito => {
                const row = tbody.insertRow();

                const cellNome = row.insertCell(0);
                const cellRecord = row.insertCell(1);
                const cellInscricao = row.insertCell(2);

                cellNome.textContent = inscrito.nome;
                cellRecord.textContent = inscrito.record ? inscrito.record : 'N/A';
                cellInscricao.textContent = inscrito.Inscricoes_id;
            });

            table.appendChild(tbody);

            // Insere a tabela no contêiner
            resultadoContainer.appendChild(table);
        })
        .catch(error => {
            console.error('Erro ao carregar inscritos:', error);
        });
}

function carregarProvas(eventoId) {
    console.log('Carregando provas para o evento com ID:', eventoId);
    fetch(`/balizamento/buscarProvas?eventoId=${eventoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar provas');
            }
            return response.json();
        })
        .then(provas => {
            const provaSelect = document.getElementById('selectProva');
            provaSelect.innerHTML = ''; // Limpa as opções atuais

            provas.forEach(prova => {
                const option = document.createElement('option');
                option.value = prova.id;
                option.textContent = prova.nome;
                provaSelect.appendChild(option);
            });
            // Adicionar evento para carregar inscritos ao selecionar uma prova
            provaSelect.addEventListener('change', () => {
                const provaId = provaSelect.value;
                carregarInscritos(provaId);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar provas:', error);
        });
}

function gerarPDF(grupos, evento) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    if (!evento) {
        console.error('Objeto evento inválido ou não definido:', evento);
        return;
    }

    doc.setFontSize(18);
    doc.text('Distribuição de Nadadores nas Piscinas', 10, 10);
    doc.setFontSize(12);
    let posY = 20;

    grupos.forEach((grupo, index) => {
        if (posY + 50 > doc.internal.pageSize.height) {
            doc.addPage(); // Adiciona uma nova página se o espaço estiver acabando
            posY = 20; // Reinicia a posição Y na nova página
        }

        doc.text(`Piscina ${index + 1}`, 10, posY);
        posY += 10;

        const nadadores = [
            grupo[4] ? `${grupo[4].nome} (${grupo[4].tempoEmSegundos ? formatarTempo(grupo[4].tempoEmSegundos) : 'N/A'})` : 'N/A',
            grupo[2] ? `${grupo[2].nome} (${grupo[2].tempoEmSegundos ? formatarTempo(grupo[2].tempoEmSegundos) : 'N/A'})` : 'N/A',
            grupo[0] ? `${grupo[0].nome} (${grupo[0].tempoEmSegundos ? formatarTempo(grupo[0].tempoEmSegundos) : 'N/A'})` : 'N/A',
            grupo[1] ? `${grupo[1].nome} (${grupo[1].tempoEmSegundos ? formatarTempo(grupo[1].tempoEmSegundos) : 'N/A'})` : 'N/A',
            grupo[3] ? `${grupo[3].nome} (${grupo[3].tempoEmSegundos ? formatarTempo(grupo[3].tempoEmSegundos) : 'N/A'})` : 'N/A',
            grupo[5] ? `${grupo[5].nome} (${grupo[5].tempoEmSegundos ? formatarTempo(grupo[5].tempoEmSegundos) : 'N/A'})` : 'N/A',
        ];

        nadadores.forEach((nadador, raiaIndex) => {
            if (posY + 10 > doc.internal.pageSize.height) {
                doc.addPage(); // Adiciona uma nova página se o espaço estiver acabando
                posY = 20; // Reinicia a posição Y na nova página
            }
            doc.text(`Raia ${raiaIndex + 1}: ${nadador}`, 10, posY);
            posY += 10;
        });

        posY += 10; // Espaço entre piscinas
    });

    doc.save('distribuicao_nadadores.pdf');
}

