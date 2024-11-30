document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.getElementById("dropdownBtn");
    const dropdownMenu = document.getElementById("dropdown");
    const toggleArrow = document.getElementById("menuArrow");
    const rankingPrintElement = document.querySelector('.rankingPrint');
    const welcomeMessageElement = document.querySelector('#welcomeMessage');

    
    // 드롭다운 메뉴 토글
    const toggleDropdown = function () {
        dropdownMenu.classList.toggle("show");
        toggleArrow.classList.toggle("arrow");
    };

    dropdownBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleDropdown();
    });

    document.documentElement.addEventListener("click", function () {
        if (dropdownMenu.classList.contains("show")) {
            toggleDropdown();
        }
    });


    // 로그인된 사용자 정보 확인
    fetch('/api/user-info')
        .then(response => response.json())
        .then(user => {
            welcomeMessageElement.textContent = `${user.name}님, 환영합니다!`;
        })
        .catch(error => {
            console.error('사용자 정보 로드 중 오류:', error);
            welcomeMessageElement.textContent = '사용자 정보를 불러올 수 없습니다.';
        });


    // 랭킹 데이터를 가져오고 테이블에 추가하는 코드
    fetch('/api/ranking')
        .then(response => response.json())
        .then(rankings => {
            const tableBody = document.querySelector('#rankingTable tbody');
            tableBody.innerHTML = '';  // 기존 데이터를 비워서 새로 추가

            rankings.forEach((ranking, index) => {
                // 랭킹 데이터를 테이블에 추가
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${ranking.worker1_name || '미등록'}</td>
                    <td>${ranking.total_score || 0}</td>
                    <td>${ranking.workdays_in_month || 0}</td>
                    <td>${ranking.month}</td>
                    <td>${ranking.total_conversions || 0}</td>
                    `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('랭킹 데이터를 가져오는 중 오류:', error);
        });


    // 로그아웃 버튼 이벤트
    const logoutButton = document.querySelector('#logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user_id');
            window.location.href = '/login';
        });
    }
});