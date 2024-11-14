"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalcularEstoque = CalcularEstoque;
function CalcularEstoque(dbInstance, idProduto) {
    let resultados = dbInstance.consultar(`SELECT * FROM baixas
                                           where idProduto = ${idProduto}`);
    let estoque = 0;
    //Para cada baixa do produto
    for (let i = 0; i < resultados.length; i++) {
        const baixa = resultados[i];
        const tipoBaixa = baixa.tipoBaixa;
        const valorBaixa = baixa.quantidade;
        if (tipoBaixa == 'comprou') {
            estoque += valorBaixa;
        }
        else if (tipoBaixa == 'vendeu') {
            estoque -= valorBaixa;
        }
    }
    return {
        idProduto: idProduto,
        estoque: estoque
    };
}
class RotaCalculaEstoque {
    constructor(app, dbInstance) {
        this.dbInstance = dbInstance;
        // Rota para calcular o estoque pelo ID do produto
        app.get('/estoque/:id', (req, res) => {
            const { id } = req.params;
            try {
                const dadosEstoque = CalcularEstoque(dbInstance, Number(id));
                res.status(200).json(dadosEstoque);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar Estoque.' });
            }
        });
    }
}
exports.default = RotaCalculaEstoque;
