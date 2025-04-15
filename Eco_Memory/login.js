document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    window.location.href = 'jogo.html';  
});
  