const txTitulo = document.getElementById('texTitulo'), txSubtitulo = document.getElementById('textSubtitulo'),
    txProf = document.getElementById('texProfessor'), nSemana = document.getElementById('numSemana'),
    nColunas = document.getElementById('numColunas'), nAlunos = document.getElementById('numAlunos'),
    abrir = document.getElementById('abrirArquivo'),
    titulo = document.getElementById('stitulo'), subtitulo = document.getElementById('ssubtitulo'),
    prof = document.getElementById('sprof'), sala = document.getElementById('salas'),
    preposicoes = ["da", "das", "de", "di", "do", "dos"], areaFoto = document.getElementById('rank');

let alunosParaClipboard = '', alunosFiltrados = '', quantidadeColunas = 0;

abrir.addEventListener('change', (event) => {

    if (validarCampos()) { return; }

    quantidadeColunas = parseInt(nColunas.value);
    titulo.innerText = txTitulo.value;
    subtitulo.innerText = txSubtitulo.value + ' da semana ' + nSemana.value;
    prof.innerText = txProf.value;
    const arquivo = event.target.files[0], ler = new FileReader();
    let novasLinhas = [];

    ler.onload = function () {
        const texto = ler.result, linhas = texto.split('\n');
        let listaJaFiltrada = linhas[2].replace(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g, '; ').split('; ');
        let separandoNomeParaOrganizar = listaJaFiltrada[0].replace(/"/g, '').split(','), porcetagem = 0;
        let listaAlunos = formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), false) + ';' + listaJaFiltrada[linhas[0].split(',').indexOf('Section')] + ';';
        let xmai1 = listaJaFiltrada[linhas[0].split(',').indexOf('SIS Login ID')];
        alunosFiltrados = formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), true) + ';' + (xmai1.length > 2 ? xmai1 : 'Nenhum') + ';';
        let listaNomesCompletos = formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), true) + ',';

        porcetagem = listaJaFiltrada[linhas[0].split(',').indexOf('Current Score')];

        if (!(porcetagem.indexOf(",") < -1)) {
            listaAlunos += porcetagem.split(',')[0].replace(/"/g, '') + "\n";
            listaNomesCompletos += porcetagem.split(',')[0].replace(/"/g, '') + "\n";
            alunosFiltrados += porcetagem.split(',')[0].replace(/"/g, '') + "\n";
        } else {
            listaAlunos += porcetagem.replace(/"/g, '') + "\n";
            listaNomesCompletos += porcetagem.replace(/"/g, '') + "%\n";
            alunosFiltrados += porcetagem.replace(/"/g, '') + "%\n";
        }

        for (let i = 3; i < linhas.length - 3; i++) {
            listaJaFiltrada = linhas[i].replace(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g, '; ').split('; ');
            separandoNomeParaOrganizar = listaJaFiltrada[0].replace(/"/g, '').split(',');
            listaAlunos += formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), false) + ';' + listaJaFiltrada[linhas[0].split(',').indexOf('Section')] + ';';
            porcetagem = listaJaFiltrada[linhas[0].split(',').indexOf('Current Score')];
            listaNomesCompletos += formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), true) + ',';

            xmai1 = listaJaFiltrada[linhas[0].split(',').indexOf('SIS Login ID')];
            alunosFiltrados += formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), true) + ';' + (xmai1.length > 2 ? xmai1 : '--Nenhum registrado--') + ';';
            if (!(porcetagem.indexOf(",") < -1)) {
                listaAlunos += porcetagem.split(',')[0].replace(/"/g, '') + "\n"; listaNomesCompletos += porcetagem.split(',')[0].replace(/"/g, '') + "%\n"; alunosFiltrados += porcetagem.split(',')[0].replace(/"/g, '') + "\n";
            } else { listaAlunos += porcetagem.replace(/"/g, '') + "\n"; listaNomesCompletos += porcetagem.replace(/"/g, '') + "%\n"; alunosFiltrados += porcetagem.replace(/"/g, '') + "%\n"; }
        }

        let novo = true, id = 0, lista2Alunos = listaAlunos.split('\n');
        lista2Alunos = lista2Alunos.splice(0, lista2Alunos.length - 1);

        alunosFiltrados = listaLimpa(alunosFiltrados);
        let alunosParaClipboardTmp = '';
        alunosParaClipboard = listaLimpa(listaNomesCompletos);
        M(alunosParaClipboard);
        
        alunosParaClipboard.split('\n').forEach((e)=>{alunosParaClipboardTmp += e.split(',')[1]+'\n';});
        alunosParaClipboard = alunosParaClipboardTmp;
        M(alunosParaClipboard);

        for (let nota = 100; nota > 0; nota--) {
            for (let alunos = 0; alunos < lista2Alunos.length; alunos++) {
                let colunas = lista2Alunos[alunos].split(';')
                if (colunas[2] == nota) {
                    novo == true && (id++, (novo = false));
                    novasLinhas.push(id + ',' + lista2Alunos[alunos].trim().replace(/;/g, ','));
                    continue;
                }
            }
            novo = true
        }
        sala.innerText = novasLinhas[0].split(',')[2]
        classificacao(novasLinhas)
    }
    ler.onerror = function () {
        console.error('Erro ao ler o arquivo')
    }
    ler.readAsText(arquivo, 'UTF-8')
    abrir.value = ''
})

function classificacao(lista) {
    document.querySelectorAll("#classificar > div").forEach((el) => { el.remove(); });
    const classf = document.getElementById("classificar");
    classf.style.gap = `${(10 / quantidadeColunas)}vw`;
    let divClassf = imgClassf = p1Classf = p2Classf = imgUrl = null, alturaCalc = 0, diferencaAltura = 10;
    for (let i = 0; i < quantidadeColunas; i++) {
        divClassf = document.createElement("div");
        divClassf.id = "c" + (i + 1);
        diferencaAltura = alturaCalc < 60 ? 4 : diferencaAltura;
        alturaCalc = 100 - (i * diferencaAltura);
        divClassf.style.cssText = `height: ${alturaCalc}%; width: ${100 / quantidadeColunas}%;`;
        imgClassf = document.createElement("img");
        imgClassf.className = "sombraImg";
        imgClassf.id = "img" + i + 1;
        imgClassf.style.height = "5vh";
        imgClassf.style.width = "auto";
        p1Classf = document.createElement("p");
        p1Classf.style.cssText = "color: #FFF; border-bottom: 2px solid; padding-bottom: 8px; margin-bottom: 4px;";
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
                if (parseInt(p2Classf.innerHTML.split("<br><br>").length) <= parseInt(nAlunos.value)) {
                    p2Classf.innerHTML += lista[j].split(',')[1] + "</br></br>";
                    p1Classf.innerText = lista[j].split(',')[3] + "%";
                }
            }
        }

        divClassf.appendChild(imgClassf);
        divClassf.appendChild(p1Classf);
        divClassf.appendChild(p2Classf);
        classf.appendChild(divClassf);
    }
    document.getElementById("classificar").style.display = "flex";
    let novasDivs = document.querySelectorAll("#classificar > div"), idMeio = 0, nPar = false;
    for (let i = 0; i < quantidadeColunas; i++) {
        if (i == 0) { novasDivs[i].style.order = idMeio; } else {
            if (nPar) {
                novasDivs[i].style.order = idMeio + i;
                nPar = !nPar;
            } else {
                novasDivs[i].style.order = idMeio - i;
                nPar = !nPar;
            }
        }
    }
    document.getElementById("opcoes").reset();
    document.getElementById('rank').scrollIntoView()
}
function Inicio() {
    setTimeout(() => {
        history.replaceState(
            '',
            document.title,
            window.location.origin + window.location.pathname + window.location.search
        )
    }, 5)
}
function creditosVisiveis(elem, visivel) {
    if (visivel) {
        document.querySelector(elem).style.display = "flex";
    } else { document.querySelector(elem).style.display = "none"; }
}
async function Fotos() {
    const canvas = await html2canvas(document.querySelector("#rank")).then(canvas => {
        const img = canvas.toDataURL();
        let a = document.createElement("a");
        a.style = "display: none"; document.body.appendChild(a);
        a.href = img;
        a.download = `${sala.innerText} - ${prof.innerText} - Semana ${nSemana.value}.png`;
        a.click();
        a.remove();
    });
}
function Versao(b) {
    const ver = document.getElementById('versionador');
    if (b) {
        funVersionador(document.querySelector('#versoes > button:nth-child(1)'), false, 'v10'),
            ver.showModal()
    } else { ver.close(); }
}
function funVersionador(event, b, el) {
    let id, abaConteudo, abaLinks;
    abaConteudo = document.getElementsByClassName('tabcontent')
    for (id = 0; id < abaConteudo.length; id++) {
        abaConteudo[id].style.display = 'none'
    }
    abaLinks = document.getElementsByClassName('tablinks')
    for (id = 0; id < abaLinks.length; id++) {
        abaLinks[id].className = abaLinks[id].className.replace(' active', '')
    }
    document.getElementById(el).style.display = 'block';
    if (b) { event.currentTarget.className += ' active'; } else { event.className += ' active'; }
}
function areaTransferencia(texto, b) {
    let txt = b==true?alunosParaClipboard:texto;
    navigator.clipboard.writeText(txt);
}
function formatacaoCaixa(texto, b) {
    let nome = '';
    texto.split(' ').forEach((el) => { nome += el.charAt(0).toUpperCase() + el.substring(1).toLowerCase() + ' '; })
    texto = nome.trim();
    if (b) { return texto; } else {
        if (preposicoes.some(p => p == texto.split(' ')[1].toLowerCase())) { texto = texto.split(' ')[0] + " " + texto.split(' ')[2]; } else { texto = texto.split(' ')[0] + " " + texto.split(' ')[1]; }
    }
    return texto;
}
function validarCampos() {
    const err = [nColunas.value < 1, nColunas.value > 15, nSemana.value < 1, nSemana.value > 53, nAlunos.value < 1, txProf.value.length < 1];
    let bolErr = false;
    err.forEach((e) => { if (e == true) { bolErr = true; } });
    if (!bolErr) { return false; }
    document.getElementById("erro").showModal();
    abrir.value = '';
    document.getElementById('opcoes').reset();
    return true;
}
function filtragem() {
    let lista70 = '', l = alunosFiltrados.split('\n'), contador = 0, t = '';
    l.forEach((e) => {
        t = e.split(';');
        if (parseInt(t[2]) < 70) {
            if (contador < 1) { lista70 = 'Alunos com menos de 70%\n\n\nNome: ' + t[0] + '\nEmail: ' + t[1] + '\nNota: ' + t[2] + '%\n'; } else { lista70 += 'Nome: ' + t[0] + '\nEmail: ' + t[1] + '\nNota: ' + t[2] + '%\n'; }
            if (contador < l.length - 1) { lista70 += '\n'; }
            contador++;
        }
    });
    areaTransferencia(lista70,false);
}
function listaLimpa(lista) {
    let listaTmp = '', listaSeparada = '', contador = 0;

    lista.split('\n').sort().forEach((e) => {
        if (e.length > 1) {
            if (lista.indexOf('\n') < 0) {
                listaTmp = e + "\n";
            } else {
                listaTmp += e + "\n";
            }
        }
    });
    
    listaSeparada = listaTmp.split('\n');
    listaTmp = '';
    lista = listaSeparada;
    if (listaSeparada[listaSeparada.length - 1].length < 1) {
        lista = listaSeparada.splice(0, listaSeparada.length - 2);
    } else
        if (listaSeparada[0].length < 1) {
            lista = listaSeparada.splice(1, listaSeparada.length - 1);
        }
    lista.forEach((ex) => { contador++; if(listaTmp.length<1){listaTmp = ex;}else{listaTmp += ex;} if (contador < lista.length) { listaTmp += "\n"; } });
    return listaTmp;
}
function M(a) {
    console.log(a);
}

document.getElementById('telaInicial').scrollIntoView();