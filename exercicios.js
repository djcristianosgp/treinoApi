const express = require('express');
const router = express.Router();
const pool = require('./db');

/**
 * @swagger
 * tags:
 *   name: Exercícios
 *   description: Operações relacionadas aos exercícios dos treinos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercicio:
 *       type: object
 *       required:
 *         - codigo_treino
 *         - exercicio
 *         - series
 *         - repeticoes
 *       properties:
 *         codigo_exercicio:
 *           type: integer
 *         codigo_treino:
 *           type: integer
 *         exercicio:
 *           type: string
 *         series:
 *           type: string
 *         repeticoes:
 *           type: string
 */

/**
 * @swagger
 * /exercicios:
 *   post:
 *     summary: Insere um novo exercício em um treino
 *     tags: [Exercícios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercicio'
 *     responses:
 *       201:
 *         description: Exercício criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercicio'
 *       500:
 *         description: Erro ao inserir exercício
 */
router.post('/exercicios', async (req, res) => {
    const { codigo_treino, exercicio, series, repeticoes } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO exercicio (treino, exercicio, series, repeticoes) VALUES ($1, $2, $3, $4) RETURNING *',
            [codigo_treino, exercicio, series, repeticoes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao inserir exercício');
    }
});

/**
 * @swagger
 * /exercicios:
 *   get:
 *     summary: Retorna uma lista de todos os exercícios
 *     tags: [Exercícios]
 *     responses:
 *       200:
 *         description: Lista de exercícios encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercicio'
 *       500:
 *         description: Erro ao buscar exercícios
 */
router.get('/exercicios', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM exercicio'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar exercícios');
    }
});

/**
 * @swagger
 * /exercicios/{codigo_exercicio}:
 *   get:
 *     summary: Retorna um exercício pelo seu código
 *     tags: [Exercícios]
 *     parameters:
 *       - in: path
 *         name: codigo_exercicio
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do exercício
 *     responses:
 *       200:
 *         description: Exercício encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercicio'
 *       404:
 *         description: Exercício não encontrado
 *       500:
 *         description: Erro ao buscar exercício
 */
router.get('/exercicios/:codigo_exercicio', async (req, res) => {
    const { codigo_exercicio } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM exercicio WHERE codigo_execicio = $1',
            [codigo_exercicio]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Exercício não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar exercício');
    }
});

/**
 * @swagger
 * /exercicios/{codigo_exercicio}:
 *   put:
 *     summary: Atualiza um exercício existente
 *     tags: [Exercícios]
 *     parameters:
 *       - in: path
 *         name: codigo_exercicio
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do exercício a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercicio'
 *     responses:
 *       200:
 *         description: Exercício atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercicio'
 *       404:
 *         description: Exercício não encontrado
 *       500:
 *         description: Erro ao atualizar exercício
 */
router.put('/exercicios/:codigo_exercicio', async (req, res) => {
    const { codigo_exercicio } = req.params;
    const { codigo_treino, exercicio, series, repeticoes } = req.body;
    try {
        const result = await pool.query(
            'UPDATE exercicio SET treino = $1, exercicio = $2, series = $3, repeticoes = $4 WHERE codigo_execicio = $5 RETURNING *',
            [codigo_treino, exercicio, series, repeticoes, codigo_exercicio]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Exercício não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar exercício');
    }
});

/**
 * @swagger
 * /exercicios/exercicios_treino/{codigo_treino}:
 *   get:
 *     summary: Retorna uma lista de exercícios de um treino específico
 *     tags: [Exercícios]
 *     parameters:
 *       - in: path
 *         name: codigo_treino
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do treino para buscar exercícios
 *     responses:
 *       200:
 *         description: Lista de exercícios do treino encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercicio'
 *       404:
 *         description: Nenhum exercício encontrado para o treino especificado
 *       500:
 *         description: Erro ao buscar exercícios do treino
 */
router.get('/exercicios/exercicios_treino/:codigo_treino', async (req, res) => {
    const { codigo_treino } = req.params;    
    try {
        console.log(codigo_treino);
        const result = await pool.query(
            'SELECT * FROM exercicio WHERE codigo_treino = $1',
            [codigo_treino]
        );
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).send('Nenhum exercício encontrado para o treino especificado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar exercícios do treino');
    }
});

/**
 * @swagger
 * /exercicios/{codigo_exercicio}:
 *   delete:
 *     summary: Remove um exercício existente
 *     tags: [Exercícios]
 *     parameters:
 *       - in: path
 *         name: codigo_exercicio
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do exercício a ser removido
 *     responses:
 *       204:
 *         description: Exercício removido com sucesso
 *       404:
 *         description: Exercício não encontrado
 *       500:
 *         description: Erro ao remover exercício
 */
router.delete('/exercicios/:codigo_exercicio', async (req, res) => {
    const { codigo_exercicio } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM exercicio WHERE codigo_execicio = $1',
            [codigo_exercicio]
        );
        if (result.rowCount > 0) {
            res.sendStatus(204);
        } else {
            res.status(404).send('Exercício não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao remover exercício');
    }
});

module.exports = router;
