"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CalculaEstoque_1 = require("./math/CalculaEstoque");
class ProdutosCRUD {
    constructor(app, dbInstance) {
        this.dbInstance = dbInstance;
        //Verifica se a tabela produtos existe
        if (!this.dbInstance.tabelaExiste('produtos')) {
            this.dbInstance.criarTabela('produtos', [
                'nome TEXT NOT NULL',
                'precoVenda DECIMAL NOT NULL',
                'precoCompra DECIMAL NOT NULL',
                'descricao TEXT',
                'tags TEXT'
            ]);
        }
        // Rota para criar um novo Produto
        app.post('/produtos', (req, res) => {
            const { nome, precoVenda, precoCompra, descricao, tags } = req.body;
            try {
                this.dbInstance.inserir('produtos', [nome, precoVenda, precoCompra, descricao, tags]);
                res.status(201).json({ message: 'Produto criado com sucesso.' });
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao criar Produto.' });
            }
        });
        // Rota para obter todos os Produtos
        app.get('/produtos', (req, res) => {
            try {
                const produtos = this.dbInstance.consultar(`SELECT * FROM produtos`);
                //Adiciona alguns dados extras
                const produtosDadosExtra = produtos.map((produtoAtual) => {
                    var _a;
                    produtoAtual['estoqueProduto'] = (_a = (0, CalculaEstoque_1.CalcularEstoque)(dbInstance, produtoAtual.id)) === null || _a === void 0 ? void 0 : _a.estoque;
                    return produtoAtual;
                });
                res.status(200).json(produtosDadosExtra);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar Produtos.' });
            }
        });
        // Rota para obter um Produto pelo ID
        app.get('/produtos/:id', (req, res) => {
            const { id } = req.params;
            try {
                const Produto = this.dbInstance.lerID('produtos', Number(id));
                if (Produto) {
                    res.status(200).json(Produto);
                }
                else {
                    res.status(404).json({ error: 'Produto não encontrado.' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar Produto.' });
            }
        });
        // Rota para atualizar um Produto pelo ID
        app.put('/produtos/:id', (req, res) => {
            const { id } = req.params;
            const parametros = req.body;
            try {
                const changes = this.dbInstance.atualizarID('produtos', Number(id), parametros);
                if (changes) {
                    res.status(200).json({ message: 'Produto atualizado com sucesso.' });
                }
                else {
                    res.status(404).json({ error: 'Produto não encontrado.' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao atualizar Produto.' });
            }
        });
        // Rota para deletar um Produto pelo ID
        app.delete('/produtos/:id', (req, res) => {
            const { id } = req.params;
            try {
                const changes = this.dbInstance.deletarID('produtos', Number(id));
                if (changes) {
                    res.status(200).json({ message: 'Produto deletado com sucesso.' });
                }
                else {
                    res.status(404).json({ error: 'Produto não encontrado.' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao deletar Produto.' });
            }
        });
    }
}
exports.default = ProdutosCRUD;
