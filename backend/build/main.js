"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Baixas_1 = __importDefault(require("./Baixas"));
const Produtos_1 = __importDefault(require("./Produtos"));
const CalculaEstoque_1 = __importDefault(require("./math/CalculaEstoque"));
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
const produtosCrud = new Produtos_1.default(app, appDB);
const baixasCrud = new Baixas_1.default(app, appDB);
const calcEstoque = new CalculaEstoque_1.default(app, appDB);
// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
