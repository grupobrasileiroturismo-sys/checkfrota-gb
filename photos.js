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

    // Libera a memória da imagem
    if(preview.src){
        URL.revokeObjectURL(preview.src);
    }

    preview.src = "";

    preview.classList.add("d-none");

    document
        .getElementById(`placeholder-${id}`)
        .classList.remove("d-none");

    document
        .getElementById(`input-${id}`)
        .value = "";

}


// =============================
// CARREGA FOTO
// =============================

async function carregarFoto(event, id) {

    const arquivo = event.target.files[0];

    if (!arquivo) return;

    try {

        // Comprime a imagem
        const fotoComprimida = await comprimirImagem(arquivo);

        // Preview (consome menos memória)
        const preview = document.getElementById(`preview-${id}`);

        const objectURL = URL.createObjectURL(fotoComprimida);

        preview.src = objectURL;

        preview.classList.remove("d-none");

        document
            .getElementById(`placeholder-${id}`)
            .classList.add("d-none");

        // Converte o blob comprimido para Base64
        const reader = new FileReader();

        reader.onloadend = function () {

            imagens[id] = reader.result;

        };

        reader.readAsDataURL(fotoComprimida);

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar a foto.");

    }

}

// =============================
// CONVERTER FOTO
// =============================

async function comprimirImagem(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function (event) {

            const img = new Image();

            img.onload = function () {

                const MAX = 1024;

                let width = img.width;
                let height = img.height;

                if (width > height) {

                    if (width > MAX) {

                        height = height * MAX / width;
                        width = MAX;

                    }

                } else {

                    if (height > MAX) {

                        width = width * MAX / height;
                        height = MAX;

                    }

                }

                const canvas = document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(

                    blob => {

                        if (!blob) {
                            reject("Erro ao comprimir imagem.");
                            return;
                        }

                        resolve(blob);

                    },

                    "image/jpeg",

                    0.75

                );

            };

            img.src = event.target.result;

        };

        reader.readAsDataURL(file);

    });

}