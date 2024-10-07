let Orgs = [];
let nextId = 1;

module.exports = class orgController {
  static async createOrg(req, res) {
    const { telefone, email, password, name } = req.body;

    if (!telefone || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      return res.status(400).json({
        error: "Telefone inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Verifica se já existe um usuário com o mesmo CPF
    const existingOrg = Orgs.find((org) => org.email === email);
    if (existingOrg) {
      return res.status(400).json({ error: "email já cadastrado" });
    }

    // Cria e adiciona novo usuário
    const newOrg = { id: nextId++, telefone, email, password, name };
    Orgs.push(newOrg);
    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso", Org: newOrg });
  }

  static async getAllOrgs(req, res) {
    return res.status(200).json({ message: "Obtendo todos os usuários", Orgs });
  }

  static async deleteOrg(req, res) {
    //Obtem o parametro 'id' da requisição, que é o CPF do user a ser deletado
    const orgId = req.params.id_organizador;

    // Procurar o indice do Usuario no Array 'users' pelo cpf
    const orgIndex = Orgs.findIndex((org) => org.id_organizador === orgId);
    //Se o usuario não for encontrado userIndex equivale a -1
    if (orgIndex == -1) {
      return res.status(400).json({ error: "Usuario não encontrado" });
    }
    //Removendo o usuario do Array 'users'
    Orgs.splice(orgIndex, 1);

    return res.status(200).json({ message: "Usuario Apagado com SUCESSO!!!" });
  }


  static async updateOrg(req, res) {
  // Desestrutura e recupera os dados enviados via corpo da requisição
  const {id, telefone, email, password, name } = req.body;

  // Validar se todos os campos foram preenchidos
  if(!id || !telefone || !email || !password || !name) {
      return res.status(400).json({error:"Todos os campos devem ser preenchidos"});
  }
  //Procurar o indice do user no Array 'orgs' pelo id
  const orgIndex = Orgs.findIndex(org => org.id == id)
  //Se o usuário não for encontrado userIndex equivale a -1
  if(orgIndex === -1){
      return res.status(400).json({error: "Usuário não encontrado"});
  }

  //Atualiza os dados do usuário no Array 'users'
  Orgs[orgIndex] = {id, telefone, email, password, name }
  
  return res.status(200).json({message: "Usuário atualizado", org:Orgs[orgIndex]})
}

}

  // static async updateOrg(req, res) {
  //   //Desestrutura e recupera os dados enviados via corpo da requisição
  //   const { id_organizador, telefone, email, password, name } = req.body;

  //   //Validar se todos os campos foram preenchidos
  //   if (( !id_organizador, !telefone || !email || !password || !name)) {
  //     return res
  //       .status(400)
  //       .json({ error: "Todos os campos devem ser preenchidos" });
  //   }
  //   // Procurar o indice do Usuario no Array 'users' pelo cpf
  //   const orgIndex = Orgs.findIndex(
  //     (org) => org.id_organizador == id_organizador
  //   );
  //   //Se o usuario não for encontrado userIndex equivale a -1
  //   if (orgIndex == -1) {
  //     return res.status(400).json({ error: "Usuario não encontrado" });
  //   }
  //   //Atualiza os dados do usuario no Array 'users'
  //   Orgs[orgIndex] = {id_organizador, telefone, email, password, name };
  //   return res
  //     .status(200)
  //     .json({ message: "Usuario atualizado", org:Orgs[orgIndex] });
  // }