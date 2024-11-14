import BaixasCRUD from "./Baixas";
import ProdutosCRUD from "./Produtos";
import RotaCalculaEstoque from "./math/CalculaEstoque";

const express = require('express');
const cors = require('cors'); // Importa o middleware cors
const DBManager = require('./DatabaseManager');
const appDB = new DBManager('../data/app.db');

const app = express();
const PORT = 3000;

// Configurações do Express para permitir JSON no corpo das requisições
app.use(express.json());

// Habilita o CORS para todas as origens
app.use(cors());

//Carrega o CRUD de produtos
const produtosCrud = new ProdutosCRUD(app, appDB);
const baixasCrud   = new BaixasCRUD(app, appDB);
const calcEstoque = new RotaCalculaEstoque(app, appDB);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

