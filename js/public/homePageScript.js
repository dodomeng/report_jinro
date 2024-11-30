// 페이지 로드 시 로그인 정보 확인
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user_id = localStorage.getItem('user_id');

    if (isLoggedIn === 'true' && user_id) {
        document.getElementById('welcomeMessage').innerText = `${user_id}님, 환영합니다!`;
    } else {
        // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
        window.location.href = 'login.html';
    }
};

// 로그아웃 함수
function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}