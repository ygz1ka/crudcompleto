// GET - Busca o usuário no JSON Server, como no exemplo da aula.
document.getElementById('formLogin').addEventListener('submit', function (evento) {
    evento.preventDefault();
    fazerLogin();
});

function fazerLogin() {
    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;

    fetch('/pessoas', { method: 'GET' })
    .then(response => response.json())
    .then(dados => {
        const usuario = dados.find(pessoa => pessoa.email && pessoa.email.toLowerCase() === email && pessoa.senha === senha);
        if (usuario) {
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            window.location.href = 'bemvindo.html';
        } else {
            document.getElementById('mensagem').textContent = 'E-mail ou senha incorretos!';
        }
    })
    .catch(() => document.getElementById('mensagem').textContent = 'Erro ao conectar com o servidor.');
}
