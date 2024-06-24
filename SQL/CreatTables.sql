CREATE TABLE aluno (
    codigo_aluno SERIAL PRIMARY KEY,
    nome_aluno VARCHAR(100) NOT NULL,    
    cpf_aluno character varying(20) NOT NULL,
    ativo boolean DEFAULT true,
);

CREATE TABLE treino (
    codigo_treino SERIAL PRIMARY KEY,
    codigo_aluno integer,
    nome_treino character varying(100) NOT NULL,
    data_ultima_execucao timestamp without time zone NOT NULL,
    ativo boolean DEFAULT true,
);

CREATE TABLE exercicio (
    codigo_execicio SERIAL PRIMARY KEY,
    codigo_treino integer,
    exercicio character varying(100) NOT NULL,
    series character varying(100)  NOT NULL,
    repeticoes character varying(100)  NOT NULL,
    ativo boolean DEFAULT true,
);
