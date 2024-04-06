//Variaveis
let
    quantidadeColunas = 7,
    quantidadeMaximaPorColuna = 3
    ;

//Carregar
document.getElementById('abrirArquivo').addEventListener('change', (event) => {
    const arquivo = event.target.files[0],
        ler = new FileReader();
    let novasLinhas = [];
    ler.onload = function () {
        const texto = ler.result,
            filtro = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g,
            linhas = texto.split("\n");
        let listaJaFiltrada = linhas[2].replace(filtro, '; ').split('; ');

        let separandoNomeParaOrganizar = listaJaFiltrada[0].replace(/"/g, '').split(',');

        let listaAlunos = separandoNomeParaOrganizar[1] + " " + separandoNomeParaOrganizar[0] + ";"
            + listaJaFiltrada[linhas[0].split(",").indexOf("Section")] + ";" +
            listaJaFiltrada[linhas[0].split(",").indexOf("Current Score")].split(',')[0].replace(/"/g, '') + "\n";
        for (let i = 3; i < linhas.length - 3; i++) {
            listaJaFiltrada = linhas[i].replace(filtro, '; ').split('; ');
            separandoNomeParaOrganizar = listaJaFiltrada[0].replace(/"/g, '').split(',');
            listaAlunos += separandoNomeParaOrganizar[1] + " " + separandoNomeParaOrganizar[0] + ";"
                + listaJaFiltrada[linhas[0].split(",").indexOf("Section")] + ";" + listaJaFiltrada[linhas[0].split(",").indexOf("Current Score")].split(',')[0].replace(/"/g, '') + "\n"
        }
        let novo = true, id = 0, listaAlunoss = listaAlunos.split('\n');
        for (let nota = 100; nota > 0; nota--) {
            for (let alunos = 0; alunos < listaAlunoss.length; alunos++) {
                let colunas = listaAlunoss[alunos].split(';');
                if (colunas[2] == nota) {
                    if (novo == true) { id++; novo = false; }
                    novasLinhas.push(id + "," + listaAlunoss[alunos].trim().replace(/;/g, ","));
                    continue;
                }
            }
            novo = true;
        }
        classificacao(novasLinhas);
        document.getElementById("sala").innerText = novasLinhas[0].split(',')[2];
    }
    ler.onerror = function () { console.error('Erro ao ler o arquivo'); };
    ler.readAsText(arquivo, 'UTF-8');
});

//Lista
function classificacao(lista) {
    document.querySelectorAll("#classificar > div").forEach((el) => { el.remove(); });
    const classf = document.getElementById("classificar");
    classf.style.gap = `${(20 / quantidadeColunas)}vw`;
    let divClassf = null, imgClassf = null, p1Classf = null, p2Classf = null, alturaCalc = 0, diferencaAltura = 10;
    let imgUrl = null, nomeAluno = null;
    const preposicao = ["da", "das", "de", "di", "do", "dos"];
    for (let i = 0; i < quantidadeColunas; i++) {
        divClassf = document.createElement("div");
        divClassf.id = "c" + (i + 1);
        diferencaAltura = alturaCalc < 60 ? 4 : diferencaAltura;
        alturaCalc = 100 - (i * diferencaAltura);
        divClassf.style.cssText = `height: ${alturaCalc}%; width: ${100 / quantidadeColunas}%;`;
        imgClassf = document.createElement("img");
        imgClassf.id = "img" + i + 1;
        imgClassf.style.height = "4vh";
        imgClassf.style.width = "auto";
        p1Classf = document.createElement("p");
        p1Classf.style.color = "#CCC";
        p1Classf.id = "p1" + i + 1;
        p2Classf = document.createElement("p");
        p2Classf.style.fontSizeAdjust = "1";
        p2Classf.style.color = "#FFF";
        p2Classf.id = "p2" + i + 1;

        for (let j = 0; j < lista.length; j++) {
            posicao = parseInt(lista[j].split(',')[0]);
            if (posicao == (i + 1)) {
                switch (posicao) {
                    case 1: imgUrl = "./src/premio1.png"; break;
                    case 2: imgUrl = "./src/premio2.png"; break;
                    case 3: imgUrl = "./src/premio3.png"; break;
                    default: imgUrl = "./src/premio4.png"; break;
                }
                imgClassf.src = imgUrl;
                nomeAluno = lista[j].split(',')[1];
                M("0"+nomeAluno);
                if (nomeAluno.split(' ').length > 2) {
                    if (preposicao.some(p => p == nomeAluno.split(' ')[1].toLowerCase())) {
                        nomeAluno = nomeAluno.split(' ')[0] + " " + nomeAluno.split(' ')[2];
                        M("2"+nomeAluno.split(' ')[2]);
                    }else{
                        nomeAluno = nomeAluno.split(' ')[0] + " " + nomeAluno.split(' ')[1];
                        M("1"+nomeAluno.split(' ')[2]);
                    }
                }

                p2Classf.innerHTML += nomeAluno + "</br></br>";
                p1Classf.innerText = lista[j].split(',')[3] + "%";
            }
        }
        divClassf.appendChild(imgClassf)
        divClassf.appendChild(p1Classf);
        divClassf.appendChild(p2Classf);
        classf.appendChild(divClassf);

    }
    let id = 0;

    document.getElementById("classificar").style.display = "flex";
}

// Foto
const areaFoto = document.getElementById("rank");
const ft = document.getElementById("fotos");
ft.addEventListener("click", async () => {
    const canvas = await html2canvas(document.querySelector("#rank")).then(canvas => {
        const img = canvas.toDataURL();
        let a = document.createElement("a");
        a.style = "display: none"; document.body.appendChild(a);
        a.href = img;
        const dt = new Date();
        const agora = dt.getDay() + "." + dt.getMonth() + "." + dt.getFullYear() + " - " + dt.getHours() + "." + dt.getMinutes() + "." + dt.getSeconds();
        a.download = "Grafico [" + agora + "].png";
        a.click();
        window.URL.revokeObjectURL(url); a.remove();
    });
});

// Mensagem
function M(texto) {
    console.log(texto);
}