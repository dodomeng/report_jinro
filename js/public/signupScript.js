document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user_id = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, password, name }),
    });

    if (response.ok) {
      alert('회원가입 성공!');
      window.location.href = '/login.html';  // 로그인 페이지로 이동
    } else {
      const error = await response.json();
      alert(error.error);
    }
  });