// =============================================
// PHOTOS.JS
// Controle de Fotos da Inspeção
// =============================================

// Fotos da inspeção
const FOTOS = [
    {
        id: "frontal",
        titulo: "Foto Frontal do Veículo",
        obrigatoria: true
    },
    {
        id: "limpeza",
        titulo: "Foto da Limpeza",
        obrigatoria: true
    },
    {
        id: "extintor",
        titulo: "Foto do Extintor",
        obrigatoria: true
    },
    {
        id: "avaria",
        titulo: "Avaria (Se houver)",
        obrigatoria: false
    }
];

// Armazena as imagens em Base64
const imagens = {};

// =============================
// CRIA OS CARDS
// =============================

function criarFotos() {

    const container = document.getElementById("photoContainer");

    container.innerHTML = "";

    FOTOS.forEach(foto => {

        imagens[foto.id] = null;

        const card = document.createElement("div");

        card.className = "photo-item";

        card.innerHTML = `

            <div class="photo-title">

                ${foto.titulo}

                ${foto.obrigatoria ? "<span class='text-danger'>*</span>" : ""}

            </div>

            <div class="photo-card">

                <img
                    id="preview-${foto.id}"
                    class="photo-preview d-none">

                <div
                    id="placeholder-${foto.id}"
                    class="photo-placeholder">

                    📷

                    <br><br>

                    Foto

                </div>

                <input

                    id="input-${foto.id}"

                    type="file"

                    accept="image/*"

                    capture="environment"

                    hidden>

            </div>

            <div class="photo-actions mt-2">

                <button

                    class="btn btn-outline-primary btn-sm"

                    onclick="abrirCamera('${foto.id}')">

                    📷 Adicionar

                </button>

                <button

                    class="btn btn-outline-secondary btn-sm"

                    onclick="trocarFoto('${foto.id}')">

                    🔄 Trocar

                </button>

                <button

                    class="btn btn-outline-danger btn-sm"

                    onclick="removerFoto('${foto.id}')">

                    🗑 Remover

                </button>

            </div>

        `;

        container.appendChild(card);

        document
            .getElementById(`input-${foto.id}`)
            .addEventListener("change", e => carregarFoto(e, foto.id));

    });

}

// =============================
// ABRIR CÂMERA
// =============================

function abrirCamera(id){

    document
        .getElementById(`input-${id}`)
        .click();

}

// =============================
// TROCAR FOTO
// =============================

function trocarFoto(id){

    abrirCamera(id);

}

// =============================
// REMOVER FOTO
// =============================

function removerFoto(id){

    imagens[id] = null;

    const preview =
        document.getElementById(`preview-${id}`);

    const placeholder =
        document.getElementById(`placeholder-${id}`);

    preview.src = "";

    preview.classList.add("d-none");

    placeholder.classList.remove("d-none");

}

// =============================
// CARREGA FOTO
// =============================

function carregarFoto(event,id){

    const arquivo = event.target.files[0];

    if(!arquivo) return;

    const reader = new FileReader();

    reader.onload = function(e){

        imagens[id] = e.target.result;

        const preview =
            document.getElementById(`preview-${id}`);

        preview.src = e.target.result;

        preview.classList.remove("d-none");

        document
            .getElementById(`placeholder-${id}`)
            .classList.add("d-none");

    };

    reader.readAsDataURL(arquivo);

}