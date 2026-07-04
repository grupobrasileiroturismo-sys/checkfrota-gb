// =============================================
// PHOTOS.JS
// Controle de Fotos da Inspeção
// =============================================

// =============================================
// CONFIGURAÇÃO DAS FOTOS
// =============================================

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

// Blob comprimido
const imagens = {};

// URL temporária usada apenas para liberar memória
const objectUrls = {};

// =============================================
// CRIA OS CARDS
// =============================================

function criarFotos() {

    const container = document.getElementById("photoContainer");

    container.innerHTML = "";

    FOTOS.forEach(foto => {

        imagens[foto.id] = null;
        objectUrls[foto.id] = null;

        const card = document.createElement("div");

        card.className = "photo-item";

        card.innerHTML = `

            <div class="photo-title">

                ${foto.titulo}

                ${foto.obrigatoria ? "<span class='text-danger'>*</span>" : ""}

            </div>

            <div class="photo-card">

                <div
                    id="placeholder-${foto.id}"
                    class="photo-placeholder">

                    <div class="photo-icon">
                        <i class="bi bi-camera-fill"></i>
                    </div>

                    <div
                        id="photoInfo-${foto.id}"
                        class="photo-info">

                        Nenhum arquivo selecionado

                    </div>

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

        configurarInput(foto.id);

    });

}

// =============================================
// CONFIGURA INPUT
// =============================================

function configurarInput(id){

    const input = document.getElementById(`input-${id}`);

    input.addEventListener("change", e => carregarFoto(e,id));

}

// =============================================
// ABRIR CÂMERA
// =============================================

function abrirCamera(id){

    document
        .getElementById(`input-${id}`)
        .click();

}

// =============================================
// TROCAR FOTO
// =============================================

function trocarFoto(id){

    abrirCamera(id);

}

// =============================================
// REMOVE FOTO
// =============================================

function removerFoto(id){

    imagens[id] = null;

    // libera URL antiga
    if(objectUrls[id]){

        URL.revokeObjectURL(objectUrls[id]);

        objectUrls[id] = null;

    }

    document.getElementById(`photoInfo-${id}`).innerHTML =
        "Nenhum arquivo selecionado";

    // recria completamente o input
    const antigo = document.getElementById(`input-${id}`);

    const novo = antigo.cloneNode(true);

    antigo.parentNode.replaceChild(novo,antigo);

    configurarInput(id);

}

// =============================================
// CARREGA FOTO
// =============================================

async function carregarFoto(event,id){

    const arquivo = event.target.files[0];

    if(!arquivo) return;

    try{

        // libera URL anterior
        if(objectUrls[id]){

            URL.revokeObjectURL(objectUrls[id]);

            objectUrls[id]=null;

        }

        const blob = await comprimirImagem(arquivo);

        imagens[id]=blob;

        const tamanho=(blob.size/1024).toFixed(0);

        document.getElementById(`photoInfo-${id}`).innerHTML=`

            <strong>${arquivo.name}</strong><br>

            ${tamanho} KB

        `;

    }

    catch(e){

        console.error(e);

        alert("Erro ao carregar foto.");

    }

}

// =============================================
// COMPRIME IMAGEM
// =============================================

async function comprimirImagem(file) {

    return new Promise((resolve, reject) => {

        // Cria uma URL temporária (muito mais leve que Base64)
        const imageUrl = URL.createObjectURL(file);

        const img = new Image();

        img.onload = () => {

            try {

                const MAX = 720;

                let width = img.width;
                let height = img.height;

                if (width > height) {

                    if (width > MAX) {

                        height = Math.round(height * (MAX / width));
                        width = MAX;

                    }

                } else {

                    if (height > MAX) {

                        width = Math.round(width * (MAX / height));
                        height = MAX;

                    }

                }

                const canvas = document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d", {
                    alpha: false,
                    willReadFrequently: false
                });

                ctx.drawImage(img, 0, 0, width, height);

                // Libera imediatamente a imagem original
                URL.revokeObjectURL(imageUrl);

                img.src = "";

                canvas.toBlob(blob => {

                    // Limpeza pesada de memória
                    ctx.clearRect(0, 0, width, height);

                    canvas.width = 1;
                    canvas.height = 1;

                    if (!blob) {

                        reject("Erro ao comprimir imagem.");

                        return;

                    }

                    resolve(blob);

                },
                "image/jpeg",
                0.60);

            }

            catch (erro) {

                URL.revokeObjectURL(imageUrl);

                reject(erro);

            }

        };

        img.onerror = () => {

            URL.revokeObjectURL(imageUrl);

            reject("Erro ao abrir imagem.");

        };

        img.src = imageUrl;

    });

}

// =============================================
// BLOB -> BASE64
// (Somente quando finalizar a inspeção)
// =============================================

function blobParaBase64(blob) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onloadend = () => {

            const resultado = reader.result;

            reader.abort();

            resolve(resultado);

        };

        reader.onerror = reject;

        reader.readAsDataURL(blob);

    });

}

// =============================================
// RETORNA TODAS AS FOTOS EM BASE64
// (Será usada quando gerar o PDF)
// =============================================

async function obterFotosBase64() {

    const fotos = {};

    for (const id in imagens) {

        if (imagens[id]) {

            fotos[id] = await blobParaBase64(imagens[id]);

        }

    }

    return fotos;

}

// =============================================
// LIMPA TODA A MEMÓRIA DAS FOTOS
// =============================================

function limparFotos() {

    for (const id in imagens) {

        imagens[id] = null;

    }

    for (const id in objectUrls) {

        if (objectUrls[id]) {

            URL.revokeObjectURL(objectUrls[id]);

            objectUrls[id] = null;

        }

    }

}

// =============================================
// LIMPA AUTOMATICAMENTE AO SAIR DA PÁGINA
// =============================================

window.addEventListener("beforeunload", () => {

    limparFotos();

});