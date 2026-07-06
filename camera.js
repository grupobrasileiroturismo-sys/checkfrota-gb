// =============================================
// CAMERA.JS
// CheckFrota GB
// Captura de câmera (Etapa 1)
// =============================================

// Stream atual da câmera
let stream = null;

// Foto que está sendo capturada
let fotoAtual = null;

// =============================================
// ABRE A CÂMERA
// =============================================

async function abrirCameraCustom(id){

    fotoAtual = id;

    const modal = document.getElementById("cameraModal");
    const video = document.getElementById("cameraVideo");

    try{

        // Fecha qualquer câmera aberta anteriormente
        fecharCamera(false);

        stream = await navigator.mediaDevices.getUserMedia({

            video:{

                facingMode:{
                    ideal:"environment"
                },

                width:{
                    ideal:1280
                },

                height:{
                    ideal:720
                }

            },

            audio:false

        });

        video.srcObject = stream;

        modal.style.display = "flex";

        await video.play();

    }

    catch(erro){

        console.error("Erro ao abrir câmera:",erro);

        alert("Não foi possível acessar a câmera.");

    }

}

// =============================================
// FECHA A CÂMERA
// =============================================

function fecharCamera(fecharModal = true){

    if(stream){

        stream.getTracks().forEach(track=>track.stop());

        stream = null;

    }

    const video = document.getElementById("cameraVideo");

    if(video){

        video.pause();

        video.srcObject = null;

    }

    if(fecharModal){

        document.getElementById("cameraModal").style.display = "none";

    }

}

// =============================================
// CAPTURAR FOTO
// =============================================

async function capturarFoto(){

    try{

        const video = document.getElementById("cameraVideo");

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video,0,0);

        const blobOriginal = await new Promise(resolve=>{

            canvas.toBlob(resolve,"image/jpeg",1);

        });

        // reutiliza nossa compressão
        const blobComprimido = await comprimirImagem(blobOriginal);

        imagens[fotoAtual] = blobComprimido;

        const tamanho = (blobComprimido.size/1024).toFixed(0);

        document.getElementById(`photoInfo-${fotoAtual}`).innerHTML = `

            <strong>${fotoAtual}.jpg</strong>

            <br>

            ${tamanho} KB

        `;

        ctx.clearRect(0,0,canvas.width,canvas.height);

        canvas.width = 1;

        canvas.height = 1;

        fecharCamera();

    }

    catch(e){

        console.error(e);

        alert("Erro ao capturar foto.");

    }

}

// =============================================
// SEGURANÇA
// Fecha a câmera ao sair da página
// =============================================

window.addEventListener("beforeunload",()=>{

    fecharCamera(false);

});