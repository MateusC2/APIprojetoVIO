const connect = require("../db/connect");

module.exports = class eventoController {
  //criação de um evento
  static async createEvento(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador } = req.body;

    //Validação generica de todos atributos
    if (!nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `insert into evento 
    (nome, descricao, data_hora, local, fk_id_organizador) values(?,?,?,?,?)`;
    const values = [nome, descricao, data_hora, local, fk_id_organizador];
    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o evento!" });
        } else {
          return res
            .status(201)
            .json({ message: "Evento criado com Sucesso!" });
        }
      });
    } catch (error) {
      console.log("Erro ao executar consulta: ", error);
      return res.status(500).json({ eror: "Erro interno do servidor!" });
    }
  } //Fim do create

  //Visualizar todos os eventos
  static async getAllEventos(req, res) {
    const query = `select * from evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar Eventos" });
        }
        return res
          .status(200)
          .json({ message: "Eventos Listados com sucesso", events: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta", error);
      return res.status(500).json({ error: "Erro interno do Servidor" });
    }
  } //Fim do GetAllEventos

  //Atualiza um evento
  static async updateEvento(req, res) {
    const { id_evento, nome, descricao, data_hora, local, fk_id_organizador } =
      req.body;

    if (
      !id_evento ||
      !nome ||
      !descricao ||
      !data_hora ||
      !local ||
      !fk_id_organizador
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `UPDATE evento SET nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=?  WHERE id_evento = ?`;
    const values = [
      nome,
      descricao,
      data_hora,
      local,
      fk_id_organizador,
      id_evento,
    ];

    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ", results);
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Evento não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Evento atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } //Fim do Update

  // Deletar um evento
  static async deleteEvento(req, res) {
    const id_evento = req.params.id;

    const query = `DELETE FROM evento WHERE id_evento = ?`;
    const values = [id_evento];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao excluir evento" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado" });
        }
        return res.status(200).json({ message: "Evento excluído com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } //Fim do deleteEvento

  static async getEventosPorData(req, res) {
    const query = `SELECT * FROM evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        } //if

        const dataEvento = new Date(results[0].data_hora);
        const dia = dataEvento.getDate();
        const mes = dataEvento.getMonth()+1;
        const ano = dataEvento.getFullYear();
        console.log(dia + "/" + mes + "/" + ano);

        const now = new Date(); //Cria uma constante que recebe um valor de novo parametro (tipo date)
        const eventosPassados = results.filter(
          (evento) => new Date(evento.data_hora) < now); // Filtra eventos passados
        const eventosFuturos = results.filter(
          (evento) => new Date(evento.data_hora) >= now); // Filtra eventos futuros

        const diferencaMs = eventosFuturos[0].data_hora.getTime() - now.getTime();
        const dias = Math.floor(diferencaMs/(1000*60*60*24))
        const horas = Math.floor((diferencaMs%(1000*60*60*24)/ (1000*60*60)))
        const minutos = Math.floor((diferencaMs%(1000*60*60)/ (1000*60)))
        console.log(diferencaMs,"\nFaltam "+dias+ " dias")
        console.log(diferencaMs,"\nFaltam "+horas+ " horas")
        console.log(diferencaMs,"\nFaltam "+minutos+ " minutos")

        //Comparando datas
        const dataFiltro = new Date("2024-12-15").toISOString().split("T");
        const eventosDia = results.filter(evento => new Date(evento.data_hora).toISOString().split("T")[0] === dataFiltro[0])
        console.log("Eventos: ", eventosDia)

        console.log(dataFiltro)
        console.log("Data filtro: ", dataFiltro)

        return res.status(200).json({
          message: "Ok",
          eventosPassados,
          eventosFuturos,
        });
      }); //try
    } catch {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    } //catch
  }

  static async getEventosProximos7Dias(req, res) {
    const { dataInicial } = req.params; // Pega a data fornecida no parâmetro da URL (formato YYYY-MM-DD)

    //Url q foi utilizada : http://localhost:5000/api/v1/evento/7dias/2024-11-01
  
    // Valida se a data foi passada e se está no formato correto
    if (!dataInicial || isNaN(Date.parse(dataInicial))) {
      return res.status(400).json({ error: "Data inválida ou não fornecida. Use o formato YYYY-MM-DD." });
    }
  
    // Converte a data fornecida para um objeto Date
    const dataInicio = new Date(dataInicial);
  
    // Se a data fornecida for inválida
    if (dataInicio.toString() === "Invalid Date") {
      return res.status(400).json({ error: "Data inválida. Por favor, forneça uma data no formato YYYY-MM-DD." });
    }
  
    // Calcula a data final (7 dias depois da data inicial)
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataInicio.getDate() + 7); // Adiciona 7 dias
  
    // Converte as datas para o formato ISO para comparação no banco
    const dataInicioIso = dataInicio.toISOString().split('T')[0];  // "YYYY-MM-DD"
    const dataFimIso = dataFim.toISOString().split('T')[0];        // "YYYY-MM-DD"
  
    const query = `SELECT * FROM evento WHERE data_hora BETWEEN ? AND ?`;
  
    try {
      connect.query(query, [dataInicioIso + 'T00:00:00.000Z', dataFimIso + 'T23:59:59.999Z'], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: "Nenhum evento encontrado para o período informado." });
        }
  
        // Formatação da data e hora dos eventos encontrados
        const eventosComDataFormatada = results.map(evento => {
          const dataEvento = new Date(evento.data_hora);
          const dia = dataEvento.getDate();
          const mes = dataEvento.getMonth() + 1;
          const ano = dataEvento.getFullYear();
          const hora = dataEvento.getHours();
          const minuto = dataEvento.getMinutes();
  
          // Formata a data para DD/MM/AAAA e hora para HH:MM
          evento.data_hora_formatada = `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${ano} ${hora < 10 ? '0' + hora : hora}:${minuto < 10 ? '0' + minuto : minuto}`;
          return evento;
        });
  
        return res.status(200).json({
          message: "Eventos encontrados com sucesso.",
          eventos: eventosComDataFormatada,
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao processar a requisição." });
    }
  }
};
