const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require('./database/database') // Importando a conexão com o Banco de Dados
const Pergunta = require("./database/Pergunta")
const Resposta = require('./database/Resposta')

// Database

connection.authenticate().then(() => {
    console.log("Conexão feita com o Banco de Dados!")
}).catch((msgErro) => {
    console.log(msgErro)
})


app.set('view engine', 'ejs') // Para utilizar o EJS como View Engine
app.use(express.static('public')) // Definindo a pasta onde estão os arquivos estáticos

// Body parser para decodificar o dados passados no formulário
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// Rotas
app.get("/", function(req, res){
    // Selec * From no modo Sequelize, as pergunas são jogadas na variavel perguntas dentro do .then()
    Pergunta.findAll({ raw: true, order:[
        ['id', 'DESC'] // DESC = Decrescente || ASC = Crescente
    ]}).then(perguntas => {
        // Vai exibir a pagina index que está na pasta views
        res.render("index", {
            perguntas : perguntas // Passando as perguntar para a variável perguntas para ser acessado no EJS
        })
    })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
    let titulo = req.body.titulo // pegando o campo que tem o name "titulo"
    let descricao = req.body.descricao
    // Insert Into pelo modo Sequelize
    Pergunta.create({
        titulo: titulo, // Nome da coluna da tabela : valor a ser passado
        descricao: descricao
    }).then(() => {
        res.redirect("/") // Redireciona para a página principal após a inserção dos dados
    })
})

app.get("/pergunta/:id", (req, res) => {
    let id = req.params.id
    // FILTRO COM SEQUELIZE
    Pergunta.findOne({
        where: {id: id} // Buscar no banco onde, A coluna da tabela : id passado na URL
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta encontrada!

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })

        }else{ // Pergunta não encontrada
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId)
    })
})

// Iniciando servidor
app.listen(8080, ()=>{
    console.log("App rodando!")
})