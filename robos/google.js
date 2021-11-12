const imageDownloader = require("image-downloader");
const fs = require("fs");
const google = require("googleapis").google;
const customSearch = google.customsearch("v1");
const googleSearchCredenciais = require("../credenciais/google-search.json");

async function robo() {
	console.log("Início do robô de imagens do Google");
	const content = {}

	await retornaTodasImagensDeTodasSentencas(content);
}

module.exports = robo;
