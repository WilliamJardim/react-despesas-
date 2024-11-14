"use strict";
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
class DatabaseManager {
    constructor(dbPath) {
        // Define o caminho do banco de dados
        this.dbPath = path.join(__dirname, dbPath) || path.join(__dirname, 'database.db');
        // Verifica se o arquivo do banco existe
        const dbExists = fs.existsSync(this.dbPath);
        // Abre o banco de dados (ou cria um novo, caso não exista)
        this.db = new Database(this.dbPath);
        // Se o banco foi recém-criado, cria uma tabela de exemplo
        if (!dbExists) {
            // Cria um arquivo vazio
            fs.writeFileSync(this.dbPath, '');
        }
        else {
            console.log('Banco de dados carregado com sucesso.');
        }
    }
    consultar(code, parametros = []) {
        const editor = this.db.prepare(code);
        const resposta = editor.all(...parametros); // Usa `all` para obter os dados
        return resposta; // O resultado é um array de objetos JSON
    }
    tabelaExiste(nomeTabela) {
        const dadosUltimoRegistro = this.consultar(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND 
              name='${nomeTabela}';
     `);
        return dadosUltimoRegistro.length > 0 ? true : false;
    }
    criarTabela(nomeTabela, campos) {
        this.db.exec(`
      CREATE TABLE ${String(nomeTabela)} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ${String(campos)}
      );
    `);
    }
    rodar(code, parametros = []) {
        const editor = this.db.prepare(code);
        const resposta = editor.run(...parametros);
        return resposta;
    }
    inserir(nomeTabela, dados) {
        //Obter id
        let dadosUltimoRegistro = this.consultar(`
      select * from sqlite_sequence where name == '${nomeTabela}' 
    `);
        if (dadosUltimoRegistro.length == 0) {
            dadosUltimoRegistro = [
                {
                    seq: 0
                }
            ];
        }
        const dadosTratados = [];
        for (let i = 0; i < dados.length; i++) {
            dadosTratados.push(`'${dados[i]}'`);
        }
        const parametrosEmLinha = String(dadosTratados).replace('[', '').replace(']', '');
        this.rodar(`insert into ${nomeTabela} 
                       values (${Number(dadosUltimoRegistro[0]['seq']) + 1}, ${String(dadosTratados).replace('[', '').replace(']', '')})`);
    }
    // Método para ler um usuário pelo ID
    lerID(tabela, id) {
        const editor = this.db.prepare(`SELECT * FROM ${tabela} WHERE id = ?`);
        return editor.get(id);
    }
    // Método para deletar um usuário pelo ID
    deletarID(tabela, id) {
        const editor = this.db.prepare(`DELETE FROM ${tabela} WHERE id = ?`);
        const resposta = editor.run(id);
        return resposta.changes;
    }
    // Método para atualizar um usuário pelo ID
    atualizarID(tabela, id, parametros = {}) {
        const parametrosAtualizar = Object.keys(parametros)
            .map((nomeParametro, indice) => { return nomeParametro + ' = ? '; });
        const editor = this.db.prepare(`UPDATE ${tabela} SET ${String(parametrosAtualizar)} WHERE id = ?`);
        const resposta = editor.run([...Object.values(parametros), id]);
        return resposta.changes;
    }
}
// Exporta a classe DatabaseManager
module.exports = DatabaseManager;
