// =============================================
// PHOTOS.JS V2
// CheckFrota GB
// =============================================

// ============================
// CONFIGURAÇÃO DAS FOTOS
// ============================

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

// Armazena somente os blobs comprimidos
const imagens = {};

// ============================
// CRIA CARDS
// ============================

function criarFotos() {

    const container = document.getElementById("photoContainer");

    if (!container) return;

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

                <div
                    id="photoInfo-${foto.id}"
                    class="photo-info">

                    Nenhum arquivo selecionado

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

// ============================
// CONFIGURA INPUT
// ============================

function configurarInput(id){

    const input = document.getElementById(`input-${id}`);

    input.addEventListener("change",(e)=>{

        carregarFoto(e,id);

    });

}

// ============================
// ABRIR CÂMERA
// ============================

function abrirCamera(id){

    abrirCameraCustom(id);

}

// ============================
// TROCAR FOTO
// ============================

function trocarFoto(id){

    abrirCameraCustom(id);

}

// ============================
// REMOVER FOTO
// ============================

function removerFoto(id){

    imagens[id] = null;

    document.getElementById(`photoInfo-${id}`).innerHTML =
        "Nenhum arquivo selecionado";

    // recria o input completamente
    const antigo = document.getElementById(`input-${id}`);

    const novo = antigo.cloneNode(true);

    antigo.parentNode.replaceChild(novo, antigo);

    configurarInput(id);

}

// ============================
// CARREGAR FOTO
// ============================

async function carregarFoto(event,id){

    const arquivo = event.target.files[0];

    if(!arquivo) return;

    // libera a foto anterior da memória
    imagens[id] = null;

    try{

        // comprime a imagem
        const blob = await comprimirImagem(arquivo);

        imagens[id] = blob;

        const tamanho = (blob.size/1024).toFixed(0);

        document.getElementById(`photoInfo-${id}`).innerHTML = `

            <strong>${arquivo.name}</strong>

            <br>

            ${tamanho} KB

        `;

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao carregar a foto.");

    }

}

// =============================================
// COMPRESSÃO DE IMAGEM (V2.1)
// =============================================

async function comprimirImagem(arquivo){

    return new Promise((resolve,reject)=>{

        const img = new Image();

        const url = URL.createObjectURL(arquivo);

        img.onload = function(){

            const MAX = 640;

            let width = img.width;
            let height = img.height;

            if(width > height){

                if(width > MAX){

                    height = Math.round(height * MAX / width);
                    width = MAX;

                }

            }else{

                if(height > MAX){

                    width = Math.round(width * MAX / height);
                    height = MAX;

                }

            }

            const canvas = document.createElement("canvas");

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img,0,0,width,height);

            canvas.toBlob(function(blob){

                // libera memória imediatamente
                ctx.clearRect(0,0,width,height);

                canvas.width = 1;
                canvas.height = 1;

                URL.revokeObjectURL(url);

                img.src = "";

                if(!blob){

                    reject("Erro ao comprimir imagem.");

                    return;

                }

                resolve(blob);

            },
            "image/jpeg",
            0.55);

        };

        img.onerror = function(){

            URL.revokeObjectURL(url);

            reject("Erro ao abrir imagem.");

        };

        img.src = url;

    });

}

// =============================================
// BLOB -> BASE64
// =============================================

function blobParaBase64(blob){

    return new Promise((resolve,reject)=>{

        const reader = new FileReader();

        reader.onloadend = function(){

            resolve(reader.result);

        };

        reader.onerror = reject;

        reader.readAsDataURL(blob);

    });

}

// =============================================
// OBTÉM TODAS AS FOTOS
// (Usaremos no PDF)
// =============================================

async function obterFotosBase64(){

    const fotos = {};

    for(const id of Object.keys(imagens)){

        if(imagens[id]){

            fotos[id] = await blobParaBase64(imagens[id]);

        }

    }

    return fotos;

}

// =============================================
// VERIFICA OBRIGATÓRIAS
// =============================================

function validarFotos(){

    for(const foto of FOTOS){

        if(foto.obrigatoria && !imagens[foto.id]){

            alert(`Adicione a foto: ${foto.titulo}`);

            return false;

        }

    }

    return true;

}

// =============================================
// LIMPA TODAS AS FOTOS
// =============================================

function limparFotos(){

    for(const foto of FOTOS){

        imagens[foto.id] = null;

        document.getElementById(`photoInfo-${foto.id}`).innerHTML =
            "Nenhum arquivo selecionado";

        const antigo = document.getElementById(`input-${foto.id}`);

        const novo = antigo.cloneNode(true);

        antigo.parentNode.replaceChild(novo,antigo);

        configurarInput(foto.id);

    }

}

// =============================================
// RETORNA BLOBS
// (Será usado no upload para o Apps Script)
// =============================================

function obterBlobs(){

    return imagens;

}

// =============================================
// RECEBE FOTO DA CÂMERA
// =============================================

async function salvarFotoCamera(id, blob){

    try{

        console.log("Entrou em salvarFotoCamera", id, blob);

        imagens[id] = blob;

        const tamanho = (blob.size / 1024).toFixed(0);

        document.getElementById(`photoInfo-${id}`).innerHTML = `
            <strong>${id}.jpg</strong>
            <br>
            ${tamanho} KB
        `;

    }

    catch(e){

        console.error(e);

        alert("Erro ao salvar a foto.");

    }

}