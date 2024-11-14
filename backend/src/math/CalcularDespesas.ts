import { Application, Request, Response } from 'express';

function CalcularDespesas(dbInstance: any){

    let resultados = dbInstance.consultar(`SELECT * FROM despesas`);
  
    //TODO
    return {};
}


class RotaCalcularDespesas {
  private dbInstance: any;

  constructor(app: Application, dbInstance: any) {
    this.dbInstance = dbInstance;

    // Rota para calcular as despesas
    app.get('/calculardespesas', (req: Request, res: Response) => {

      try {
        
        const dadosDespesas = CalcularDespesas(dbInstance);
        res.status(200).json(dadosDespesas);
        
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Estoque.' });
      }
    });

  }
}

export default RotaCalcularDespesas;
export {CalcularDespesas};