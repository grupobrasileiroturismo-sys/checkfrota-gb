// =====================================
// CHECKFROTA GB
// SCRIPT.JS
// =====================================

// ---------- Data e Hora ----------

function atualizarDataHora() {

    const agora = new Date();

    document.getElementById("data").value =
        agora.toLocaleDateString("pt-BR");

    document.getElementById("hora").value =
        agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });

}

setInterval(atualizarDataHora, 1000);
atualizarDataHora();


// ---------- Estrutura do Checklist ----------

const checklist = {

    documentacao: [

        "CRLV",
        "Certificado de Vistoria",
        "Documento ANTT",
        "Documento Cronotacógrafo"

    ],

    mecanica: [

        "Pneus",
        "Freios",
        "Faróis",
        "Limpadores",
        "Motor",
        "Ar-condicionado",
        "Nível do óleo",
        "Água do radiador"

    ],

    seguranca: [

        "Extintor",
        "Triângulo",
        "Macaco",
        "Chave de roda"

    ],

    limpeza: [

        "Limpeza Interna",
        "Limpeza Externa"

    ],

    conforto: [

        "Água Mineral"

    ]

};


// ---------- Gerar Itens ----------

Object.keys(checklist).forEach(secao => {

    const container =
        document.getElementById(secao);

    checklist[secao].forEach(item => {

        container.appendChild(
            criarItem(item)
        );

    });

});


// ---------- Criar Item ----------

function criarItem(nome){

    const item=document.createElement("div");

    item.className="check-item";

    item.innerHTML=`

        <div class="item-title">

            ${nome}

        </div>

        <div class="status">

            <button class="success">

                🟢 Conforme

            </button>

            <button class="danger">

                🔴 Não Conforme

            </button>

            <button class="na">

                ⚪ Não se aplica

            </button>

        </div>

    `;

    const botoes=item.querySelectorAll("button");

    botoes.forEach(botao=>{

        botao.addEventListener("click",()=>{

            botoes.forEach(b=>b.classList.remove("active"));

            botao.classList.add("active");

            atualizarProgresso();

        });

    });

    return item;

}

// ---------- Barra ----------

function atualizarProgresso(){

    const total=document.querySelectorAll(".status").length;

    const respondidos=document.querySelectorAll(".status .active").length;

    const percentual=Math.round((respondidos/total)*100);

    document.getElementById("progressBar").style.width=percentual+"%";

    document.getElementById("percentual").textContent=percentual+"%";

    document.getElementById("contadorItens").textContent=
        `${respondidos} de ${total} itens respondidos`;

}