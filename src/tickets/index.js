const createTicket = require("./utils/createTicket");
const updateTicket = require("./utils/updateTicket");
const addNoteToTicket = require("./utils/addNote");
const convertTxtToJson = require("./utils/readTxtToJson");
const logger = require("./logs/logger");

(async () => {
    try {
        // Criar chamado
        const ticket_id = await createTicket();
        
        if (ticket_id) {
            logger.info(`⏳ Aguardando 70 segundos antes da atualização do chamado ${ticket_id}...`);
            setTimeout(async () => {
                // Atualizar chamado (se necessário)
                await updateTicket(ticket_id);

                // **Converter TXT para JSON antes de adicionar a nota**
                convertTxtToJson();

                // **Adicionar a nota do JSON ao chamado**
                await addNoteToTicket(ticket_id);

            }, 70000); // Aguarda 65 segundos antes de rodar as atualizações
        }

    } catch (error) {
        logger.error(`❌ Erro no fluxo principal: ${error.message}`);
    }
})();