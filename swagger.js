const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Treino Aluno API',
            version: '1.0.0',
            description: 'API para gerenciar treinos de alunos',
        },
        servers: [
            {
                url: 'http://localhost:3062',
            },
        ],
    },
    apis: ['./index.js'], // arquivos com anotações Swagger
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
