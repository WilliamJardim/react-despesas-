import { Application, Request, Response } from 'express';

interface Despesa {
  id: number,
  nome: string,
  tipo: string,
  categoria: string,
  nivel: string,
  descricao: string,
  valor: number
}

class DespesasCRUD {
  private dbInstance: any;

  constructor(app: Application, dbInstance: any) {
    this.dbInstance = dbInstance;

    //Verifica se a tabela despesas existe
    if( !this.dbInstance.tabelaExiste('despesas') )
    {
      this.dbInstance.criarTabela('despesas', [
        'nome      VARCHAR(60) NOT NULL',
        'tipo      VARCHAR(50) NOT NULL',
        'categoria VARCHAR(30) NOT NULL',
        'nivel     TEXT',
        'descricao TEXT NOT NULL',
        'valor     DECIMAL'
      ]);

    }

    // Rota para criar uma nova despesa
    app.post('/despesas', (req: Request<{}, {}, Despesa>, res: Response) => {
      const nome       = req.body.nome!;
      const tipo       = req.body.tipo!;
      const categoria  = req.body.categoria!;
      const nivel      = req.body.nivel!;
      const descricao  = req.body.descricao!;
      const valor      = req.body.valor!;
      
      try {

        this.dbInstance.inserir('despesas', [nome, tipo, categoria, nivel, descricao, valor]);

        res.status(201).json({ message: 'Despesa criada com sucesso.' });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao criar Despesa.', codigoErro: error });
      }
    });

    // Rota para obter todos os despesas
    app.get('/despesas', (req: Request, res: Response) => {
      try {
        const despesas = this.dbInstance.consultar(`SELECT * FROM despesas`);

        res.status(200).json(despesas);
      
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar despesas.' });
      }
    });

    // Rota para obter uma Despesa pelo ID
    app.get('/despesas/:id', (req: Request, res: Response) => {
      const { id } = req.params;

      try {
        const Despesa = this.dbInstance.lerID('despesas', Number(id));

        if (Despesa) {
          res.status(200).json(Despesa);
        } else {
          res.status(404).json({ error: 'Despesa não encontrado.' });
        }

      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Despesa.' });
      }
    });

    // Rota para atualizar uma Despesa pelo ID
    app.put('/despesas/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const parametros = req.body;

      try {
        const changes = this.dbInstance.atualizarID('despesas', Number(id), parametros);

        if (changes) {
          res.status(200).json({ message: 'Despesa atualizado com sucesso.' });
        } else {
          res.status(404).json({ error: 'Despesa não encontrado.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar Despesa.' });
      }
    });

    // Rota para deletar uma Despesa pelo ID
    app.delete('/despesas/:id', (req: Request, res: Response) => {
      const { id } = req.params;

      try {
        const changes = this.dbInstance.deletarID('despesas', Number(id));

        if (changes) {
          res.status(200).json({ message: 'Despesa deletado com sucesso.' });
        } else {
          res.status(404).json({ error: 'Despesa não encontrado.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar Despesa.' });
      }
    });

  }
}

export default DespesasCRUD;
