const express = require('express');
const router = express.Router();
const pool = require('./db');

/**
 * @swagger
 * tags:
 *   name: Treinos
 *   description: Operações relacionadas aos treinos dos alunos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Treino:
 *       type: object
 *       required:
 *         - codigo_aluno
 *         - nome_treino
 *         - data_ultima_execucao
 *       properties:
 *         codigo_treino:
 *           type: integer
 *         codigo_aluno:
 *           type: integer
 *         nome_treino:
 *           type: string
 *         data_ultima_execucao:
 *           type: string
 *           format: date-time
 *     Exercicio:
 *       type: object
 *       required:
 *         - codigo_treino
 *         - nome_exercicio
 *         - series
 *         - repeticoes
 *       properties:
 *         codigo_exercicio:
 *           type: integer
 *         codigo_treino:
 *           type: integer
 *         nome_exercicio:
 *           type: string
 *         series:
 *           type: integer
 *         repeticoes:
 *           type: integer
 */

/**
 * @swagger
 * /treinos:
 *   post:
 *     summary: Insere um novo treino para um aluno
 *     tags: [Treinos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Treino'
 *     responses:
 *       201:
 *         description: Treino criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Treino'
 *       500:
 *         description: Erro ao inserir treino
 */
router.post('/treinos', async (req, res) => {
    const { codigo_aluno, nome_treino, data_ultima_execucao } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO treino (codigo_aluno, nome_treino, data_ultima_execucao) VALUES ($1, $2, $3) RETURNING *',
            [codigo_aluno, nome_treino, data_ultima_execucao]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao inserir treino');
    }
});

/**
 * @swagger
 * /treinos:
 *   get:
 *     summary: Retorna uma lista de todos os treinos
 *     tags: [Treinos]
 *     responses:
 *       200:
 *         description: Lista de treinos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Treino'
 *       500:
 *         description: Erro ao buscar treinos
 */
router.get('/treinos', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM treino'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar treinos');
    }
});

/**
 * @swagger
 * /treinos/{codigo_treino}:
 *   get:
 *     summary: Retorna um treino pelo seu código
 *     tags: [Treinos]
 *     parameters:
 *       - in: path
 *         name: codigo_treino
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do treino
 *     responses:
 *       200:
 *         description: Treino encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Treino'
 *       404:
 *         description: Treino não encontrado
 *       500:
 *         description: Erro ao buscar treino
 */
router.get('/treinos/:codigo_treino', async (req, res) => {
    const { codigo_treino } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM treino WHERE codigo_treino = $1',
            [codigo_treino]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Treino não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar treino');
    }
});

/**
 * @swagger
 * /treinos/{codigo_treino}:
 *   put:
 *     summary: Atualiza um treino existente
 *     tags: [Treinos]
 *     parameters:
 *       - in: path
 *         name: codigo_treino
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do treino a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Treino'
 *     responses:
 *       200:
 *         description: Treino atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Treino'
 *       404:
 *         description: Treino não encontrado
 *       500:
 *         description: Erro ao atualizar treino
 */
router.put('/treinos/:codigo_treino', async (req, res) => {
    const { codigo_treino } = req.params;
    const { codigo_aluno, nome_treino, data_ultima_execucao } = req.body;
    try {
        const result = await pool.query(
            'UPDATE treino SET codigo_aluno = $1, nome_treino = $2, data_ultima_execucao = $3 WHERE codigo_treino = $4 RETURNING *',
            [codigo_aluno, nome_treino, data_ultima_execucao, codigo_treino]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Treino não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar treino');
    }
});

/**
 * @swagger
 * /treinos/{codigo_treino}:
 *   delete:
 *     summary: Remove um treino existente
 *     tags: [Treinos]
 *     parameters:
 *       - in: path
 *         name: codigo_treino
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do treino a ser removido
 *     responses:
 *       204:
 *         description: Treino removido com sucesso
 *       404:
 *         description: Treino não encontrado
 *       500:
 *         description: Erro ao remover treino
 */
router.delete('/treinos/:codigo_treino', async (req, res) => {
    const { codigo_treino } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM treino WHERE codigo_treino = $1',
            [codigo_treino]
        );
        if (result.rowCount > 0) {
            res.sendStatus(204);
        } else {
            res.status(404).send('Treino não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao remover treino');
    }
});

/**
 * @swagger
 * /treinos/{codigo_treino}/executar:
 *   put:
 *     summary: Atualiza a data de última execução de um treino para a data atual
 *     tags: [Treinos]
 *     parameters:
 *       - in: path
 *         name: codigo_treino
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do treino a ser atualizado
 *     responses:
 *       200:
 *         description: Data de última execução atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Treino'
 *       404:
 *         description: Treino não encontrado
 *       500:
 *         description: Erro ao atualizar data de última execução do treino
 */
router.put('/treinos/:codigo_treino/executar', async (req, res) => {
    const { codigo_treino } = req.params;
    try {
        // Atualiza a data de última execução para a data e hora atuais
        const result = await pool.query(
            'UPDATE treino SET data_ultima_execucao = NOW() WHERE codigo_treino = $1 RETURNING *',
            [codigo_treino]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Treino não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar data de última execução do treino');
    }
});

/**
 * @swagger
 * /treinos/exercicios/{cpf_aluno}:
 *   get:
 *     summary: Retorna todos os treinos e exercícios de um aluno pelo CPF
 *     tags: [Treinos]
 *     parameters:
 *       - in: path
 *         name: cpf_aluno
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do aluno
 *     responses:
 *       200:
 *         description: Lista de treinos e exercícios encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   treino:
 *                     $ref: '#/components/schemas/Treino'
 *                   exercicios:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Exercicio'
 *       404:
 *         description: Aluno não encontrado ou não possui treinos
 *       500:
 *         description: Erro ao buscar treinos e exercícios do aluno
 */
router.get('/treinos/exercicios/:cpf_aluno', async (req, res) => {
    const { cpf_aluno } = req.params;
    try {
        // Primeiro, buscamos o código do aluno pelo CPF
        const alunoResult = await pool.query(
            'SELECT codigo_aluno FROM aluno WHERE cpf_aluno = $1',
            [cpf_aluno]
        );

        if (alunoResult.rows.length === 0) {
            return res.status(404).send('Aluno não encontrado');
        }

        const codigo_aluno = alunoResult.rows[0].codigo_aluno;

        // Agora buscamos os treinos e seus exercícios associados ao aluno
        const treinosResult = await pool.query(
            'SELECT * FROM treino WHERE codigo_aluno = $1',
            [codigo_aluno]
        );

        // Para cada treino encontrado, buscamos os exercícios associados
        const treinosComExercicios = await Promise.all(
            treinosResult.rows.map(async (treino) => {
                const exerciciosResult = await pool.query(
                    'SELECT * FROM exercicio WHERE codigo_treino = $1',
                    [treino.codigo_treino]
                );
                return {
                    treino,
                    exercicios: exerciciosResult.rows
                };
            })
        );

        res.json(treinosComExercicios);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar treinos e exercícios do aluno');
    }
});

module.exports = router;
