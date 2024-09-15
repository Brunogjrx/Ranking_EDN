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

    console.log('enter here 0');
    const ordemIndices = [10, 8, 6, 4, 2, 1, 3, 5, 7, 9];
    const filePath = 'alunos.txt';

    criarDicionario(filePath)
        .then(registros => {
            console.log('enter here 1');
            console.log(registros);
            registros.sort((a, b) => {
                console.log('enter here 2');
                const indiceA = ordemIndices.indexOf(a.posicao);
                const indiceB = ordemIndices.indexOf(b.posicao);
                return indiceA - indiceB;
            });
            console.log('enter here 3');

            const podium = document.getElementById('podium');
            console.log('enter here 4');
            const registrosAgrupados = {};
            const pontuacao = {}

            registros.forEach(registro => {
                if (!registrosAgrupados[registro.posicao]) {
                    registrosAgrupados[registro.posicao] = [];
                    pontuacao[registro.posicao] = registro.porcentagem;
                }
                console.log('enter here 5');
                registrosAgrupados[registro.posicao].push(registro.nome);
            });
            
            console.log('enter here 6');
            for (let i = 0; i < ordemIndices.length; i++) {
                console.log('enter here 7');
                const positionElement = document.createElement('div');
                positionElement.classList.add('position');
                console.log('enter here 8');
                const medalha = document.createElement('img');
                medalha.src = "https://img.icons8.com/plasticine/100/gold-medal.png";
                medalha.style.width ="100px";
                positionElement.appendChild(medalha)
                console.log('enter here 9');
                const nomeElement = document.createElement('h3');
                nomeElement.textContent = pontuacao[ordemIndices[i]] + '%';
                positionElement.appendChild(nomeElement);
                console.log('enter here 10');
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
                console.log('enter here 11');
                podium.appendChild(positionElement);
            }
        })
        .catch(error => {
            console.error('Erro ao criar o dicionário:', error);
        });
});

document.addEventListener("DOMContentLoaded", function () {
    console.log('enter here 12');
    const podium = document.getElementById('podium');
    console.log('enter here 13');
    function ajustarAlturaPosicao() {
        const posicoes = document.querySelectorAll('.position');
        const totalPosicoes = posicoes.length;
        console.log('enter here 14');
        let alturaTotal = 0;
        posicoes.forEach(posicao => {
            alturaTotal += posicao.scrollHeight;
        });
        console.log('enter here 15');
        const alturaMedia = alturaTotal / totalPosicoes;

        const diferencasAltura = [];
        for (let i = 0; i < totalPosicoes - 1; i++) {
            const diferenca = posicoes[i + 1].scrollHeight - posicoes[i].scrollHeight;
            console.log('enter here 16');
            diferencasAltura.push(diferenca);
        }
        console.log('enter here 17');
        const proporcoes = diferencasAltura.map(diferenca => diferenca / alturaTotal);

        for (let i = 0; i < totalPosicoes; i++) {
            console.log('enter here 18');
            const novaAltura = posicoes[i].scrollHeight + alturaMedia * proporcoes[i];
            posicoes[i].style.height = novaAltura + 'px';
        }
        console.log('enter here 19');
    }
    console.log('enter here 20');
    ajustarAlturaPosicao();
    console.log('enter here 21');
    const observer = new MutationObserver(ajustarAlturaPosicao);
    console.log('enter here 22');
    observer.observe(podium, { childList: true, subtree: true });
    console.log('enter here 23');
});