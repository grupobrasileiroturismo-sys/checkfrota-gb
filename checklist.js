// =============================================
// CHECKLIST.JS
// =============================================


// =============================================
// ESTRUTURA DO CHECKLIST
// =============================================

const CHECKLIST = {

    Documentação: [

        "CRLV",
        "Certificado de Vistoria",
        "Documento ANTT",
        "Cronotacógrafo"

    ],

    Mecânica: [

        "Pneus",
        "Freios",
        "Faróis",
        "Limpadores",

    ],

    Segurança: [

        "Extintor",
        "Cinto de Segurança",
        "Triângulo",
        "Martelo de emergência"

    ],

    Limpeza: [

        "Limpeza Interna",
        "Limpeza Externa"

    ],

    "Serviço de Bordo": [

        "Água Mineral",
        "Ar-condicionado",
        "Mantas",
        "Cortinas privacidade",
        "Encosto para as pernas",
        "W.C",
        "Internet",
        "Audio Visual (TV, DVD, SOM)",
        "Microfones",
        "USB (por poltrona)"
        

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

        // 🔥 CRIA CARD DA CATEGORIA
        const card = document.createElement("div");
        card.className = "category-card";

        // título da categoria
        const titulo = document.createElement("div");
        titulo.className = "category-title";
        const icones = {

    Documentação: "bi-file-earmark-text-fill",

    Mecânica: "bi-gear-fill",

    Segurança: "bi-shield-check",

    Limpeza: "bi-droplet-fill",

    "Serviço de Bordo": "bi-stars"

};

titulo.innerHTML = `
    <i class="bi ${icones[secao]}"></i>
    ${secao.toUpperCase()}
`;

        card.appendChild(titulo);

        // itens da categoria
        CHECKLIST[secao].forEach(item => {
            card.appendChild(criarItem(item));
        });

        // adiciona o card dentro do container da seção
        container.appendChild(card);

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

// =============================================
// OBTÉM O CHECKLIST PREENCHIDO
// =============================================

function obterChecklist(){

    const checklist = {};

    Object.keys(CHECKLIST).forEach(categoria => {

        checklist[categoria] = [];

        CHECKLIST[categoria].forEach(item => {

            let status = "na";

            switch(window.respostas[item]){

                case "Conforme":
                    status = "ok";
                    break;

                case "Não Conforme":
                    status = "nok";
                    break;

                case "Não se aplica":
                    status = "na";
                    break;

            }

            checklist[categoria].push({

                nome: item,

                status: status

            });

        });

    });

    return checklist;

}