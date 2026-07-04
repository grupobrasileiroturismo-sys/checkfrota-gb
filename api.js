//========================================
// API
//========================================

const URL_WEBAPP =
    "https://script.google.com/macros/s/AKfycbzj-9KoUraWgy5ttt0lQHSi3YeIeu3JONb9vVWX2O9Q8MjeEAr3DYCD1GKcIqe9KbmS/exec";

//========================================
// ENVIA INSPEÇÃO
//========================================

async function enviarInspecao(dados){

    const formData = new FormData();

    // Dados do formulário
    formData.append(
        "dados",
        JSON.stringify(dados)
    );

    // Fotos
    for(const id in imagens){

        if(imagens[id]){

            formData.append(
                id,
                imagens[id],
                `${id}.jpg`
            );

        }

    }

    const resposta = await fetch(URL_WEBAPP,{

        method:"POST",

        body:formData

    });

    return await resposta.json();

}