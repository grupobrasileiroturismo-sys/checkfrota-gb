//========================================
// API
//========================================

const URL_WEBAPP =
    "https://script.google.com/macros/s/AKfycbzoeFqFi7qMs3BxnYRaB4tW4_DeQ0k2-phVUuP0Z5LKtweCtcXJyN0l1N2OrD0DnKjw/exec";

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