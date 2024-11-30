    // 페이지 로드 시 로그인 정보 확인
    window.onload = function () {
        const userInfoElement = document.getElementById('user-info');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const user_id = localStorage.getItem('user_id');

        if (isLoggedIn === 'true' && user_id) {
            // 로그인한 사용자 이름을 받아와서 환영 메시지에 포함
            fetch('/api/user-info')
                .then(response => response.json())
                .then(data => {
                    const userName = data.name;  // 사용자 이름
                    document.getElementById('welcomeMessage').innerText = `${userName}님, 환영합니다!`;
                })
                .catch(error => {
                    console.error('사용자 정보 로드 중 오류:', error);
                });
        } else {
            // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
            window.location.href = 'login.html';
        }

        //   // 페이지가 로드되면 랭킹 데이터를 자동으로 불러옵니다.
        //   loadRanking();

        // 페이지 로드 시 날짜 설정
        setTodayDate();
    };



    function setTodayDate() {
        const today = new Date();
        const month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
        const day = today.getDate();
        const formattedDate = `${month}월 ${day}일`;

        // 'todayDate'라는 ID를 가진 요소에 날짜를 출력
        document.getElementById('todayDate').textContent = formattedDate;
    }



    // 상권 데이터 (상권명과 상권 ID 매핑)
    const businessData = [
        { id: 1, name: '경상대' },
        { id: 2, name: '호탄동' },
        { id: 3, name: '과기대' },
        { id: 4, name: '평거동' },
        { id: 5, name: '상대동' },
        { id: 6, name: '하대동A' },
        { id: 7, name: '하대동B' },
        { id: 8, name: '혁신도시' }
    ];

    // 드롭다운에 상권명을 추가
    const businessSelect = document.getElementById('businessSelect');
    businessData.forEach(business => {
        const option = document.createElement('option');
        option.value = business.id; // 상권 ID를 value로 설정
        option.textContent = business.name; // 상권명을 표시
        businessSelect.appendChild(option);
    });



    fetch('/api/user-info', {
        method: 'GET',
        credentials: 'include', // 세션 쿠키 포함
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unauthorized');
            }
            return response.json();
        })
        .then(user => {
            console.log('사용자 정보:', user);
            document.getElementById('welcomeMessage').textContent = `${user.name}님, 환영합니다!`;
        })
        .catch(error => {
            console.error('사용자 정보 로드 중 오류:', error);
            document.getElementById('welcomeMessage').textContent = '사용자 정보를 불러올 수 없습니다.';
        });



    let report = "";
    function inputUpdate() {
        // 폼에서 입력값 가져오기
        // const businessArea = document.getElementById('businessArea').value;
        const visitingEstablishments = parseInt(document.getElementById('visitingEstablishments').value || 0);

        // 근무 내용
        const worker1Name = document.getElementById('worker1Name').value;
        const worker1Conversion = parseInt(document.getElementById('worker1Conversion').value || 0);
        const worker1Addition = parseInt(document.getElementById('worker1Addition').value || 0);
        const worker2Name = document.getElementById('worker2Name').value;
        const worker2Conversion = parseInt(document.getElementById('worker2Conversion').value || 0);
        const worker2Addition = parseInt(document.getElementById('worker2Addition').value || 0);

        // 전환 세부사항
        const gooddayConversion = parseInt(document.getElementById('gooddayConversion').value || 0);
        const busangalmaeConversion = parseInt(document.getElementById('busangalmaeConversion').value || 0);
        const maesilConversion = parseInt(document.getElementById('maesilConversion').value || 0);
        const whiteConversion = parseInt(document.getElementById('whiteConversion').value || 0);
        const talkseriesConversion = parseInt(document.getElementById('talkseriesConversion').value || 0);
        // 무학
        const gooddayTables = parseInt(document.getElementById('gooddayTables').value || 0);
        const busangalmaeTables = parseInt(document.getElementById('busangalmaeTables').value || 0);
        const maesilTables = parseInt(document.getElementById('maesilTables').value || 0);
        const whiteTables = parseInt(document.getElementById('whiteTables').value || 0);
        const talkseriesTables = parseInt(document.getElementById('talkseriesTables').value || 0);
        const muhakOtherTables = parseInt(document.getElementById('muhakOtherTables').value || 0);

        // 하이트진로
        const chamisulTables = parseInt(document.getElementById('chamisulTables').value || 0);
        const jinroTables = parseInt(document.getElementById('jinroTables').value || 0);
        const hitejinroOtherTables = parseInt(document.getElementById('hitejinroOtherTables').value || 0);

        // 대선주조
        const daeseonC1Tables = parseInt(document.getElementById('daeseonC1Tables').value || 0);
        const daeseonOtherTables = parseInt(document.getElementById('daeseonOtherTables').value || 0);

        // 롯데
        const saeroTables = parseInt(document.getElementById('saeroTables').value || 0);
        const cheonghaTables = parseInt(document.getElementById('cheonghaTables').value || 0);
        const lotteOtherTables = parseInt(document.getElementById('lotteOtherTables').value || 0);

        // 기타
        const otherTables = parseInt(document.getElementById('otherTables').value || 0);
        const notDrinkTables = parseInt(document.getElementById('notDrinkTables').value || 0);

        // 판촉물 사용량
        const hangoverCure = parseInt(document.getElementById('hangoverCure').value || 0);
        const tissue = parseInt(document.getElementById('tissue').value || 0);
        const jelly = parseInt(document.getElementById('jelly').value || 0);
        const coffeeCoupon = parseInt(document.getElementById('coffeeCoupon').value || 0);

        // 음용 테이블 수 계산
        const drinkTables = gooddayTables + busangalmaeTables + maesilTables + whiteTables + talkseriesTables +
            muhakOtherTables + chamisulTables + jinroTables + hitejinroOtherTables +
            daeseonC1Tables + daeseonOtherTables + saeroTables + cheonghaTables +
            lotteOtherTables + otherTables
        // 총 테이블 수 계산
        const totalTables = drinkTables + notDrinkTables;

        // 전환 테이블 계산
        const totalConversion = worker1Conversion + worker2Conversion;
        const totalAddition = worker1Addition + worker2Addition;

        // 점유비 계산을 위한 데이터 구조
        const 점유비 = {
            "무학": {
                total: gooddayTables + busangalmaeTables + maesilTables + whiteTables + talkseriesTables + muhakOtherTables,
                items: {
                    "좋은데이": gooddayTables,
                    "부산갈매기": busangalmaeTables,
                    "매실마을": maesilTables,
                    "화이트": whiteTables,
                    "톡시리즈": talkseriesTables,
                    "기타": muhakOtherTables
                }
            },
            "하이트진로": {
                total: chamisulTables + jinroTables + hitejinroOtherTables,
                items: {
                    "참이슬": chamisulTables,
                    "진로": jinroTables,
                    "기타": hitejinroOtherTables
                }
            },
            "대선주조": {
                total: daeseonC1Tables + daeseonOtherTables,
                items: {
                    "대선(C1포함)": daeseonC1Tables,
                    "기타": daeseonOtherTables
                }
            },
            "롯데": {
                total: saeroTables + cheonghaTables + lotteOtherTables,
                items: {
                    "새로": saeroTables,
                    "청하(별빛청하 포함)": cheonghaTables,
                    "기타": lotteOtherTables
                }
            },
            "기타": {
                total: otherTables,
                items: {}
            }
        }
        // 점유비 각 항목의 비율 계산
        for (let key in 점유비) {
            const category = 점유비[key];
            category.percentage = drinkTables ? ((category.total / drinkTables) * 100).toFixed(1) : '0';
            for (let item in category.items) {
                category.items[item + '_percentage'] = drinkTables ? ((category.items[item] / drinkTables) * 100).toFixed(1) : '0';
            }
        }
        // 전환율 계산
        const conversionRate = totalConversion / (drinkTables - (gooddayTables + busangalmaeTables + maesilTables + whiteTables + talkseriesTables + muhakOtherTables)) * 100;

        // 실시간 결과 업데이트
        document.getElementById('muhakPercentage').textContent = `${점유비["무학"].percentage || 0}%`;
        document.getElementById('conversionRate').textContent = `${conversionRate.toFixed(1)}%`;



        // 오늘 날짜 가져오기
        const today = new Date();
        const month = today.getMonth() + 1; // 월은 0부터 시작하므로 +1
        const day = today.getDate();
        const formattedDate = `${month}월 ${day}일`;

        const selectedBusiness = document.getElementById('businessSelect');
        const businessName = selectedBusiness.options[selectedBusiness.selectedIndex].textContent;



        // 보고서 포맷팅
        report = `< ${formattedDate} ${businessName || "상권명"} 상권보고 >

            1. 방문업소 : ${visitingEstablishments || 0}개
            2. 테이블수 : ${totalTables || 0}T (미음용 ${notDrinkTables || 0}T)
            3. 전환테이블
            가. 전환 T : ${totalConversion || 0}T 
            [${worker1Name} : ${worker1Conversion || 0}T, ${worker2Name} : ${worker2Conversion || 0}T]
            - 좋은데이 ( ${gooddayConversion || 0}T )
            - 화이트 ( ${whiteConversion || 0}T )
            - 부산갈매기 ( ${busangalmaeConversion || 0}T )
            - 매실마을 ( ${maesilConversion || 0}T )
            - 톡톡(석류/블루베리 등) ( ${talkseriesConversion || 0}T )
            - 추가 : ${totalAddition || 0}T
            [${worker1Name} : ${worker1Addition || 0}T, ${worker2Name} : ${worker2Addition || 0}T]
            4. 점유비
            가. 무학 : ${점유비["무학"].total || 0}T (${점유비["무학"].percentage || 0}%)
            - 좋은데이 : ${점유비["무학"].items["좋은데이"] || 0}T (${점유비["무학"].items["좋은데이_percentage"] || 0}%)
            - 화이트 : ${점유비["무학"].items["화이트"] || 0}T (${점유비["무학"].items["화이트_percentage"] || 0}%)
            - 부산갈매기 : ${점유비["무학"].items["부산갈매기"] || 0}T (${점유비["무학"].items["부산갈매기_percentage"] || 0}%)
            - 매실마을 : ${점유비["무학"].items["매실마을"] || 0}T (${점유비["무학"].items["매실마을_percentage"] || 0}%)
            - 톡시리즈 : ${점유비["무학"].items["톡시리즈"] || 0}T (${점유비["무학"].items["톡시리즈_percentage"] || 0}%)
            - 기타 : ${점유비["무학"].items["기타"] || 0}T (${점유비["무학"].items["기타_percentage"] || 0}%)

            나. 하이트진로 : ${점유비["하이트진로"].total || 0}T (${점유비["하이트진로"].percentage || 0}%)
            - 참이슬 : ${점유비["하이트진로"].items["참이슬"] || 0}T (${점유비["하이트진로"].items["참이슬_percentage"] || 0}%)
            - 진로 : ${점유비["하이트진로"].items["진로"] || 0}T (${점유비["하이트진로"].items["진로_percentage"] || 0}%)
            - 기타 : ${점유비["하이트진로"].items["기타"] || 0}T (${점유비["하이트진로"].items["기타_percentage"] || 0}%)

            다. 대선주조 : ${점유비["대선주조"].total || 0}T (${점유비["대선주조"].percentage || 0}%)
            - 대선(C1포함) : ${점유비["대선주조"].items["대선(C1포함)"] || 0}T (${점유비["대선주조"].items["대선(C1포함)_percentage"] || 0}%)
            - 기타 : ${점유비["대선주조"].items["기타"] || 0}T (${점유비["대선주조"].items["기타_percentage"] || 0}%)

            라. 롯데 : ${점유비["롯데"].total || 0}T (${점유비["롯데"].percentage || 0}%)
            - 새로 : ${점유비["롯데"].items["새로"] || 0}T (${점유비["롯데"].items["새로_percentage"] || 0}%)
            - 청하(별빛청하 포함) : ${점유비["롯데"].items["청하(별빛청하 포함)"] || 0}T (${점유비["롯데"].items["청하(별빛청하 포함)_percentage"] || 0}%)
            - 기타 : ${점유비["롯데"].items["기타"] || 0}T (${점유비["롯데"].items["기타_percentage"] || 0}%)

            마. 기타 : ${점유비["기타"].total || 0}T (${점유비["기타"].percentage || 0}%)

            5. 타사 판촉인원 / 판촉물 및 판촉 내용
            숙취해소제 : ${hangoverCure || 0}개 
            물티슈 : ${tissue || 0}개 
            젤리 : ${jelly || 0}개 
            커피쿠폰 : ${coffeeCoupon || 0}개 

            6. 특이사항 
            `;
    }

    // 보고서 출력
    function generateReport() {
        inputUpdate();
        document.getElementById('reportOutput').innerText = report;
    }

    // 보고서 복사 함수
    function copyReport() {
        const reportText = document.getElementById('reportOutput').innerText;
        if (!reportText) {
            alert('생성된 보고서가 없습니다.');
            return;
        }
        navigator.clipboard.writeText(reportText).then(() => {
            alert('보고서가 클립보드에 복사되었습니다.');
        }).catch(err => {
            alert('복사에 실패했습니다.');
            console.error('복사 실패:', err);
        });
    }



    // 서버로 데이터 전송하는 함수
    function sendDataToServer(data) {

        console.log('보내는 데이터:', data);  // 보내는 데이터 로그

        fetch('/submit-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),  // 전송할 데이터는 객체로 만들어서 JSON으로 변환
        })
            .then(response => response.json())
            .then(data => {
                console.log('데이터 전송 성공:', data);
                alert('데이터가 서버에 저장되었습니다.');
            })
            .catch(error => {
                console.error('데이터 전송 실패:', error);
                alert('데이터 저장에 실패했습니다.');
            });
    }



    // '업무 마감' 버튼 클릭 시 실행될 함수
    document.getElementById('submit-button').addEventListener('click', function () {
        // 입력된 값 가져오기
        const selectedBusinessId = businessSelect.value; // 상권 id
        const worker1Name = document.getElementById('worker1Name').value;
        const worker2Name = document.getElementById('worker2Name').value;
        const worker1Conversion = document.getElementById('worker1Conversion').value;
        const worker2Conversion = document.getElementById('worker2Conversion').value;

        // 서버로 전송할 데이터
        const dataToSend = {
            business_id: selectedBusinessId, // 상권 ID 전송
            worker1Name: worker1Name,
            worker2Name: worker2Name,
            worker1Conversion: worker1Conversion,
            worker2Conversion: worker2Conversion
        };

        // 데이터를 전송하는 함수 호출
        sendDataToServer(dataToSend);
    });


    
    // 이벤트 리스너 설정
    document.getElementById('generateReport').addEventListener('click', generateReport);
    document.getElementById('copyReport').addEventListener('click', copyReport);
    // document.getElementById('clearFields').addEventListener('click', clearFields);