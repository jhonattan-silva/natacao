let eventos; // Declara a variável eventos no escopo mais externo

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM completamente carregado e analisado');
    carregarEventos();

});

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

/*FUNÇÕES DO BALIZAMENTO*/

// Converter o tempo para milissegundos
function timeToMilliseconds(time) {
    if (time === "Sem recorde") return Infinity; // Para ordenar nadadores sem tempo registrado no final
    const [minutes, seconds, centiseconds] = time.split(':').map(Number);
    return (minutes * 60 + seconds + centiseconds / 100) * 1000;
}
// Função para dividir nadadores em baterias de 6 em 6
function dividirEmBaterias(nadadores) {
    const maxPorBateria = 6; // Número máximo de nadadores por bateria
    let baterias = []; // Inicializa a lista de baterias

    for (let i = 0; i < nadadores.length; i += maxPorBateria) {
        let bateria = nadadores.slice(i, i + maxPorBateria); // Cria a sublista de nadadores
        baterias.push(bateria); // Adiciona a bateria à lista
    }

    return baterias;
}

// Função para distribuir os nadadores nas raias de acordo com a classificação
function distribuirNadadoresNasRaias(nadadores) {
    const nadadoresPorRaia = Array(6).fill(null).map(() => []);

    // Ordem das raias conforme a posição de classificação
    const ordemRaias = [2, 3, 1, 4, 0, 5]; // Raia 3, 4, 2, 5, 1, 6 (0-indexado)

    // Ordena os nadadores pelos tempos mais rápidos (menor para maior)
    nadadores.forEach((nadador, index) => {
        // Calcular a raia correspondente
        const raiaIndex = ordemRaias[index % 6]; // Usa o índice do nadador para definir a raia
        nadadoresPorRaia[raiaIndex].push(nadador); // Adiciona o nadador à raia correspondente
    });

    return nadadoresPorRaia; // Retorna o array de nadadores organizados por raia
}

// ação de clique no botão BALIZAR
document.getElementById('btnBalizar').addEventListener('click', () => {
    const eventoId = document.getElementById('selectEvento').value;

    if (!eventoId) {
        alert('Por favor, selecione um evento.');
        return;
    }

    // Listar os inscritos para verificação
    fetch(`/balizamento/listarInscritos?eventoId=${eventoId}`)
        .then(response => response.json())
        .then(data => {
            const resultadoContainer = document.querySelector('.resultado-container');
            resultadoContainer.innerHTML = ''; // Limpa o conteúdo anterior

            let provaAtual = '';
            let tabela, tbody; // Variáveis para criar as tabelas

            // Primeira parte: Listar os inscritos como antes
            data.forEach(inscrito => {
                if (inscrito.nome_prova !== provaAtual) {
                    // Se a prova mudou, cria um novo título e uma nova tabela
                    provaAtual = inscrito.nome_prova;

                    // Cria o título da prova
                    const tituloProva = document.createElement('h3');
                    tituloProva.textContent = `Inscritos - ${provaAtual}`;
                    resultadoContainer.appendChild(tituloProva);

                    // Cria uma nova tabela para os inscritos
                    tabela = document.createElement('table');
                    const thead = tabela.createTHead();
                    const headerRow = thead.insertRow();
                    headerRow.insertCell().textContent = 'Nadador';
                    headerRow.insertCell().textContent = 'Tempo';

                    tbody = tabela.createTBody();
                    resultadoContainer.appendChild(tabela);
                }

                // Adiciona a linha do nadador à tabela de inscritos
                const row = tbody.insertRow();
                row.insertCell().textContent = inscrito.nome_nadador;
                row.insertCell().textContent = inscrito.melhor_tempo;
            });

            // Segunda parte: Balizamento (distribuição em baterias)
            const tituloBalizamento = document.createElement('h1');
            tituloBalizamento.textContent = 'Balizamento';
            resultadoContainer.appendChild(tituloBalizamento);

            // Divisão por provas para o balizamento
            let nadadoresPorProva = {};

            // Agrupa nadadores por prova para o balizamento
            data.forEach(inscrito => {
                if (!nadadoresPorProva[inscrito.nome_prova]) {
                    nadadoresPorProva[inscrito.nome_prova] = [];
                }
                nadadoresPorProva[inscrito.nome_prova].push(inscrito);
            });

            // Processar cada prova separadamente
            Object.keys(nadadoresPorProva).forEach(prova => {
                const nadadores = nadadoresPorProva[prova];
                const nadadoresSemTempo = nadadores.filter(n => n.melhor_tempo === "Sem recorde"); // Filtra nadadores sem tempo registrado
                const nadadoresComTempo = nadadores
                    .filter(n => n.melhor_tempo !== "Sem recorde")
                    .sort((a, b) => timeToMilliseconds(a.melhor_tempo) - timeToMilliseconds(b.melhor_tempo)); // Ordena do mais rápido para o mais lento

                const todosNadadores = [...nadadoresComTempo, ...nadadoresSemTempo]; // Combina nadadores com e sem tempo
                const baterias = dividirEmBaterias(todosNadadores); // Divide os nadadores em baterias

                // Cria o título da prova para balizamento
                const tituloProvaBalizamento = document.createElement('h3');
                tituloProvaBalizamento.textContent = `Balizamento - ${prova}`;
                resultadoContainer.appendChild(tituloProvaBalizamento);

                // Exibe nadadores organizados por baterias
                baterias.forEach((bateria, index) => {
                    // Cria uma nova tabela para a bateria
                    const tabelaBateria = document.createElement('table');

                    // Cria o cabeçalho para Nadador e Tempo
                    const theadBateria = tabelaBateria.createTHead();
                    const headerRowBateria = theadBateria.insertRow();
                    headerRowBateria.insertCell().textContent = 'Raia';
                    headerRowBateria.insertCell().textContent = 'Nadador';
                    headerRowBateria.insertCell().textContent = 'Tempo';

                    // Cria a linha com o título "Bateria X" acima do cabeçalho
                    const tituloBateriaRow = tabelaBateria.insertRow(0); // Insere como a primeira linha
                    const tituloBateriaCell = tituloBateriaRow.insertCell();
                    tituloBateriaCell.textContent = `Bateria ${index + 1}`;
                    tituloBateriaCell.colSpan = 3; // Ocupa as 3 colunas
                    resultadoContainer.appendChild(tabelaBateria);

                    const tbodyBateria = tabelaBateria.createTBody();

                    // Organiza os nadadores nas raias conforme a classificação
                    const nadadoresDistribuidos = distribuirNadadoresNasRaias(bateria);

                    // Adiciona os nadadores nas posições corretas da tabela de acordo com a raia
                    nadadoresDistribuidos.forEach((raia, raiaIndex) => {
                        raia.forEach(nadador => {
                            const row = tbodyBateria.insertRow();
                            row.insertCell().textContent = raiaIndex +1; //raia é o indice +1
                            row.insertCell().textContent = nadador.nome_nadador;
                            row.insertCell().textContent = nadador.melhor_tempo || 'Sem tempo';
                        });
                    });
                });
            });
        })
        .catch(error => {
            console.error('Erro ao buscar inscritos:', error);
        });
});


/* 

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

 */