// alunos.js

let config;

async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar configurações');
        }
        config = await response.json();
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar configurações');
    }
}

// Aguardar carregamento das configurações antes de executar qualquer operação
window.onload = async function() {
    await loadConfig();
}

// Função para buscar os alunos com base nos filtros de nome e CPF
function buscarAlunos() {
    const nome = document.getElementById('inputNome').value;
    const cpf = document.getElementById('inputCpf').value;

    if (!config) {
        alert('Configurações não foram carregadas');
        return;
    }

    let url = `http://${config.serverIp}:${config.serverPort}/alunos`;

    // Construir a URL de busca com os parâmetros necessários
    if (nome || cpf) {
        url += '?';
        if (nome) {
            url += `nome=${encodeURIComponent(nome)}&`;
        }
        if (cpf) {
            url += `cpf=${encodeURIComponent(cpf)}`;
        }
    }

    // Fazer a requisição GET para buscar os alunos
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar alunos');
            }
            return response.json();
        })
        .then(alunos => {
            // Limpar a lista de alunos atual
            const alunosList = document.getElementById('alunos-list');
            alunosList.innerHTML = '';

            // Preencher a lista com os novos alunos retornados
            alunos.forEach(aluno => {
                const row = `
                    <tr>
                        <th scope="row">${aluno.codigo_aluno}</th>
                        <td>${aluno.cpf_aluno}</td>
                        <td>${aluno.nome_aluno}</td>
                        <td>
                            <button type="button" class="btn btn-primary" onclick="abrirModalEditarAluno(${aluno.codigo_aluno}, '${aluno.nome_aluno}', '${aluno.cpf_aluno}', ${aluno.ativo})">Editar</button>
                        </td>
                    </tr>
                `;
                alunosList.innerHTML += row;
            });
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao buscar alunos');
        });
}

// Função para abrir o modal de edição de aluno
function abrirModalEditarAluno(codigoAluno, nomeAluno, cpfAluno, ativo) {
    document.getElementById('codigoAluno').value = codigoAluno;
    document.getElementById('inputNomeEdit').value = nomeAluno;
    document.getElementById('inputCpfEdit').value = cpfAluno;
    document.getElementById('checkAtivo').checked = ativo; // Marca ou desmarca o checkbox de acordo com o status de ativo
    $('#editarAlunoModal').modal('show');
}

// Função para salvar a edição de aluno
function salvarEdicaoAluno() {
    const codigoAluno = document.getElementById('codigoAluno').value;
    const nomeAluno = document.getElementById('inputNomeEdit').value;
    const cpfAluno = document.getElementById('inputCpfEdit').value;
    const ativo = document.getElementById('checkAtivo').checked;

    const url = `http://${config.serverIp}:${config.serverPort}/alunos/${codigoAluno}`;

    // Construir o corpo da requisição PUT
    const body = JSON.stringify({
        cpf_aluno: cpfAluno,
        nome_aluno: nomeAluno,
        ativo: ativo
    });

    // Fazer a requisição PUT para atualizar o aluno
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar aluno');
        }
        // Fechar o modal após o sucesso na atualização
        $('#editarAlunoModal').modal('hide');
        // Atualizar a lista de alunos após a edição
        buscarAlunos();
    })
    .catch(error => {
        console.error(error);
        alert('Erro ao atualizar aluno');
    });
}
