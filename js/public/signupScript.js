// 회원가입 폼 제출 이벤트 리스너 설정
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();  // 기본 폼 제출 동작을 막기 위해 호출 (페이지 리로드 방지)

  // 폼에서 입력된 값 가져오기
  const user_id = document.getElementById('user_id').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;

  // POST 요청을 통해 서버로 데이터를 전송
  const response = await fetch('/signup', {
    method: 'POST',  // HTTP 요청 메서드 POST (회원가입 데이터를 서버로 전송)
    headers: { 'Content-Type': 'application/json' },  // 요청 본문 데이터 형식을 JSON으로 설정
    body: JSON.stringify({ user_id, password, name }),  // 전송할 데이터를 JSON 문자열로 변환하여 요청 본문에 포함
  });

  // 서버 응답 처리
  if (response.ok) {  // 응답 상태가 200 OK이면 회원가입 성공
    alert('회원가입 성공!');
    window.location.href = '/login.html';  // 로그인 페이지로 이동
  } else {  // 응답 상태가 200 OK가 아니면 에러 처리
    const error = await response.json();
    alert(error.error);
  }
});
