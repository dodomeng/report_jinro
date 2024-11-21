document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        alert('로그인 성공!');
        window.location.href = '/report.html'; // 보고서 작성 페이지로 이동
    } else {
        alert('로그인 실패. 아이디와 비밀번호를 확인해주세요.');
    }
});