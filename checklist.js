// =============================================
// CHECKLIST.JS
// =============================================

// =============================================
// RESPOSTAS DA INSPEÇÃO
// =============================================

const respostas = {};
const CHECKLIST = {

    documentacao: [

        "CRLV",
        "Certificado de Vistoria",
        "Documento ANTT",
        "Cronotacógrafo"

    ],

    mecanica: [

        "Pneus",
        "Freios",
        "Faróis",
        "Limpadores",
        "Ar-condicionado"

    ],

    seguranca: [

        "Extintor",
        "Triângulo",
        "Cinto de Segurança",
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


// ================================
// CRIA O CHECKLIST
// ================================

function criarChecklist(){

    Object.keys(CHECKLIST).forEach(secao=>{

        const container=document.getElementById(secao);

        CHECKLIST[secao].forEach(item=>{

            container.appendChild(

                criarItem(item)

            );

        });

    });

}


// ================================
// CRIA UM ITEM
// ================================

function criarItem(nome){

    respostas[nome] = "";

    const div = document.createElement("div");

    div.className = "check-item";

    div.innerHTML = `

        <div class="item-title">

            ${nome}

        </div>

        <div class="status">

            <button
                class="success"
                data-status="Conforme">

                🟢 Conforme

            </button>

            <button
                class="danger"
                data-status="Não Conforme">

                🔴 Não Conforme

            </button>

            <button
                class="na"
                data-status="Não se aplica">

                ⚪ Não se aplica

            </button>

        </div>

    `;

    const botoes = div.querySelectorAll("button");

    botoes.forEach(botao=>{

        botao.addEventListener("click",()=>{

            botoes.forEach(b=>b.classList.remove("active"));

            botao.classList.add("active");

            respostas[nome] = botao.dataset.status;

            atualizarProgresso();

        });

    });

    return div;

}

// ================================
// PROGRESSO
// ================================

function atualizarProgresso(){

    const total=document.querySelectorAll(".status").length;

    const respondidos=document.querySelectorAll(".status .active").length;

    const percentual=Math.round((respondidos/total)*100);

    document.getElementById("progressBar").style.width=

        percentual+"%";

    document.getElementById("percentual").textContent=

        percentual+"%";

    document.getElementById("contadorItens").textContent=

        `${respondidos} de ${total} itens respondidos`;

}