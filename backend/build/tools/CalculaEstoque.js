"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CalculaEstoque {
    constructor(app, dbInstance) {
        this.dbInstance = dbInstance;
        // Rota para obter um Baixa pelo ID
        app.get('/estoque/:id', (req, res) => {
            const { id } = req.params;
            try {
                let resultados = this.dbInstance.consultar(`SELECT * FROM baixas
                                                   where idProduto = ${id}`);
                let estoque = 0;
                //Para cada baixa do produto
                for (let i = 0; i < resultados.length; i++) {
                    const baixa = resultados[i];
                    const tipoBaixa = baixa.tipoBaixa;
                    const valorBaixa = baixa.quantidade;
                    switch (tipoBaixa) {
                        case 'comprou':
                            estoque += valorBaixa;
                            break;
                        case 'vendeu':
                            estoque -= valorBaixa;
                            break;
                    }
                }
                res.status(200).json({
                    idProduto: id,
                    baixas: resultados,
                    estoque: estoque
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar Baixa.' });
            }
        });
    }
}
exports.default = CalculaEstoque;
