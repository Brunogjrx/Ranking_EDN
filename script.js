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
        
        let listaAlunos = separandoNomeParaOrganizar[1] + " " + separandoNomeParaOrganizar[0] + ";" + listaJaFiltrada[linhas[0].split(",").indexOf("Section")] + ";" + listaJaFiltrada[linhas[0].split(",").indexOf("Current Score")].split(',')[0].replace(/"/g, '') + "\n";
        for (let i = 3; i < linhas.length - 3; i++) {
            listaJaFiltrada = linhas[i].replace(filtro, '; ').split('; ');
            separandoNomeParaOrganizar = listaJaFiltrada[0].replace(/"/g, '').split(',');
            listaAlunos += separandoNomeParaOrganizar[1] + " " + separandoNomeParaOrganizar[0] + ";" + listaJaFiltrada[4] + ";" + listaJaFiltrada[121].split(',')[0].replace(/"/g, '') + "\n"
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
    /* Para o futuro , quantidade de colunas
    const classf = document.getElementById("classificar");
    let divClassf = null;
    for(let i=1;i<quantidadeColunas;i++){
        divClassf = document.createElement("div");
        divClassf.id = "c"+i;
        divClassf.style.cssText = `"height:+${i!=1?(i*10)-100:100}+px;"`;
        //divClassf.setAttribute("id", "c"+i);
        classf.appendChild(divClassf);
    }
    */
    /* const divs = document.querySelectorAll("#classificar > div");
    divs.forEach((e)=>{e.style.width = `${parseInt(document.body.clientWidth / (quantidadeColunas + 1))}px`;}); */

    let id = 0;
    for (let i = 0; i < lista.length; i++) {
        id = parseInt(lista[i].split(',')[0]);
        if (id <= quantidadeColunas) {
            document.getElementById("c" + id).innerHTML += lista[i].split(',')[1] + "</br></br>";
        }
    }
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