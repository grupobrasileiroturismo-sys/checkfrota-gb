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