const inicioTitulo = document.getElementById('texTitulo'), inicioSubtitulo = document.getElementById('textSubtitulo'), inicioProfessor = document.getElementById('texProfessor'), inicioSemana = document.getElementById('numSemana'), inicioColunas = document.getElementById('numColunas'), inicioAlunos = document.getElementById('numAlunos'),
    rankTitulo = document.getElementById('stitulo'), rankSubtitulo = document.getElementById('ssubtitulo'), rankProfessor = document.getElementById('sprof'), rankSala = document.getElementById('salas'),
    preposicoes = ["da", "das", "de", "di", "do", "dos"],
    abrir = document.getElementById('abrirArquivo'),
    alunosOrdemAZ = document.querySelector('#listOrd > p');
let alunosParaClipboard = '', alunosFiltrados = '', listaFiltrados = '', quantidadeColunas = 0, semanas = '', listaFiltradosEmails = '', listaOrdenada = [], filtroAZ = false;
abrir.addEventListener('change', (event) => {
    listaOrdenada = [];
    if (validarCampos()) { return; }
    quantidadeColunas = parseInt(inicioColunas.value);
    rankTitulo.innerText = inicioTitulo.value;
    if (inicioSemana.value > 0) {
        if (inicioSemana.value.length > 0) { semanas = ' da semana '; } else { semanas = 'Semana '; }
        semanas += inicioSemana.value;
    }
    rankSubtitulo.innerText = inicioSubtitulo.value + semanas;
    rankProfessor.innerText = inicioProfessor.value;
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
            listaNomesCompletos += porcetagem.split(',')[0].replace(/"/g, '') + "%\n";
            alunosFiltrados += porcetagem.split(',')[0].replace(/"/g, '') + "%\n";
        } else {
            listaAlunos += porcetagem.replace(/"/g, '') + "\n";
            listaNomesCompletos += porcetagem.replace(/"/g, '') + "%\n";
            alunosFiltrados += porcetagem.replace(/"/g, '') + "%\n";
        }
        for (let i = 3; i < linhas.length - 2; i++) {
            listaJaFiltrada = linhas[i].replace(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g, '; ').split('; ');
            separandoNomeParaOrganizar = listaJaFiltrada[0].replace(/"/g, '').split(',');
            listaAlunos += formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), false) + ';' + listaJaFiltrada[linhas[0].split(',').indexOf('Section')] + ';';
            porcetagem = listaJaFiltrada[linhas[0].split(',').indexOf('Current Score')];
            listaNomesCompletos += formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), true) + ',';

            xmai1 = listaJaFiltrada[linhas[0].split(',').indexOf('SIS Login ID')];
            alunosFiltrados += formatacaoCaixa(separandoNomeParaOrganizar[1].trim() + ' ' + separandoNomeParaOrganizar[0].trim(), true) + ';' + (xmai1.length > 2 ? xmai1 : '--Nenhum registrado--') + ';';
            if (!(porcetagem.indexOf(",") < -1)) {
                listaAlunos += porcetagem.split(',')[0].replace(/"/g, '') + "\n"; listaNomesCompletos += porcetagem.split(',')[0].replace(/"/g, '') + "%\n"; alunosFiltrados += porcetagem.split(',')[0].replace(/"/g, '') + "\n";
            } else {
                listaAlunos += porcetagem.replace(/"/g, '') + "\n"; listaNomesCompletos += porcetagem.replace(/"/g, '') + "%\n"; alunosFiltrados += porcetagem.replace(/"/g, '') + "%\n";
            }
        }
        let novo = true, id = 0, lista2Alunos = listaAlunos.split('\n'), contador = 0;
        lista2Alunos = lista2Alunos.splice(0, lista2Alunos.length - 1);
        alunosParaClipboard = listaLimpa(listaNomesCompletos);
        alunosFiltrados = listaLimpa(alunosFiltrados);
        document.querySelector('#listOrd > p').innerText = alunosParaClipboard;

        for (let nota = 100; nota > 0; nota--) {
            for (let alunos = 0; alunos < lista2Alunos.length; alunos++) {
                let colunas = lista2Alunos[alunos].split(';'), linhaTemporaria = '';
                if (colunas[2] == nota) {
                    novo == true && (id++, (novo = false));
                    linhaTemporaria = lista2Alunos[alunos].trim().replace(/;/g, ',')
                    listaOrdenada.push(linhaTemporaria.split(',')[0] + ',' + linhaTemporaria.split(',')[2] + '%')
                    novasLinhas.push(id + ',' + linhaTemporaria);
                    continue;
                }
            }
            novo = true
        }
        listaOrdenada.forEach(e => { if (contador == 0) { linhaTemporaria = e + '\n'; contador++ } else { linhaTemporaria += e + '\n'; } });
        rankSala.innerText = novasLinhas[0].split(',')[2]
        classificacao(novasLinhas)
        listaOrdenada = linhaTemporaria;
        abrir.value = ''

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
    classf.style.gap = `${(2 / quantidadeColunas)}vw`;
    let divClassf = imgClassf = p1Classf = p2Classf = imgUrl = null, alturaCalc = 0, diferencaAltura = 10;
    for (let i = 0; i < quantidadeColunas; i++) {
        divClassf = document.createElement("div");
        divClassf.id = "c" + (i + 1);
        diferencaAltura = alturaCalc < 60 ? 4 : diferencaAltura;
        alturaCalc = 100 - (i * diferencaAltura);
        divClassf.style.cssText = `height: ${alturaCalc}%; width: 100%;`;
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
                if (parseInt(p2Classf.innerHTML.split("<br><br>").length) <= parseInt(inicioAlunos.value)) {
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
    setTimeout(() => { document.getElementById('telaInicial').style.display = 'none'; }, "1000");
    document.getElementById('rank').style.display = 'flex';
    document.getElementById('rank').scrollIntoView()
}
function Inicio() {
    document.getElementById('telaInicial').style.display = 'flex';
    setTimeout(() => { history.replaceState('', document.title, window.location.origin + window.location.pathname + window.location.search) }, 5)
    setTimeout(() => { document.getElementById('rank').style.display = 'none'; }, "1000");
}
function creditosVisiveis(elem, visivel) {
    if (visivel) {
        document.querySelector(elem).style.display = "flex";
    } else { document.querySelector(elem).style.display = "none"; }
}
async function Fotos() {
    const canvas = await html2canvas(document.getElementById('rank')).then(canvas => {
        let fotoDownload = document.createElement("a");
        fotoDownload.style = "display: none";
        const foto = canvas.toDataURL(), fotosSemana = '';
        if (inicioSemana.value == '0') { fotosSemana = `- Semana ${semanas}`; }
        fotoDownload.href = foto;
        fotoDownload.download = `${rankSala.innerText} - ${rankProfessor.innerText}${fotosSemana}.png`;
        document.body.appendChild(fotoDownload);
        fotoDownload.click();
        fotoDownload.remove();
    });
}
function Abas(elementoDialog, menu, botao) {
    const dlg = document.getElementById(elementoDialog);
    document.getElementById(menu).querySelectorAll('button')[botao].click();
    dlg.showModal();
}
function Aba(aba, janelaAtiva, elementoDialog, menu, esteElemento) {
    let id, abaLinks = document.querySelectorAll(menu + '> button'), abaConteudo = document.querySelectorAll(elementoDialog + '> .abaConteudo');
    for (id = 0; id < abaLinks.length; id++) { abaLinks[id].className = abaLinks[id].className.replace(' active', ''); }
    if (esteElemento) { aba.currentTarget.className += ' active'; } else { aba.className += ' active'; }
    for (id = 0; id < abaConteudo.length; id++) {
        abaConteudo[id].style.display = 'none';
    }
    document.getElementById(janelaAtiva).style.display = 'block';
}
function areaTransferencia(texto, opcao) {
    let textoACopiar = texto;
    switch (opcao) {
        case 'alunosFiltrados': filtragem(false); if (listaFiltrados.length > 0) { textoACopiar = listaFiltrados; } break;
        case 'alunosTodos': if(alunosOrdemAZ.innerText.length>0){textoACopiar = alunosOrdemAZ.innerText; }; break;
        default: if (textoACopiar.length < 1) { return };
    }
    if(textoACopiar.length>0){navigator.clipboard.writeText(textoACopiar);}
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
    const err = [inicioColunas.value < 1, inicioColunas.value > 15, inicioSemana.value < 0, inicioSemana.value > 53, inicioAlunos.value < 1, inicioProfessor.value.length < 1];
    let bolErr = false;
    err.forEach(e => { if (e == true) { bolErr = true; } });
    if (!bolErr) { return false; }
    document.getElementById("erro").showModal();
    abrir.value = '';
    document.getElementById('opcoes').reset();
    return true;
}
function filtragem(exibir) {
    if (exibir) { document.getElementById('div2Filtrados').style.display = 'none'; }
    let l = alunosFiltrados.split('\n'), primeiro = true, t = '';
    listaFiltrados = '';
    const p = document.querySelector('#div1Filtrados > p'), valor = document.getElementById('alunosFiltrados').value;
    if (exibir) { p.innerHTML = ""; }
    l.forEach((e) => {
        t = e.split(';');
        if (parseInt(t[2]) < valor) {
            if (primeiro) {
                listaFiltradosEmails = t[1] + '\n';
                listaFiltrados = `Alunos com menos de ${valor}%\n\n\nNome: ${t[0]}\nEmail: ${t[1]}\nNota: ${t[2]}%\n`;
                if (exibir) { p.innerHTML = `Nome: ${t[0]}</br>Email: <span id="spanEmail" onclick="emailG('${t[1]}',false)">${t[1]}</span></br>Nota: ${t[2]}%</br></br>`; }
                primeiro = false;
            } else {
                listaFiltradosEmails += t[1] + '\n';
                listaFiltrados += `Nome: ${t[0]}\nEmail: ${t[1]}\nNota: ${t[2]}%\n\n`;
                if (exibir) { p.innerHTML += `Nome: ${t[0]}</br>Email: <span id="spanEmail" onclick="emailG('${t[1]}',false)">${t[1]}</span></br>Nota: ${t[2]}%</br></br>`; }
            }
        }
    });
    listaFiltradosEmails = listaFiltradosEmails.split('\n').join(',');
    listaFiltradosEmails = listaFiltradosEmails.substring(0, listaFiltradosEmails.length - 1);
}
function listaLimpa(lista) {
    let l = lista.split('\n').sort(), r = [];
    l.forEach(e => { if (e.length > 1) { r.push(e) }; });
    return r.join('\n');
}
function emailG(email, maisDeUm) {
    if (maisDeUm == null) { document.querySelectorAll('.emailValores').forEach(valores => { valores.value = ''; }); return; };
    if (!maisDeUm) {
        emailPadrao(email);
    }
    let tipo = "to", instituicao = document.getElementById('emailInstituicao').value,
        assinatura = document.getElementById('emailAssinatura').value,
        mensagem = document.getElementById('emailMensagem').value,
        titulo = document.getElementById('emailTitulo').value,
        para = document.getElementById('emailPara').value;
    mensagem = mensagem.replace(/%/g, '%25').replace(/\n/g, '%0D%0A');
    mensagem += `%0D%0A%0D%0A${assinatura}%0D%0A%0D%0A${instituicao}%0D%0A`;
    if (maisDeUm) { tipo = 'bcc'; }
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&${tipo}=${para}&su=${titulo}&body=${mensagem}`, "_blank");
    emailG(null, null);
}
function emailDiv() {
    emailPadrao('');
    const divEmail = document.getElementById('div2Filtrados');
    document.querySelector('#div1Filtrados > p').innerText = '';
    divEmail.style.display = divEmail.style.display == 'flex' ? 'none' : 'flex';
}
function emailPadrao(paraUm) {
    filtragem(false);
    let titulo = 'Alerta de baixo desempenho!',
        mensagem = `Caro aluno(a),

Espero que esta mensagem o encontre bem. Gostaria de conversar um pouco sobre seu desempenho acadêmico recente. Tenho notado que sua nota atual está abaixo do esperado, e é importante abordarmos isso juntos.

Manter uma média mínima (${document.getElementById('alunosFiltrados').value}%) é crucial não apenas para os requisitos do curso, mas também para garantir que você esteja aproveitando ao máximo sua experiência educacional. Sei que você tem potencial e estou aqui para apoiá-lo em sua jornada de aprendizado.

Entendo que enfrentar dificuldades é parte do processo de aprendizado, e quero garantir que você saiba que não está sozinho nessa jornada. Estou disposto a ajudá-lo de qualquer maneira que puder. Além disso, lembre-se de que as avaliações podem ser feitas quantas vezes forem necessárias até alcançar a nota desejada.

Se precisar de assistência adicional, como aulas de reforço, orientação individualizada ou simplesmente alguém para conversar sobre suas dificuldades, estou aqui para ajudar a encontrar soluções.

Lembre-se de que cada desafio é uma oportunidade de crescimento e desenvolvimento. Estou confiante de que, com dedicação e esforço, você pode superar essas dificuldades e alcançar seus objetivos acadêmicos.

Por favor, não hesite em entrar em contato comigo para discutir quaisquer preocupações ou para agendar uma reunião pessoalmente. Estou aqui para ajudá-lo a ter sucesso.

Atenciosamente`,
        assinatura = rankProfessor.innerText,
        instituicao = 'AWS re/Start Accredited Instructor',
        para = paraUm.length > 0 ? paraUm : listaFiltradosEmails;
    document.getElementById('emailInstituicao').value = instituicao;
    document.getElementById('emailAssinatura').value = assinatura;
    document.getElementById('emailMensagem').value = mensagem;
    document.getElementById('emailTitulo').value = titulo;
    document.getElementById('emailPara').value = para;
}
function filtrar() {
    let filtroOrdemAZ = document.getElementById('filtroOrdemAZ');
    if (alunosOrdemAZ.innerText.length > 0) {
        if (filtroAZ) {
            alunosOrdemAZ.innerText = alunosParaClipboard;
            filtroOrdemAZ.style.backgroundImage = ("url('./src/filtroAZ.png')");
        } else {
            alunosOrdemAZ.innerText = listaOrdenada;
            filtroOrdemAZ.style.backgroundImage = ("url('./src/filtroPorcentagem.png')");
        }
        filtroAZ = !filtroAZ;
    }
}
function M(mensagem) {
    console.log(mensagem);
}
document.getElementById('alunosFiltrados').addEventListener('keypress', e => { if (e.key == "Enter") { filtragem(true); } });
document.getElementById('telaInicial').scrollIntoView();