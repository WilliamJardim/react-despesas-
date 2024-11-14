import { Application, Request, Response } from 'express';

function CalcularEstoque(dbInstance: any, idProduto:number){

    let resultados = dbInstance.consultar(`SELECT * FROM baixas
                                           where idProduto = ${ idProduto }`);
    let estoque = 0;

    //Para cada baixa do produto
    for( let i = 0 ; i < resultados.length ; i++ )
    {
      const baixa      = resultados[i];
      const tipoBaixa  = baixa.tipoBaixa;
      const valorBaixa = baixa.quantidade;

      if( tipoBaixa == 'comprou' ){
         estoque += valorBaixa;

      }else if( tipoBaixa == 'vendeu' ){
         estoque -= valorBaixa;
      }

    }

    return {
      idProduto: idProduto,
      estoque: estoque
    };
}


class RotaCalculaEstoque {
  private dbInstance: any;

  constructor(app: Application, dbInstance: any) {
    this.dbInstance = dbInstance;

    // Rota para calcular o estoque pelo ID do produto
    app.get('/estoque/:id', (req: Request, res: Response) => {
      const { id } = req.params;

      try {
        
        const dadosEstoque = CalcularEstoque(dbInstance, Number(id) );
        res.status(200).json(dadosEstoque);
        
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Estoque.' });
      }
    });

  }
}

export default RotaCalculaEstoque;
export {CalcularEstoque};