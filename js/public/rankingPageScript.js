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

        // 중복된 작업자를 합산하기 위한 객체
        const workers = {};

        rankings.forEach((ranking, index) => {
            // worker_name에 대한 처리
            if (ranking.worker_name) {
                if (!workers[ranking.worker_name]) {
                    workers[ranking.worker_name] = {
                        worker_name: ranking.worker_name,
                        total_score: 0,
                        workdays_in_month: 0,
                        months: new Set()
                    };
                }

                // 점수와 출근일수 합산
                workers[ranking.worker_name].total_score += ranking.total_score || 0;
                workers[ranking.worker_name].workdays_in_month += ranking.workdays_in_month || 0;
                workers[ranking.worker_name].months.add(ranking.month);
            }
        });

        // 총점 기준으로 정렬
        const sortedWorkers = Object.values(workers).sort((a, b) => b.total_score - a.total_score);

        // 정렬된 데이터를 테이블에 추가
        sortedWorkers.forEach((worker, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${worker.worker_name}</td>
                <td>${parseInt(worker.total_score)}</td>
                <td>${worker.workdays_in_month}</td>
                <td>${parseInt(worker.total_score)}</td> <!-- 추후 누적 점수로 구현 예정 -->
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