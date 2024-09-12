document.addEventListener('DOMContentLoaded', function () {
    let eventoNome = ''; //var do evento
    let provaNome = ''; //var da prova
    let quantidadeSeries = 0; //var qtd de series por prova

    // Função para carregar eventos no select
    function carregarEventos() {
        fetch('/resultados/buscarEventos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar eventos');
                }
                return response.json();
            })
            .then(data => {
                const eventoSelect = document.getElementById('selectEvento');
                data.forEach(evento => {
                    const option = document.createElement('option');
                    option.value = evento.id;
                    const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR');
                    option.textContent = `${evento.nome} - ${dataFormatada}`;
                    eventoSelect.appendChild(option);
                });

                eventoSelect.addEventListener('change', () => {
                    eventoNome = eventoSelect.options[eventoSelect.selectedIndex].text; //salva o nome do evento para posterior uso
                    const eventoId = eventoSelect.value;
                    carregarProvas(eventoId);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar eventos:', error);
            });
    }

    // Função para carregar provas no select
    function carregarProvas(eventoId) {
        fetch(`/resultados/buscarProvas?eventoId=${eventoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar provas');
                }
                return response.json();
            })
            .then(provas => {
                const provaSelect = document.getElementById('selectProva');
                provaSelect.innerHTML = '<option value="">Selecione uma Prova</option>'; // Adiciona a opção em branco
    
                provas.forEach(prova => {
                    const option = document.createElement('option');
                    option.value = prova.id;
                    option.textContent = prova.nome;
                    provaSelect.appendChild(option);
                });
    
                // Verifica se existe apenas uma prova e carrega automaticamente se necessário
                if (provas.length === 1) {
                    provaSelect.value = provas[0].id; // Seleciona automaticamente a única prova
                    carregarBaterias(provas[0].id); // Carrega baterias automaticamente
                }

                provaSelect.addEventListener('change', () => {
                    provaNome = provaSelect.options[provaSelect.selectedIndex].text; //salva o nome da prova para exibição posterior
                    const provaId = provaSelect.value;
                    carregarBaterias(provaId);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar provas:', error);
            });
    }

    // Função para carregar baterias e suas inscrições
    function carregarBaterias(provaId) {
        console.log("Prova ID:", provaId);
        fetch(`/resultados/buscarBaterias?provaId=${provaId}`)
            .then(response => response.json())
            .then(baterias => {
                console.log("Baterias Recebidas:", baterias); // Adicione este log para verificar os dados recebidos
                const resultadoContainer = document.getElementById('resultadoContainer');
                resultadoContainer.innerHTML = '';

                if (baterias.length === 0) {
                    resultadoContainer.innerHTML = '<p>Não há baterias disponíveis para esta prova.</p>';
                } else {
                    quantidadeSeries = baterias.length; //contador de series da prova
                    console.log("Quantidade de séries calculada:", quantidadeSeries); // Verifique quantas séries foram calculadas


                   // Adiciona título e informações da prova
                   const infoDiv = document.createElement('div');
                   infoDiv.innerHTML = `
                                <h3>Evento ${eventoNome}</h3>
                                <p>Prova: ${provaNome}</p>
                                <p>Quantidade de séries: ${quantidadeSeries}</p>  
                   `;
                   resultadoContainer.appendChild(infoDiv);


                    baterias.forEach(bateria => {
                        if (bateria.nadadores && bateria.nadadores.length > 0) {
                            const div = document.createElement("div");
                            div.classList.add("bateria");
                        
                            // Adiciona título e informações da bateria
                            div.innerHTML = `
                                <hr>
                              <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Raia</th>
                                            <th>Piscina</th>
                                            <th>Tempo Obtido</th>
                                        </tr>
                                    </thead>
                                    <tbody id="nadadores_bateria_${bateria.id}">
                                        <!-- Nadadores serão adicionados aqui -->
                                    </tbody>
                                </table>
                            `;
                        
                            resultadoContainer.appendChild(div);
                        
                            // Exibir nadadores associados à bateria em linhas de tabela
                            const nadadoresTBody = div.querySelector(`#nadadores_bateria_${bateria.id}`);
                            bateria.nadadores.forEach(nadador => {
                                const nadadorRow = document.createElement("tr");
                                nadadorRow.innerHTML = `
                                    <td>${nadador.nome}</td>
                                    <td>${nadador.raia}</td>
                                    <td>${nadador.piscina}</td>
                                    <td>
                                        <input type="text" id="tempo_${nadador.id}" name="tempo_${nadador.id}" class="form-control">
                                    </td>
                                `;
                                nadadoresTBody.appendChild(nadadorRow);
                            });
                        } else {
                            console.log(`Bateria ${bateria.id} não tem nadadores associados.`);
                        }
                        
                    });
                }
            })
            .catch(error => console.error("Erro ao carregar baterias:", error));
    }

    // Função para formatar o tempo de segundos para exibição
    function formatarTempo(tempoEmSegundos) {
        const horas = Math.floor(tempoEmSegundos / 3600);
        const minutos = Math.floor((tempoEmSegundos % 3600) / 60);
        const segundos = tempoEmSegundos % 60;
        return `${horas}:${minutos}:${segundos}`;
    }

    carregarEventos();
});
