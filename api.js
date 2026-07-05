//========================================
// API
//========================================

const URL_WEBAPP = "https://script.google.com/macros/s/AKfycbzx4863RHcu497JD7rBpEWk-QNnRL7i7-Xoems0tPEJarqNy3_J0CeabAj_JWQ5JIKY/exec";


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