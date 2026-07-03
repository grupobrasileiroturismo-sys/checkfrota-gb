// =============================================
// CHECKLIST.JS
// =============================================


// =============================================
// ESTRUTURA DO CHECKLIST
// =============================================

const CHECKLIST = {

    documentação: [

        "CRLV",
        "Certificado de Vistoria",
        "Documento ANTT",
        "Cronotacógrafo"

    ],

    mecânica: [

        "Pneus",
        "Freios",
        "Faróis",
        "Limpadores",
        "Ar-condicionado"

    ],

    segurança: [

        "Extintor",
        "Cinto de Segurança",
        "Triângulo",
        "Martelo de emergência"

    ],

    limpeza: [

        "Limpeza Interna",
        "Limpeza Externa"

    ],

    conforto: [

        "Água Mineral"

    ]

};


// =============================================
// RESPOSTAS (GLOBAL PARA PDF / BACKEND)
// =============================================

window.respostas = {};


// =============================================
// CRIAR CHECKLIST NA TELA
// =============================================

function criarChecklist(){

    Object.keys(CHECKLIST).forEach(secao => {

        const container = document.getElementById(secao);

        if (!container) return;

        // 🔥 título da categoria
        const titulo = document.createElement("h3");
        titulo.className = "section-title";
        titulo.innerText = secao.toUpperCase();

        container.appendChild(titulo);

        CHECKLIST[secao].forEach(item => {

            container.appendChild(criarItem(item));

        });

    });

}


// =============================================
// CRIAR ITEM INDIVIDUAL
// =============================================

function criarItem(nome){

    window.respostas[nome] = ""; // inicializa resposta

    const div = document.createElement("div");

    div.className = "check-item";

    div.innerHTML = `

        <div class="item-title">
            ${nome}
        </div>

        <div class="status">

            <button class="success" data-status="Conforme">
                🟢 Conforme
            </button>

            <button class="danger" data-status="Não Conforme">
                🔴 Não Conforme
            </button>

            <button class="na" data-status="Não se aplica">
                ⚪ Não se aplica
            </button>

        </div>

    `;

    const botoes = div.querySelectorAll("button");

    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            // remove seleção anterior
            botoes.forEach(b => b.classList.remove("active"));

            // marca atual
            botao.classList.add("active");

            // salva resposta global (IMPORTANTE PARA PDF)
            window.respostas[nome] = botao.dataset.status;

            atualizarProgresso();

        });

    });

    return div;

}


// =============================================
// PROGRESSO DO CHECKLIST
// =============================================

function atualizarProgresso(){

    const total = document.querySelectorAll(".status").length;

    const respondidos = document.querySelectorAll(".status .active").length;

    const percentual = Math.round((respondidos / total) * 100);

    const barra = document.getElementById("progressBar");
    const texto = document.getElementById("percentual");
    const contador = document.getElementById("contadorItens");

    if (barra) barra.style.width = percentual + "%";
    if (texto) texto.textContent = percentual + "%";
    if (contador) contador.textContent = `${respondidos} de ${total} itens respondidos`;

}