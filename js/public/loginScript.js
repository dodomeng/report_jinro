// 로그인 처리
const handleLogin = () => {
    const user_id = document.getElementById('user_id').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!user_id || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, password }), // user_id 전송
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('로그인 요청 실패: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);

          // 로그인 성공 시 로컬 스토리지에 사용자 정보 저장
          localStorage.setItem('user_id', user_id);
          localStorage.setItem('isLoggedIn', 'true');

          // 홈 페이지로 이동
          window.location.href = '/homePage.html';
        }
      })
      .catch(error => {
        console.error('로그인 요청 오류:', error);
        alert('로그인 중 문제가 발생했습니다. 다시 시도해주세요.');
      });
  };

  // 로그인 버튼 클릭 이벤트 연결
  document.getElementById('loginButton').addEventListener('click', handleLogin);


  // 회원가입 버튼 클릭 시 signup.html로 이동
  document.querySelector('.signup-button').addEventListener('click', () => {
    window.location.href = 'signup.html';
  });