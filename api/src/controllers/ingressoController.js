const connect = require("../db/connect");

module.exports = class ingressoController {
  //criação de um ingresso
  static async createIngresso(req, res) {
    const { preco, tipo, fk_id_evento } = req.body;

    //Validação generica de todos atributos
    if (!preco || !tipo || !fk_id_evento) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `insert into ingresso 
    (preco, tipo, fk_id_evento) values(?,?,?)`;
    const values = [preco, tipo, fk_id_evento];
    try{
        connect.query(query, values, (err) =>{
            if(err){
                console.log(err);
                return res.status(500).json({error: "Erro ao criar o ingresso!"});
            }
            else{
                return res.status(201).json({message: "Ingresso criado com Sucesso!"})
            }
        })
    }catch(error){
        console.log("Erro ao executar consulta: ", error);
        return res.status(500).json({eror: "Erro interno do servidor!"});
    }
  }//Fim do create  

//Visualizar todos os ingressos
static async getAllIngresso(req, res){
    const query = `select * from ingresso`;

    try{
        connect.query(query, (err, results) =>{
            if(err) {
                console.log(err);
                return res.status(500).json({error: "Erro ao buscar ingressos"})
            }
        return res.status(200).json({message: "Ingressos Listados com sucesso", ingresso:results})
        });
    }catch(error){
        console.error("Erro ao executar a consulta", error)
        return res.status(500).json({error: "Erro interno do Servidor",})
    }
}//Fim do GetAllIngressos

//Atualiza um ingresso
static async updateIngresso(req, res) {
    const { id_ingresso, preco, tipo, fk_id_evento } = req.body;

    if (!id_ingresso || !preco || !tipo || !fk_id_evento) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `UPDATE ingresso SET preco=?, tipo=?, fk_id_evento=?  WHERE id_ingresso = ?`;
    const values = [preco, tipo, fk_id_evento, id_ingresso];

    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ", results)
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Ingresso não encontrado" });
        }
        return res.status(200).json({ message: "Ingresso atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }//Fim do Update

  // Deletar um ingresso
  static async deleteIngresso(req, res) {
    const id_ingresso = req.params.id;

    const query = `DELETE FROM ingresso WHERE id_ingresso = ?`;
    const values = [id_ingresso];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao excluir ingresso" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Ingresso não encontrado" });
        }
        return res.status(200).json({ message: "Ingresso excluído com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }//Fim do deleteIgresso


};
