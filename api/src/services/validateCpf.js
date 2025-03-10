const connect = require("../db/connect");
const { use } = require("../routes/apiRoutes");

module.exports = async function validateCpf(cpf, userId) {

    const query = "SELECT id_usuario from usuario WHERE cpf=?";
    const values = [cpf];

    connect.query(query,values,(err,results)=>{
        if(err){
            //Fazer algo
        }else if(results.length > 0){
            const idDocpfCadastrado = results[0].id_usuario;

            if(userId && idDocpfCadastrado !== userId){
                return{error:"Cpf já cadastrado para outro usuário"}
            }else if(!userId){
                return{error: "CPF já cadastrado"}
            }
        }else{
            return null;
        }

    })
}