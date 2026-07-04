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

            enviarFormulario();

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

//======================================
// ENVIA O FORMULÁRIO
//======================================

async function enviarFormulario(){

    try{

        const dados = coletarDadosFormulario();

        const resposta = await enviarInspecao(dados);

        if(resposta.sucesso){

            alert(
                "Relatório gerado com sucesso!\n\nNúmero: " +
                resposta.numero
            );

        }else{

            alert(
                "Erro:\n" +
                resposta.erro
            );

        }

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao enviar a inspeção.");

    }

}

//======================================
// COLETA TODOS OS DADOS
//======================================

function coletarDadosFormulario(){

    return{

        empresa:document.getElementById("empresa")?.value || "",

        motorista:document.getElementById("motorista")?.value || "",

        prefixo:document.getElementById("prefixo")?.value || "",

        placa:document.getElementById("placa")?.value || "",

        data:document.getElementById("data")?.value || "",

        hora:document.getElementById("hora")?.value || "",

        checklist:obterChecklist()

    };

}