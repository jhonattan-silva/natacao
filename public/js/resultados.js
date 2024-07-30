document.addEventListener('DOMContentLoaded', function () {
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
                provaSelect.innerHTML = '';
                provas.forEach(prova => {
                    const option = document.createElement('option');
                    option.value = prova.id;
                    option.textContent = prova.nome;
                    provaSelect.appendChild(option);
                });

                provaSelect.addEventListener('change', () => {
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
        fetch(`/resultados/buscarBaterias?prova_id=${provaId}`)
            .then(response => response.json())
            .then(baterias => {
                resultadoContainer.innerHTML = '';
                if (baterias.length === 0) {
                    resultadoContainer.innerHTML = '<p>Não há baterias disponíveis para esta prova.</p>';
                } else {
                    baterias.forEach(bateria => {
                        console.log(bateria.id);
                        const div = document.createElement("div");
                        div.classList.add("bateria");
                        div.innerHTML = `
                            <h3>Bateria ${bateria.id}</h3>
                            <p>Piscina: ${bateria.piscina}</p>
                            <p>Raia: ${bateria.raia}</p>
                            <p>Tempo de Inscrição: ${bateria.tempo_inscricao}</p>
                        `;
                        resultadoContainer.appendChild(div);
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
