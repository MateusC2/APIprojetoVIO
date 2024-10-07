//Importa a instância do Express configurada em index.js
const app = require("./index");
const cors = require('cors')

const corsOptions = {
    origin: '*', //Substitua pela origem permitida
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', //Métodos HTTP permitidos
    credential:true, //Permite o uso de cookies e credenciais
    optionsSuccessStatus:204, //Define o status de resposta para o metodo OPTIONS
}
app.use(cors(corsOptions));
//Inicia o servidor na porta 5000, tornando a API acessível em http://localhost:5000
app.listen(5000);
