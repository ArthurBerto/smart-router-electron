const axios = require("axios");
const CONFIG = require("../config");

const { ipcMain } = require("electron");

async function updateTicket(ticket_id, modelo, loja) {
  try {
    const ticketURL = `${CONFIG.API_URL}/${ticket_id}`;

    const updateData = {
      subject: `Configuração de ${modelo} para LJ${loja} `,
      responder_id: 31002213634,
      status: 2, // 2 - Aberto, 4 - Resolvido
      custom_fields: {
        categoria: "TI",
        formulrio: "Links / Internet",
        servio: "Configurar contingência 4G para loja",
        tipo_da_falha: "Técnica",
        local_de_falha: "Equipamento",
        defeito_aplicativo: "Parâmetros desconfigurados",
        defeito_equipamento: "Equipamento descalibrado",
        ao_aplicada_aplicativo: "Reconfigurado parâmetros",
        ao_aplicada_equipamento: "Reconfigurado equipamento",
        anotaes_de_resoluo: "Utilizado script de configuração de roteador",
      },

      assets: [
        {
          display_id: 167,
        },
      ],
    };

    const response = await axios.put(ticketURL, updateData, {
      auth: { username: CONFIG.API_KEY, password: "X" },
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      ipcMain.emit(
        "enviar-log",
        null,
        `Chamado fechado no Araujo Service! #SR-${ticket_id}`
      );
    } else {
      ipcMain.emit(
        "enviar-log",
        null,
        `Erro ao fechar chamado: ${response.status}`
      );
    }
  } catch (error) {
    ipcMain.emit(
      "enviar-log",
      null,
      `Erro ao fechar o chamado: ${error}`
    );
  }
}

module.exports = updateTicket;
