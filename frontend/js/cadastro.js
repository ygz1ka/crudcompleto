// POST - Usa fetch, JSON.stringify e .then(), igual ao código da aula.
document.getElementById('formCadastro').addEventListener('submit', function (evento) {
    evento.preventDefault();
    enviarDados();
});
function enviarDados() {
    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    const rua = document.getElementById('rua').value.trim();
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const cidade = document.getElementById('cidade').value.trim();
    const estado = document.getElementById('estado').value.trim().toUpperCase();
    const telefone = document.getElementById('telefone').value.trim();
    const mensagem = document.getElementById('mensagem');
    if (cpf.length !== 11 || cep.length !== 8 || estado.length !== 2) {
        mensagem.textContent = 'CPF deve ter 11 dígitos, CEP 8 dígitos e estado 2 letras.';
        return;
    }
    fetch('/pessoas')
    .then(response => response.json())
    .then(dados => {
        if (dados.some(pessoa => pessoa.cpf === cpf || (pessoa.email || '').toLowerCase() === email)) {
            mensagem.textContent = 'Já existe cadastro com este CPF ou e-mail.';
            return;
        }
        fetch('/pessoas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, sobrenome, cpf, email, senha, rua, cep, cidade, estado, telefone, admin: false })
        })
        .then(response => response.json())
        .then(() => {
            alert('Cadastro realizado! Faça seu login.');
            window.location.href = 'index.html';
        })
        .catch(() => mensagem.textContent = 'Erro ao cadastrar.');
    })
    .catch(() => mensagem.textContent = 'Erro ao acessar o servidor.');
}
