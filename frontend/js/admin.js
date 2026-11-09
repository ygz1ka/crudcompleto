// CRUD do professor: GET, busca por CPF, PUT e DELETE.
// Para a atividade escolar, a verificação de administrador acontece na página.
const logado = JSON.parse(sessionStorage.getItem('usuario') || 'null');
if (!logado || logado.admin !== true) {
    window.location.replace('index.html');
} else {
    mostrarDados();
}

document.getElementById('sair').addEventListener('click', function () {
    sessionStorage.removeItem('usuario');
    window.location.href = 'index.html';
});
document.getElementById('btnBuscar').addEventListener('click', buscarDados);
document.getElementById('btnTodos').addEventListener('click', function () {
    document.getElementById('cpfBusca').value = '';
    mostrarDados();
});
document.getElementById('btnLimpar').addEventListener('click', function () {
    document.getElementById('formEditar').reset();
});
document.getElementById('formEditar').addEventListener('submit', function (evento) {
    evento.preventDefault();
    atualizarDados();
});

function mostrarDados() {
    fetch('/pessoas', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        const tabela = document.getElementById('tabela-corpo');
        tabela.innerHTML = '';
        document.getElementById('total').textContent = data.length;
        data.forEach(pessoa => {
            const linha = document.createElement('tr');
            // textContent está impedindo que os dados cadastrados sejam interpretados como HTML.
            [pessoa.id, pessoa.nome + ' ' + pessoa.sobrenome, pessoa.cpf, pessoa.email, pessoa.cidade].forEach(valor => {
                const coluna = document.createElement('td');
                coluna.textContent = valor;
                linha.appendChild(coluna);
            });
            const acoes = document.createElement('td');
            const editar = document.createElement('button');
            editar.textContent = 'Editar';
            editar.className = 'table-edit';
            editar.onclick = () => preencherCampos(pessoa);
            const apagar = document.createElement('button');
            apagar.textContent = 'Apagar';
            apagar.className = 'table-delete';
            apagar.onclick = () => deletarDados(pessoa.id);
            acoes.append(editar, apagar);
            linha.appendChild(acoes);
            tabela.appendChild(linha);
        });
    })
    .catch(() => document.getElementById('mensagem').textContent = 'Erro ao buscar os usuários.');
}

function buscarDados() {
    const cpf = document.getElementById('cpfBusca').value.replace(/\D/g, '');
    if (!cpf) { mostrarDados(); return; }
    fetch('/pessoas', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        const pessoaEncontrada = data.find(pessoa => pessoa.cpf === cpf);
        if (pessoaEncontrada) {
            preencherCampos(pessoaEncontrada);
            document.getElementById('mensagem').textContent = 'Usuário encontrado. Campos de edição preenchidos.';
        } else {
            document.getElementById('mensagem').textContent = 'CPF não encontrado.';
        }
    });
}

function preencherCampos(pessoa) {
    const campos = ['id', 'nome', 'sobrenome', 'cpf', 'email', 'senha', 'rua', 'cep', 'cidade', 'estado', 'telefone'];
    campos.forEach(campo => {
        const nomeCampo = campo === 'id' ? 'id' : campo + 'Atualizar';
        document.getElementById(nomeCampo).value = pessoa[campo] || '';
    });
    document.getElementById('formEditar').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function atualizarDados() {
    const id = document.getElementById('id').value;
    if (!id) { alert('Busque ou selecione um usuário primeiro.'); return; }
    const pegar = campo => document.getElementById(campo + 'Atualizar').value.trim();
    const nome = pegar('nome'), sobrenome = pegar('sobrenome');
    const cpf = pegar('cpf').replace(/\D/g, ''), email = pegar('email').toLowerCase();
    const senha = pegar('senha'), rua = pegar('rua');
    const cep = pegar('cep').replace(/\D/g, ''), cidade = pegar('cidade');
    const estado = pegar('estado').toUpperCase(), telefone = pegar('telefone');
    if (cpf.length !== 11 || cep.length !== 8 || estado.length !== 2) {
        alert('Confira o CPF, CEP e estado.'); return;
    }
    // Busca o registro para conservar a propriedade admin que já existia.
    fetch('/pessoas/' + id)
    .then(response => response.json())
    .then(antigo => fetch('/pessoas/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, sobrenome, cpf, email, senha, rua, cep, cidade, estado, telefone, admin: antigo.admin === true })
    }))
    .then(response => response.json())
    .then(() => {
        document.getElementById('formEditar').reset();
        document.getElementById('mensagem').textContent = 'Usuário atualizado!';
        mostrarDados();
    })
    .catch(() => alert('Erro ao atualizar usuário.'));
}

function deletarDados(id) {
    if (String(id) === String(logado.id)) { alert('Não apague sua própria conta enquanto estiver conectado.'); return; }
    if (!confirm('Deseja realmente apagar este usuário?')) return;
    fetch('/pessoas/' + id, { method: 'DELETE' })
    .then(response => {
        if (!response.ok) throw new Error('Falha ao excluir');
        document.getElementById('mensagem').textContent = 'Usuário apagado!';
        mostrarDados();
    })
    .catch(() => alert('Erro ao apagar usuário.'));
}
