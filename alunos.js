const express = require('express');
const router = express.Router();
const pool = require('./db');

/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: Operações relacionadas aos alunos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       required:
 *         - cpf_aluno
 *         - nome_aluno
 *       properties:
 *         codigo_aluno:
 *           type: integer
 *         cpf_aluno:
 *           type: string
 *         nome_aluno:
 *           type: string
 *         ativo:
 *           type: boolean
 */

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Insere um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       500:
 *         description: Erro ao inserir aluno
 */
router.post('/alunos', async (req, res) => {
    const { cpf_aluno, nome_aluno } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO aluno (cpf_aluno, nome_aluno) VALUES ($1, $2) RETURNING *',
            [cpf_aluno, nome_aluno]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao inserir aluno');
    }
});

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Retorna uma lista de alunos com opções de filtro
 *     tags: [Alunos]
 *     parameters:
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtra alunos ativos (true) ou inativos (false)
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra alunos pelo nome (busca parcial)
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         description: Filtra alunos pelo CPF
 *     responses:
 *       200:
 *         description: Lista de alunos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 *       500:
 *         description: Erro ao buscar alunos
 */
router.get('/alunos', async (req, res) => {
    const { ativo, nome, cpf } = req.query;

    let query = `
        SELECT codigo_aluno, cpf_aluno, nome_aluno, ativo
        FROM aluno
    `;
    const params = [];
    const conditions = [];

    if (ativo !== undefined) {
        params.push(ativo === 'true');
        conditions.push(`ativo = $${params.length}`);
    }
    if (nome) {
        params.push(`%${nome}%`);
        conditions.push(`nome_aluno ILIKE $${params.length}`);
    }
    if (cpf) {
        params.push(cpf);
        conditions.push(`cpf_aluno = $${params.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY nome_aluno`; // Ordena por nome_aluno

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar alunos');
    }
});

/**
 * @swagger
 * /alunos/{codigo_aluno}:
 *   get:
 *     summary: Retorna um aluno pelo seu código
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: codigo_aluno
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro ao buscar aluno
 */
router.get('/alunos/:codigo_aluno', async (req, res) => {
    const { codigo_aluno } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM aluno WHERE codigo_aluno = $1',
            [codigo_aluno]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Aluno não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar aluno');
    }
});

/**
 * @swagger
 * /alunos/{codigo_aluno}:
 *   put:
 *     summary: Atualiza um aluno existente
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: codigo_aluno
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do aluno a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro ao atualizar aluno
 */
router.put('/alunos/:codigo_aluno', async (req, res) => {
    const { codigo_aluno } = req.params;
    const { cpf_aluno, nome_aluno, ativo } = req.body;
    try {
        const result = await pool.query(
            'UPDATE aluno SET cpf_aluno = $1, nome_aluno = $2, ativo = $3 WHERE codigo_aluno = $4 RETURNING *',
            [cpf_aluno, nome_aluno, ativo, codigo_aluno]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Aluno não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar aluno');
    }
});

/**
 * @swagger
 * /alunos/{codigo_aluno}:
 *   delete:
 *     summary: Remove um aluno existente
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: codigo_aluno
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do aluno a ser removido
 *     responses:
 *       204:
 *         description: Aluno removido com sucesso
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro ao remover aluno
 */
router.delete('/alunos/:codigo_aluno', async (req, res) => {
    const { codigo_aluno } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM aluno WHERE codigo_aluno = $1',
            [codigo_aluno]
        );
        if (result.rowCount > 0) {
            res.sendStatus(204);
        } else {
            res.status(404).send('Aluno não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao remover aluno');
    }
});

/**
 * @swagger
 * /alunos/cpf/{cpf_aluno}:
 *   get:
 *     summary: Retorna um aluno pelo seu CPF
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: cpf_aluno
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro ao buscar aluno
 */
router.get('/alunos/cpf/:cpf_aluno', async (req, res) => {
    const { cpf_aluno } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM aluno WHERE cpf_aluno = $1',
            [cpf_aluno]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Aluno não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar aluno');
    }
});

module.exports = router;
