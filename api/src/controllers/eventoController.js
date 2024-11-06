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
    try{
        connect.query(query, values, (err) =>{
            if(err){
                console.log(err);
                return res.status(500).json({error: "Erro ao criar o evento!"});
            }
            else{
                return res.status(201).json({message: "Evento criado com Sucesso!"})
            }
        })
    }catch(error){
        console.log("Erro ao executar consulta: ", error);
        return res.status(500).json({eror: "Erro interno do servidor!"});
    }
  }//Fim do create  

//Visualizar todos os eventos
static async getAllEventos(req, res){
    const query = `select * from evento`;

    try{
        connect.query(query, (err, results) =>{
            if(err) {
                console.log(err);
                return res.status(500).json({error: "Erro ao buscar Eventos"})
            }
        return res.status(200).json({message: "Eventos Listados com sucesso", events:results})
        });
    }catch(error){
        console.error("Erro ao executar a consulta", error)
        return res.status(500).json({error: "Erro interno do Servidor",})
    }
}//Fim do GetAllEventos

//Atualiza um evento
static async updateEvento(req, res) {
    const { id_evento, nome, descricao, data_hora, local, fk_id_organizador } = req.body;

    if (!id_evento || !nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `UPDATE evento SET nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=?  WHERE id_evento = ?`;
    const values = [nome, descricao, data_hora, local,fk_id_organizador, id_evento];

    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ", results)
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Evento não encontrado" });
        }
        return res.status(200).json({ message: "Evento atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }//Fim do Update

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
  }//Fim do deleteEvento


};
