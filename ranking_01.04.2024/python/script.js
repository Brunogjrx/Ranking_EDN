function criarDicionario(filePath) {
    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                const linhas = data.trim().split('\n');
                const registros = [];

                linhas.forEach((linha) => {
                    const [posicao, nome, porcentagem] = linha.split(',');
                    registros.push({ posicao: parseInt(posicao.trim()), nome: nome.trim(), porcentagem: parseInt(porcentagem.trim()) });
                });

                resolve(registros);
            })
            .catch(error => {
                console.error('Erro ao carregar o arquivo:', error);
                reject(error);
            });
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const ordemIndices = [10, 8, 6, 4, 2, 1, 3, 5, 7, 9];
    const filePath = 'alunos.txt';

    criarDicionario(filePath)
        .then(registros => {
            console.log(registros);
            registros.sort((a, b) => {
                const indiceA = ordemIndices.indexOf(a.posicao);
                const indiceB = ordemIndices.indexOf(b.posicao);
                return indiceA - indiceB;
            });

            const podium = document.getElementById('podium');

            const registrosAgrupados = {};
            const pontuacao = {}

            registros.forEach(registro => {
                if (!registrosAgrupados[registro.posicao]) {
                    registrosAgrupados[registro.posicao] = [];
                    pontuacao[registro.posicao] = registro.porcentagem;
                }
                registrosAgrupados[registro.posicao].push(registro.nome);
            });
            

            for (let i = 0; i < ordemIndices.length; i++) {
                const positionElement = document.createElement('div');
                positionElement.classList.add('position');

                const medalha = document.createElement('img');
                medalha.src = "https://img.icons8.com/plasticine/100/gold-medal.png";
                medalha.style.width ="100px";
                positionElement.appendChild(medalha)

                const nomeElement = document.createElement('h3');
                nomeElement.textContent = pontuacao[ordemIndices[i]] + '%';
                positionElement.appendChild(nomeElement);

                porcentagem = registrosAgrupados[ordemIndices[i]];
                console.log(porcentagem);

                const nomes = registrosAgrupados[ordemIndices[i]];
                if (nomes) {
                    nomes.forEach(nome => {
                        const nomeElement = document.createElement('h5');
                        nomeElement.textContent = nome;
                        positionElement.appendChild(nomeElement);
                    });
                }

                podium.appendChild(positionElement);
            }
        })
        .catch(error => {
            console.error('Erro ao criar o dicionário:', error);
        });
});

document.addEventListener("DOMContentLoaded", function () {
    const podium = document.getElementById('podium');

    function ajustarAlturaPosicao() {
        const posicoes = document.querySelectorAll('.position');
        const totalPosicoes = posicoes.length;

        let alturaTotal = 0;
        posicoes.forEach(posicao => {
            alturaTotal += posicao.scrollHeight;
        });

        const alturaMedia = alturaTotal / totalPosicoes;

        const diferencasAltura = [];
        for (let i = 0; i < totalPosicoes - 1; i++) {
            const diferenca = posicoes[i + 1].scrollHeight - posicoes[i].scrollHeight;
            diferencasAltura.push(diferenca);
        }

        const proporcoes = diferencasAltura.map(diferenca => diferenca / alturaTotal);

        for (let i = 0; i < totalPosicoes; i++) {
            const novaAltura = posicoes[i].scrollHeight + alturaMedia * proporcoes[i];
            posicoes[i].style.height = novaAltura + 'px';
        }
    }

    ajustarAlturaPosicao();

    const observer = new MutationObserver(ajustarAlturaPosicao);
    observer.observe(podium, { childList: true, subtree: true });
});