document.addEventListener('DOMContentLoaded', function () {
    // Função para buscar eventos do servidor
    function fetchEventos() {
        return fetch('/buscarEventos')
            .then(response => response.json())
            .then(data => data)
            .catch(error => {
                console.error('Erro ao buscar eventos:', error);
                return [];
            });
    }

    function fetchTorneios() {
        console.log('Buscando torneios...');
        return fetch('/buscarTorneios')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da rede');
                }
                return response.json();
            })
            .then(data => {
                console.log('Torneios recebidos:', data);
                return data;
            })
            .catch(error => {
                console.error('Erro ao buscar torneios:', error);
                return [];
            });
    }

    /*  FORMATA DATA */
    function formatarData(dataStr) {
        const data = new Date(dataStr);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são indexados de 0 a 11
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${horas}:${minutos}`; //formato DDmmAAAA hhMM
    }

    // Função para gerar os tiles de eventos
    function listarEventos(eventos) {
        const listaEventosContainer = document.getElementById('listaEventos');
        listaEventosContainer.innerHTML = ''; // Limpa o container antes de adicionar novos tiles

        eventos.forEach(evento => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-md-4', 'mb-4');

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');

            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body');

            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.textContent = evento.nome;

            const cardData = document.createElement('p');
            cardData.classList.add('card-text');
            cardData.textContent = `Data: ${formatarData(evento.data)}`;

            const cardText = document.createElement('p');
            cardText.classList.add('card-text');
            cardText.textContent = `Cidade: ${evento.cidade}`;

            const cardButton = document.createElement('a');
            cardButton.classList.add('btn', 'btn-primary');
            cardButton.textContent = 'Incluir Resultados';
            cardButton.addEventListener('click', function () {
                mostrarFormularioResultados(evento);
            });

            cardBodyDiv.appendChild(cardTitle);
            cardBodyDiv.appendChild(cardText);
            cardBodyDiv.appendChild(cardData);
            cardBodyDiv.appendChild(cardButton);

            cardDiv.appendChild(cardBodyDiv);
            colDiv.appendChild(cardDiv);

            listaEventosContainer.appendChild(colDiv);
        });
    }

     // Função para mostrar o formulário de resultados
     function mostrarFormularioResultados(evento) {
        const divEventos = document.getElementById('divEventos');
        const divResultados = document.getElementById('divResultados');
        const eventoTitulo = document.getElementById('eventoTitulo');

        divResultados.style.display = 'block'; //mostra o registro de prova
        divEventos.style.display = 'none'; //esconde a escolha de evento
        
        //Mostra qual evento é referente a classificação
        nomeEventoResultado.textContent = `${evento.nome} - ${evento.cidade}`;
    
        //Carrega os torneios
        fetchTorneios().then(torneios => {
            listarTorneios(torneios);
        });
    
    }

    function listarTorneios(torneios) {
        const ddTorneios = document.getElementById('ddTorneios');//dropdown dos torneios
        const dropdownButton = document.getElementById('dropdownMenuButton1');  // Salva o escolhido dentro do item
        ddTorneios.innerHTML = ''; // Limpa o dropdown antes de adicionar novos itens

        torneios.forEach(torneio => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.classList.add('dropdown-item');
            a.href = '#';
            a.textContent = torneio.nome;
            //salvar a opção que for clicada
            a.addEventListener('click', function (event) {
                event.preventDefault();
                console.log('Torneio selecionado:', torneio);
                dropdownButton.textContent = torneio.nome;
            });
            li.appendChild(a);
            ddTorneios.appendChild(li);
        });
    }


    // Inicializa a página buscando os eventos e gerando os tiles
    fetchEventos().then(eventos => {
        listarEventos(eventos);
    });



/************************************************************************** */
/*Inicio Registro de Prova*/








});
