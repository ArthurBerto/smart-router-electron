const fs = require("fs");
const path = require("path");

function convertTxtToJson() {
    try {
        const arquivoTxt = path.join(__dirname, "../utils/dados/routerLog.txt"); 

        // 🔍 Verificando se o arquivo existe
        if (!fs.existsSync(arquivoTxt)) {
            console.log("ERRO: Arquivo routerLog.txt não encontrado!");
            return;
        }

        // 📂 Ler conteúdo do arquivo TXT
        let logContent = fs.readFileSync(arquivoTxt, "utf-8").split("\n").map(line => line.trim());
        let logContentStr = logContent.join("<br>"); // Junta as linhas mantendo a formatação original

        // Criar objeto JSON com a mensagem de log
        const jsonData = {
            body: logContentStr,
            private: false
        };

        // 📝 Caminho completo do arquivo JSON
        const jsonFilePath = path.join(__dirname, "../utils/dados/note.json");

        // 🌍 Converter para JSON e salvar
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 4), "utf-8");

        console.log(`Arquivo TXT convertido para JSON com sucesso: ${jsonFilePath}`);
        console.log(`Arquivo criado em: ${jsonFilePath}`);

    } catch (error) {
        console.log(`ERRO ao converter TXT para JSON: ${error}`);
    }
}

module.exports = convertTxtToJson;