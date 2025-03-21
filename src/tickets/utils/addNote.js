const axios = require("axios");
const fs = require("fs");
const path = require("path");
const CONFIG = require("../config");
const logger = require("../logs/logger");

async function addNoteToTicket(ticket_id) {
    try {
        // ✅ Lendo o JSON gerado pelo convertTxtToJson.js
        const jsonFilePath = path.join(__dirname, "../utils/dados/note.json");

        // 🔄 Verificar se o arquivo JSON existe ANTES de tentar utilizá-lo
        if (!fs.existsSync(jsonFilePath)) {
            logger.error("❌ ERRO: Arquivo note.json não encontrado!");
            console.error("❌ ERRO: Arquivo note.json não encontrado!");
            return;
        }

        // 🔍 Carregar dados JSON do arquivo
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

        // 🤖 Criar a requisição com a nota do JSON
        const noteURL = `${CONFIG.API_URL}/${ticket_id}/notes`;

        const noteData = {
            body: jsonData.body, // Agora usa o conteúdo do JSON extraído do log.txt
            private: jsonData.private // Mantém se a nota será pública ou privada
        };

        // 🔹 Enviando requisição para adicionar a nota ao chamado
        const response = await axios.post(noteURL, noteData, {
            auth: { username: CONFIG.API_KEY, password: "X" },
            headers: { "Content-Type": "application/json" }
        });

        // 📌 Verificar resposta da API
        if (response.status === 201) {
            logger.info(`✅ Nota adicionada ao chamado ${ticket_id}`);
            console.log(`✅ Nota adicionada com sucesso no chamado ${ticket_id}`);
        } else {
            logger.warn(`⚠️ Erro ao adicionar nota ao chamado: ${response.status}`);
            console.warn(`⚠️ Erro ao adicionar nota (${response.status}): ${response.data}`);
        }
       
    } catch (error) {
        logger.error(`❌ ERRO ao adicionar nota: ${error.message}`);
        console.error(`❌ ERRO ao adicionar nota: ${error.message}`);
    }
}

module.exports = addNoteToTicket;