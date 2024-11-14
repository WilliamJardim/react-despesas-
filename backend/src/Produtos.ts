import { Application, Request, Response } from 'express';
import {CalcularEstoque} from './math/CalculaEstoque';

interface Produto {
  nome: string;
  precoVenda: number;
  precoCompra: number;
  descricao: string,
  tags: string
}

class ProdutosCRUD {
  private dbInstance: any;

  constructor(app: Application, dbInstance: any) {
    this.dbInstance = dbInstance;

    //Verifica se a tabela produtos existe
    if( !this.dbInstance.tabelaExiste('produtos') )
    {
      this.dbInstance.criarTabela('produtos', [
        'nome TEXT NOT NULL',
        'precoVenda DECIMAL NOT NULL',
        'precoCompra DECIMAL NOT NULL',
        'descricao TEXT',
        'tags TEXT'
      ]);

    }

    // Rota para criar um novo Produto
    app.post('/produtos', (req: Request<{}, {}, Produto>, res: Response) => {
      const { nome, precoVenda, precoCompra, descricao, tags } = req.body;

      try {
        
        this.dbInstance.inserir('produtos', [nome, precoVenda, precoCompra, descricao, tags]);

        res.status(201).json({ message: 'Produto criado com sucesso.' });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao criar Produto.' });
      }
    });

    // Rota para obter todos os Produtos
    app.get('/produtos', (req: Request, res: Response) => {
      try {
        const produtos = this.dbInstance.consultar(`SELECT * FROM produtos`);

        //Adiciona alguns dados extras
        const produtosDadosExtra = produtos.map(( produtoAtual:any )=>{
            produtoAtual['estoqueProduto'] = CalcularEstoque( dbInstance, produtoAtual.id )?.estoque;
            return produtoAtual;    
        });

        res.status(200).json(produtosDadosExtra);
      
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Produtos.' });
      }
    });

    // Rota para obter um Produto pelo ID
    app.get('/produtos/:id', (req: Request, res: Response) => {
      const { id } = req.params;

      try {
        const Produto = this.dbInstance.lerID('produtos', Number(id));

        if (Produto) {
          res.status(200).json(Produto);
        } else {
          res.status(404).json({ error: 'Produto não encontrado.' });
        }

      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Produto.' });
      }
    });

    // Rota para atualizar um Produto pelo ID
    app.put('/produtos/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const parametros = req.body;

      try {
        const changes = this.dbInstance.atualizarID('produtos', Number(id), parametros);

        if (changes) {
          res.status(200).json({ message: 'Produto atualizado com sucesso.' });
        } else {
          res.status(404).json({ error: 'Produto não encontrado.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar Produto.' });
      }
    });

    // Rota para deletar um Produto pelo ID
    app.delete('/produtos/:id', (req: Request, res: Response) => {
      const { id } = req.params;

      try {
        const changes = this.dbInstance.deletarID('produtos', Number(id));

        if (changes) {
          res.status(200).json({ message: 'Produto deletado com sucesso.' });
        } else {
          res.status(404).json({ error: 'Produto não encontrado.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar Produto.' });
      }
    });
  }
}

export default ProdutosCRUD;
