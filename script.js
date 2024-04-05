let
quantidadeColunas = 7,
quantidadeMaximaPorColuna = 3
;


document.getElementById('abrirArquivo').addEventListener('change', (event) => {
    const arquivo = event.target.files[0];
    const ler = new FileReader();
    var novasLinhas = [];
    ler.onload = function () {
        const texto = ler.result;
        const filtro = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
        const linhas = texto.split("\n");
        var pontoVirgulaForaAspas = linhas[2].replace(filtro, '; ').split('; ');

        var separandoNomeParaOrganizar = pontoVirgulaForaAspas[0].replace(/"/g, '').split(',');

        var listaAlunos = separandoNomeParaOrganizar[1] + " " + separandoNomeParaOrganizar[0] + ";" + pontoVirgulaForaAspas[4] + ";" + pontoVirgulaForaAspas[121]
            .split(',')[0].replace(/"/g, '') + "\n"
        for (let i = 3; i < linhas.length - 3; i++) {
            pontoVirgulaForaAspas = linhas[i].replace(filtro, '; ').split('; ');
            separandoNomeParaOrganizar = pontoVirgulaForaAspas[0].replace(/"/g, '').split(',');
            listaAlunos += separandoNomeParaOrganizar[1] + " " + separandoNomeParaOrganizar[0] + ";" + pontoVirgulaForaAspas[4] + ";" + pontoVirgulaForaAspas[121]
                .split(',')[0].replace(/"/g, '') + "\n"
        }
        var novo = true;
        var id = 0;
        var listaAlunoss = listaAlunos.split('\n');
        for (var nota = 100; nota > 0; nota--) {
            for (var alunos = 0; alunos < listaAlunoss.length; alunos++) {
                var colunas = listaAlunoss[alunos].split(';');
                if (colunas[2] == nota) {
                    if (novo == true) { id++; novo = false; }
                    novasLinhas.push(id + "," + listaAlunoss[alunos].trim().replace(/;/g, ","));
                    continue;
                }
            }
            novo = true;
        }
        classificacao(novasLinhas);
        // Nome da turma
        document.getElementById("sala").innerText = novasLinhas[0].split(',')[2];
    }
    ler.onerror = function () { console.error('Erro ao ler o arquivo'); };
    ler.readAsText(arquivo, 'UTF-8');
});


function classificacao(lista) {
    const divs = document.querySelectorAll("#classificar div");
    divs.forEach((e)=>{e.style.width = `${parseInt(document.body.clientWidth / (quantidadeColunas + 1))}px`;});
    const classficar = document.querySelectorAll("#classificar > div");
    let id = 0, nota = 0;

    for (let i = 0; i < lista.length; i++) {
        id = parseInt(lista[i].split(',')[0]);
        if (id <= quantidadeColunas) {
            document.getElementById("c" + id).innerHTML += lista[i].split(',')[1] + "\n\n";
            M(document.getElementById("c" + id).innerText.split('\n').length);
        }
    }
    document.getElementById("classificar").style.display = "flex";
}

const areaFoto = document.getElementById("rank");
const ft = document.getElementById("fotos");
const rft = document.getElementById("rft");

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

function M(texto) {
    console.log(texto);
}