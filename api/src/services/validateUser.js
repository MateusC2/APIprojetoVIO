module.exports = function validateUser({cpf,email,password,name,data_nascimento}){

    if (!cpf || !email || !password || !name || !data_nascimento) {
        return{error: "Todos os campos devem ser preenchidos!"}
    }
    if(isNaN(cpf)||cpf.length !== 11){
        return {error:"CPF inválido, Deve conter 11 digitos numéricos"}
    }
    if (!email.includes("@")){
        return {error:"Email inválido. Deve conter um @"};
    }
    return null; //Ou seja se estiver indo tudo certo eu retorno nulo para ignorar o IF na userController
}