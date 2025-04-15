const grid = document.querySelector('.grid');
const fimDeJogo = document.getElementById('fim-de-jogo');
const overlay = document.getElementById('overlay'); 
const tituloFimDeJogo = document.getElementById('titulo-fim-de-jogo');
const mensagemFimDeJogo = document.getElementById('mensagem-fim-de-jogo');
const jogarNovamente = document.getElementById('jogar-novamente');
const sair = document.getElementById('sair');

const itens = [
    'banana',
    'frasco',
    'garrafapet',
    'jornal',
    'lata',
    'latinha',
    'papelao',
    'RestoComida',
    'sacola',
    'vidro',
];

const mapeamentoLixeira = {
    'jornal': 'lixeira-azul',
    'lata': 'lixeira-amarela',
    'garrafapet': 'lixeira-vermelha',
    'frasco': 'lixeira-verde',
    'banana': 'lixeira-marrom',
    'latinha' : 'lixeira-amarela',
    'papelao': 'lixeira-azul',
    'RestoComida' : 'lixeira-marrom',
    'sacola' : 'lixeira-vermelha',
    'vidro': 'lixeira-verde',
};

let primeiraCarta = '';
let segundaCarta = '';
let tempoRestante = 120; 
let pontuacao = 0;
let timerInterval;

const atualizarTempo = () => {
    const timerDisplay = document.getElementById('tempo-restante');
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    
    if (tempoRestante === 0) {
        clearInterval(timerInterval);
        mostrarFimDeJogo(false);
    } else {
        timerDisplay.textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
        tempoRestante--;
    }
}
const iniciarTimer = () => {
    atualizarTempo(); 
    timerInterval = setInterval(atualizarTempo, 1000);
}

const incrementarPontuacao = () => {
    pontuacao++;
    const pontuacaoDisplay = document.querySelector('.pontuacao');
    pontuacaoDisplay.textContent = `Pontuação: ${pontuacao}`;
}

const checarCarta = () => {
    const primeiroItem = primeiraCarta.getAttribute('data-item');
    const segundoItem = segundaCarta.getAttribute('data-item');

    if (primeiroItem === segundoItem) {
        incrementarPontuacao();
        primeiraCarta = '';
        segundaCarta = '';
    } else {
        setTimeout(() => {
            primeiraCarta.classList.remove('revelar-carta');
            segundaCarta.classList.remove('revelar-carta');
            primeiraCarta = '';
            segundaCarta = '';
        }, 500);
    }
}

const revelarcarta = ({ target }) => {
    if (target.parentNode.className.includes('revelar-carta')) {
        return;
    }

    if (primeiraCarta === '') {
        target.parentNode.classList.add('revelar-carta');
        primeiraCarta = target.parentNode;
    } else if (segundaCarta === '') {
        target.parentNode.classList.add('revelar-carta');
        segundaCarta = target.parentNode;
        checarCarta();
    }
}

const criarCarta = (item) => {
    const carta = document.createElement('div');
    carta.className = 'carta';
    const front = document.createElement('div');
    front.className = 'face front';
    const back = document.createElement('div');
    back.className = 'face back';

    front.style.backgroundImage = `url('../imagens_itens/${item}.png')`;

    carta.appendChild(front);
    carta.appendChild(back);

    carta.addEventListener('click', revelarcarta);
    carta.setAttribute('data-item', item)

    carta.setAttribute('draggable', true);
    carta.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', item);
    });

    return carta;
}

const lixeiras = document.querySelectorAll('.imagens-latao img');

lixeiras.forEach(lixeira => {
    lixeira.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    lixeira.addEventListener('drop', (event) => {
        event.preventDefault();
        const item = event.dataTransfer.getData('text/plain');
        const lixeiraCorreta = mapeamentoLixeira[item];
        if (event.target.id === lixeiraCorreta) {
            const cartas = document.querySelectorAll(`[data-item='${item}']`);
            cartas.forEach(carta => {
                if (carta.classList.contains('revelar-carta')) {
                    carta.classList.add('carta-oculta'); 
                }
            });
            checarVitoria();
        }
    });
});

const mostrarFimDeJogo = (venceu) => {
    fimDeJogo.style.display = 'block';
    overlay.style.display = 'block'; 
    pontuacaoFinal = pontuacao + (tempoRestante + 1);
    const username = localStorage.getItem('username');
    if (venceu) {
        tituloFimDeJogo.textContent = 'Parabéns!';
        mensagemFimDeJogo.textContent = `${username}, você concluiu o jogo com ${pontuacao} acertos e ${tempoRestante + 1} segundos restantes.
        Sua pontuação final: ${pontuacaoFinal}`;
    } else {
        tituloFimDeJogo.textContent = 'Que pena!';
        mensagemFimDeJogo.textContent = `${username}, você não conseguiu concluir o jogo a tempo. Sua pontuação final foi ${pontuacao}.`;
    }
}

jogarNovamente.addEventListener('click', () => {
    fimDeJogo.style.display = 'none';
    overlay.style.display = 'none'; 
    carregarJogo();
});

sair.addEventListener('click', () => {
    window.location.href = 'index.html';
});

const checarVitoria = () => {
    const todasCartasOcultas = Array.from(grid.children).every(carta => carta.classList.contains('carta-oculta'));
    if (todasCartasOcultas) {
        clearInterval(timerInterval);
        mostrarFimDeJogo(true);
    }
}

jogarNovamente.addEventListener('click', () => {
    fimDeJogo.style.display = 'none';
    carregarJogo();
});

sair.addEventListener('click', () => {
    window.location.href = 'index.html';
});

const carregarJogo = () => {
    clearInterval(timerInterval); 

    grid.innerHTML = '';
    tempoRestante = 120;
    pontuacao = 0; 
    primeiraCarta = '';
    segundaCarta = '';

    const pontuacaoDisplay = document.querySelector('.pontuacao');
    pontuacaoDisplay.textContent = `Pontuação: ${pontuacao}`; 

    iniciarTimer();
    const duplicarCartas = [...itens, ...itens];
    const embaralharArray = duplicarCartas.sort(() => Math.random() - 0.5 );
    embaralharArray.forEach((item) => {
        const carta = criarCarta(item);
        grid.appendChild(carta);
    });

    grid.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
    grid.addEventListener('drop', (event) => {
        event.preventDefault();
        const item = event.dataTransfer.getData('text/plain');
        if (event.target.getAttribute('data-item') === item) {
            event.target.classList.add('revelar-carta');
        }
    });
}
carregarJogo();
