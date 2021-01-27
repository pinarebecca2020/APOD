window.onload = function() {
    let today = new Date();

    let inputFutureDays = document.querySelector("#inputDate")
    inputFutureDays.setAttribute("max", formataData(today));

    mudaDataInput(today);

    habilitaDesabilitaSeguinte(today);

    geraApi();
}

class container {
    constructor(title, image, text) {
        this.title = title;
        this._image = image;
        this._text = text;
    }
    geraDiv() {
        let divTitle = document.querySelector("#title");

        let title = document.createElement("p");
        title.setAttribute("class", "title");
        title.textContent = `${this.title}`;
        divTitle.appendChild(title);

        let divImg = document.querySelector("#img");

        let image = document.createElement("img");
        image.setAttribute("class", "img");
        image.src = this._image;
        divImg.appendChild(image);

        let text = document.createElement("p");
        text.setAttribute("class", "text")
        text.textContent = `${this._text}`;
        divImg.appendChild(text);

    }
}

function mudaDataInput(date) {
    document.querySelector("#inputDate").value = formataData(date);
}

function pegaDataSelecionada() {
    let inputDate = document.querySelector("#inputDate");

    return inputDate.value;
}

function formataData(date) { //formata a data para que permaneça apenas como YYYY-MM-DD
    return date.toISOString().substr(0, 10);
}

let geraClick = function() { //é chamada no clicar do botão Generate
    geraApi();
    habilitaDesabilitaSeguinte();
    habilitaDesabilitaAnterior();
}

let btnGera = document.querySelector("#refresh");
btnGera.addEventListener("click", geraClick);

function geraApi() {
    limpaDiv();
    clearError();

    let request = new XMLHttpRequest();

    let date = pegaDataSelecionada();

    let requestUrl = `https://api.nasa.gov/planetary/apod?api_key=zhTva976t7FO16TGjpw0asHHH0DdpKYlbTRCoqng&date=${date}`;

    request.open("GET", requestUrl);

    request.addEventListener("load", function() {
        if (request.status == 200) {
            let response = JSON.parse(request.responseText);

            let divImage = new container(response.title, response.url, response.explanation);
            divImage.geraDiv();

        } else {
            let error = document.createElement("p");
            error = "Ocorreu um erro, tente outra data!"

            let spanError = document.querySelector("#error");
            spanError.innerHTML = "";
            spanError.append(error);
        }
    })

    request.send();
}

let btnAnterior = document.querySelector("#anterior");
btnAnterior.addEventListener("click", function() {

    mudaDataAntesOuDepois(-1); //faz voltar a data
    habilitaDesabilitaSeguinte();
    habilitaDesabilitaAnterior();
})

let btnSeguinte = document.querySelector("#seguinte");
btnSeguinte.addEventListener("click", function() {
    mudaDataAntesOuDepois(1);
    habilitaDesabilitaSeguinte();
    habilitaDesabilitaAnterior();
})

function mudaDataAntesOuDepois(number) {
    let dataSelecionada = new Date(pegaDataSelecionada());
    dataSelecionada.setDate(dataSelecionada.getDate() + number);
    mudaDataInput(dataSelecionada);
    geraApi();
}

function habilitaDesabilitaSeguinte() {
    let btnSeguinte = document.querySelector("#seguinte");

    if (pegaDataSelecionada() == formataData(new Date())) {
        btnSeguinte.disabled = true;
    } else {
        btnSeguinte.disabled = false;
    }
}

function habilitaDesabilitaAnterior() {
    let btnAnterior = document.querySelector("#anterior");

    if (pegaDataSelecionada() == "1995-06-16") {
        btnAnterior.disabled = true;
    } else {
        btnAnterior.disabled = false;
    }
}

function limpaDiv() {
    document.querySelector("#title").innerHTML = "";
    document.querySelector("#img").innerHTML = "";
}

function clearError() {
    let spanError = document.querySelector("#error");
    spanError.innerHTML = "";
}