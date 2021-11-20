const imageDownloader = require("image-downloader");
const fs = require("fs");
const google = require("googleapis").google;
const customSearch = google.customsearch("v1");
const googleSearchCredenciais = require("../credenciais/google-search.json");

async function robo() {
	console.log("Início do robô de imagens do Google");
	const content = {
        sentencas: [
            {
                texto: "salto_baixo_preto",
                termoBusca: `"sapato feminino salto baixo preto"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_baixo_vermelho",
                termoBusca: `"sapato feminino salto baixo vermelho"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_baixo_bege",
                termoBusca: `"sapato feminino salto baixo bege"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_baixo_azul",
                termoBusca: `"sapato feminino salto baixo azul marinho"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_baixo_rosa",
                termoBusca: `"sapato feminino salto baixo rosa"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_alto_preto",
                termoBusca: `"sapato feminino salto alto preto"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_alto_vermelho",
                termoBusca: `"sapato feminino salto alto vermelho"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_alto_bege",
                termoBusca: `"sapato feminino salto alto bege"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_alto_azul",
                termoBusca: `"sapato feminino salto alto azul marinho"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_alto_rosa",
                termoBusca: `"sapato feminino salto alto rosa"`,
                pasta: "recomendamos",
            },
            {
                texto: "sapatilha_preto",
                termoBusca: `"sapato feminino sapatilha preta"`,
                pasta: "recomendamos",
            },
            {
                texto: "sapatilha_vermelho",
                termoBusca: `"sapato feminino sapatilha vermelha"`,
                pasta: "recomendamos",
            },
            {
                texto: "sapatilha_bege",
                termoBusca: `"sapato feminino sapatilha bege"`,
                pasta: "recomendamos",
            },
            {
                texto: "sapatilha_azul",
                termoBusca: `"sapato azul salto alto feminino"`,
                pasta: "recomendamos",
            },
            {
                texto: "sapatilha_rosa",
                termoBusca: `"sapato feminino sapatilha rosa"`,
                pasta: "recomendamos",
            },
            {
                texto: "salto_baixo_amarelo",
                termoBusca: `"sapato feminino salto baixo preto"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_baixo_roxo",
                termoBusca: `"sapato feminino salto baixo roxo"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_baixo_verde",
                termoBusca: `"sapato feminino salto baixo verde"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_baixo_laranja",
                termoBusca: `"sapato feminino salto baixo laranja"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_baixo_zebra",
                termoBusca: `"sapato feminino salto baixo zebra"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_alto_amarelo",
                termoBusca: `"sapato feminino salto alto amarelo"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_alto_roxo",
                termoBusca: `"sapato feminino salto alto roxo"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_alto_verde",
                termoBusca: `"sapato feminino salto alto verde"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_alto_laranja",
                termoBusca: `"sapato feminino salto alto laranja"`,
                pasta: "não recomendamos",
            },
            {
                texto: "salto_alto_zebra",
                termoBusca: `"sapato feminino salto alto zebra"`,
                pasta: "não recomendamos",
            },
            {
                texto: "sapatilha_amarelo",
                termoBusca: `"sapato feminino sapatilha amarelo"`,
                pasta: "não recomendamos",
            },
            {
                texto: "sapatilha_roxo",
                termoBusca: `"sapato feminino sapatilha roxo"`,
                pasta: "não recomendamos",
            },
            {
                texto: "sapatilha_verde",
                termoBusca: `"sapato feminino sapatilha verde"`,
                pasta: "não recomendamos",
            },
            {
                texto: "sapatilha_laranja",
                termoBusca: `"sapato feminino sapatilha laranja"`,
                pasta: "não recomendamos",
            },
            {
                texto: "sapatilha_zebra",
                termoBusca: `"sapato feminino sapatilha zebra"`,
                pasta: "não recomendamos",
            },
        ]
    }

	await retornaTodasImagensDeTodasSentencas(content);
    await baixarTodasImagens(content);
    
    async function retornaTodasImagensDeTodasSentencas(content) {
        for (const sentenca of content.sentencas) {
            sentenca.imagens = await pesquisaGoogleERetornaLinksImagens(sentenca.termoBusca);
        }
    }
    
    async function pesquisaGoogleERetornaLinksImagens(termoBusca) {
        try {
            let imagesUrl = [];
            for (let i = 1; i < 10; i = i + 10) {
                const response = await customSearch.cse.list({
                    auth: googleSearchCredenciais.apiKey,
                    cx: googleSearchCredenciais.searchEngineId,
                    q: termoBusca,
                    searchType: "image",
                    start: i,
                });
                imagesUrl = imagesUrl.concat(response.data.items.map((item) => {
                    return item.link;
                }));
            }
            console.log(imagesUrl);
            return imagesUrl;
        } catch (error) {
            console.log(error);
        }
    }
    
    async function baixarTodasImagens(content) {
        content.imagensBaixadas = [];
        for (let sentenceIndex = 0; sentenceIndex < content.sentencas.length; sentenceIndex++) {
            const imagens = content.sentencas[sentenceIndex].imagens;
            for (let imageIndex = 0; imageIndex < imagens.length; imageIndex++) {
                const imageUrl = imagens[imageIndex];
                try {
                    if (content.imagensBaixadas.includes(imageUrl)) {
                        throw new Error("Imagem já foi baixada!");
                    }
                    await download(imageUrl, content.sentencas[sentenceIndex].texto + "-google-" + imageIndex + ".png", content.sentencas[sentenceIndex].pasta);
                    content.imagensBaixadas.push(imageUrl);
                    console.log("[" + sentenceIndex + "] [" + imageIndex + "] > baixou imagem com sucesso: " + imageUrl);
                } catch (error) {
                    console.log("[" + sentenceIndex + "] [" + imageIndex + "] > erro ao baixar imagem: " + imageUrl, error);
                }
            }
        }
    }
    
    async function download(url, fileName, pasta) {
        const dir = "./content/" + pasta;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return imageDownloader.image({url, url, dest: "./content/" + pasta + "/" + fileName});
    }
}

module.exports = robo;
