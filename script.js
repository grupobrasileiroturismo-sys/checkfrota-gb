// =============================================
// SCRIPT.JS
// INICIALIZAÇÃO DO SISTEMA
// =============================================

window.addEventListener("DOMContentLoaded", () => {

    inicializarAplicacao();

});


// =============================================
// INICIALIZAÇÃO GERAL
// =============================================

function inicializarAplicacao() {

    // Inicializa data e hora (se existir no projeto)
    iniciarDataHora();

    // Inicializa checklist
    if (typeof criarChecklist === "function") {
        criarChecklist();
    }

    // Inicializa fotos
    if (typeof criarFotos === "function") {
        criarFotos();
    }

    // Eventos globais
    configurarEventosGlobais();

}


// =============================================
// EVENTOS GLOBAIS
// =============================================

function configurarEventosGlobais() {

    const btnFinalizar = document.getElementById("btnFinalizar");

    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {

            if (typeof gerarPDF === "function") {
                gerarPDF();
            }

        });
    }

}


// =============================================
// DATA E HORA (SE USAR NO PROJETO)
// =============================================

function iniciarDataHora() {

    const dataEl = document.getElementById("data");
    const horaEl = document.getElementById("hora");

    if (!dataEl || !horaEl) return;

    const agora = new Date();

    const dataFormatada = agora.toISOString().split("T")[0]; // YYYY-MM-DD

    const horaFormatada = agora.toTimeString().slice(0,5); // HH:MM

    dataEl.value = dataFormatada;
    horaEl.value = horaFormatada;

}

const URL_WEBAPP = "https://script.google.com/macros/s/AKfycbzj-9KoUraWgy5ttt0lQHSi3YeIeu3JONb9vVWX2O9Q8MjeEAr3DYCD1GKcIqe9KbmS/exec";

async function testarServidor() {

    try {

        const resposta = await fetch(URL_WEBAPP, {

            method: "POST",

            body: JSON.stringify({

                teste: true

            })

        });

        const texto = await resposta.text();

        console.log(texto);

        alert(texto);

    }

    catch (erro) {

        console.error(erro);

    }

}