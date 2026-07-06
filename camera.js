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

        console.log("2 - Canvas criado");

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video,0,0);

        console.log("3 - Imagem desenhada");

        const blob = await new Promise(resolve=>{

            canvas.toBlob(resolve,"image/jpeg",0.55);

        });

        console.log("4 - Blob criado", blob);

        ctx.clearRect(0,0,canvas.width,canvas.height);

        canvas.width = 1;
        canvas.height = 1;

        console.log("5 - Chamando salvarFotoCamera");

        await salvarFotoCamera(fotoAtual,blob);

        console.log("6 - Foto salva");

        fecharCamera();

        console.log("7 - Modal fechado");

    }

    catch(e){

        console.error(e);

    }

}

// =============================================
// SEGURANÇA
// Fecha a câmera ao sair da página
// =============================================

window.addEventListener("beforeunload",()=>{

    fecharCamera(false);

});