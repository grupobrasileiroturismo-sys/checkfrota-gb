//========================================
// API
//========================================

const URL_WEBAPP = "https://script.google.com/macros/s/AKfycbzyquYVqaKMpdlLbThexu2_RvXNxX9GT5ilm3lK9aPSkhCJwvbaGDH4D8OlsCLOreC4/exec";


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

        const resposta = await fetch(URL_WEBAPP,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(envio)

        });

        return await resposta.json();

    }

    catch(erro){

        console.error(erro);

        return{

            sucesso:false,

            erro:erro.message

        };

    }

}