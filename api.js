//========================================
// API
//========================================

const URL_WEBAPP = "https://script.google.com/macros/s/AKfycbwfUhbRWE_jrgDAXryx7Ga1Z8hO-BPCsMqgSjD41QOOQ9j3YeX-fprNL94MdGpzr012/exec";


//========================================
// ENVIA INSPEÇÃO
//========================================

async function enviarInspecao(dados){

    try{

        const envio = {
            ...dados,
            fotos:{}
        };

        for(const id in imagens){

            if(imagens[id]){
                envio.fotos[id] = await blobParaBase64(imagens[id]);
            }

        }

        const form = new FormData();
        form.append("dados", JSON.stringify(envio));

        const resposta = await fetch(URL_WEBAPP,{
            method:"POST",
            body:form
        });

        const texto = await resposta.text();

        console.log("Resposta bruta do servidor:");
        console.log(texto);

        return JSON.parse(texto);

    }catch(erro){

        console.error("Erro no enviarInspecao:", erro);

        throw erro;

    }

}