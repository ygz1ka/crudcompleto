// Mostra o nome do usuário que entrou.
const usuarioSalvo = JSON.parse(sessionStorage.getItem('usuario') || 'null');
if (!usuarioSalvo) {
    window.location.href = 'index.html';
} else {
    document.getElementById('nomeUsuario').textContent = usuarioSalvo.nome;
    if (usuarioSalvo.admin === true) document.getElementById('linkAdmin').hidden = false;
}
document.getElementById('sair').addEventListener('click', function () {
    sessionStorage.removeItem('usuario');
    window.location.href = 'index.html';
});
