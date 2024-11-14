import { Application, Request, Response } from 'express';

interface Baixa {
  idProduto: number;
  tipoBaixa: string;
  quantidade: number;
  precoVenda: number;
  precoCompra: number;
  gasto: number;
  ganho: number;
}

class BaixasCRUD {
  private dbInstance: any;

  constructor(app: Application, dbInstance: any) {
    this.dbInstance = dbInstance;

    //Verifica se a tabela Baixas existe
    if( !this.dbInstance.tabelaExiste('baixas') )
    {
      this.dbInstance.criarTabela('baixas', [
        'idProduto INT NOT NULL',
        'tipoBaixa TEXT NOT NULL',
        'quantidade DECIMAL NOT NULL',
        'precoVenda DECIMAL',
        'precoCompra DECIMAL',
        'gasto DECIMAL',
        'ganho DECIMAL'
      ]);

    }

    // Rota para criar um novo Baixa
    app.post('/baixas', (req: Request<{}, {}, Baixa>, res: Response) => {
      const idProduto     = req.body.idProduto!;
      const tipoBaixa     = req.body.tipoBaixa!;
      const quantidade    = req.body.quantidade!;
      const precoVenda    = req.body.precoVenda!; 
      const precoCompra   = req.body.precoCompra!; 
      const gasto         = req.body.gasto!;
      const ganho         = req.body.ganho!;

      try {

        this.dbInstance.inserir('baixas', [idProduto, tipoBaixa, quantidade, precoVenda, precoCompra, gasto, ganho]);

        res.status(201).json({ message: 'Baixa criado com sucesso.' });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao criar Baixa.', codigoErro: error });
      }
    });

    // Rota para obter todos os Baixas
    app.get('/baixas', (req: Request, res: Response) => {
      try {
        const Baixas = this.dbInstance.consultar(`SELECT * FROM baixas`);

        res.status(200).json(Baixas);
      
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Baixas.' });
      }
    });

    // Rota para obter um Baixa pelo ID
    app.get('/baixas/:id', (req: Request, res: Response) => {
      const { id } = req.params;

      try {
        const Baixa = this.dbInstance.lerID('Baixas', Number(id));

        if (Baixa) {
          res.status(200).json(Baixa);
        } else {
          res.status(404).json({ error: 'Baixa não encontrado.' });
        }

      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Baixa.' });
      }
    });

    // Rota para atualizar um Baixa pelo ID
    app.put('/baixas/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const parametros = req.body;

      try {
        const changes = this.dbInstance.atualizarID('Baixas', Number(id), parametros);

        if (changes) {
          res.status(200).json({ message: 'Baixa atualizado com sucesso.' });
        } else {
          res.status(404).json({ error: 'Baixa não encontrado.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar Baixa.' });
      }
    });

    // Rota para deletar um Baixa pelo ID
    app.delete('/baixas/:id', (req: Request, res: Response) => {
      const { id } = req.params;

      try {
        const changes = this.dbInstance.deletarID('Baixas', Number(id));

        if (changes) {
          res.status(200).json({ message: 'Baixa deletado com sucesso.' });
        } else {
          res.status(404).json({ error: 'Baixa não encontrado.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar Baixa.' });
      }
    });

  }
}

export default BaixasCRUD;
