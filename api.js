//========================================
// API
//========================================

const URL_WEBAPP = "https://script.google.com/macros/s/AKfycbzyquYVqaKMpdlLbThexu2_RvXNxX9GT5ilm3lK9aPSkhCJwvbaGDH4D8OlsCLOreC4/exec";


//========================================
// ENVIA INSPEÇÃO
//========================================

async function enviarInspecao(dados){

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

    return await resposta.json();

}