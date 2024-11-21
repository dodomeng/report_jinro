let report = "";
function inputUpdate() {
    // 폼에서 입력값 가져오기
    const businessArea = document.getElementById('businessArea').value;
    const visitingEstablishments = parseInt(document.getElementById('visitingEstablishments').value || 0);

    const worker1Name = document.getElementById('worker1Name').value;
    const worker1Conversion = parseInt(document.getElementById('worker1Conversion').value || 0);
    const worker1Addition = parseInt(document.getElementById('worker1Addition').value || 0);

    const worker2Name = document.getElementById('worker2Name').value;
    const worker2Conversion = parseInt(document.getElementById('worker2Conversion').value || 0);
    const worker2Addition = parseInt(document.getElementById('worker2Addition').value || 0);

    const goodDayTables = parseInt(document.getElementById('goodDayTables').value || 0);
    const busanTables = parseInt(document.getElementById('busanTables').value || 0);
    const maesilTables = parseInt(document.getElementById('maesilTables').value || 0);
    const whiteTables = parseInt(document.getElementById('whiteTables').value || 0);
    const talkSeriesTables = parseInt(document.getElementById('talkSeriesTables').value || 0);
    const muhakOtherTables = parseInt(document.getElementById('muhakOtherTables').value || 0);
    const chamisulTables = parseInt(document.getElementById('chamisulTables').value || 0);
    const jinroTables = parseInt(document.getElementById('jinroTables').value || 0);
    const hitejinroOtherTables = parseInt(document.getElementById('hitejinroOtherTables').value || 0);
    const daeseonC1Tables = parseInt(document.getElementById('daeseonC1Tables').value || 0);
    const daeseonOtherTables = parseInt(document.getElementById('daeseonOtherTables').value || 0);
    const saeroTables = parseInt(document.getElementById('saeroTables').value || 0);
    const cheonghaTables = parseInt(document.getElementById('cheonghaTables').value || 0);
    const lotteOtherTables = parseInt(document.getElementById('lotteOtherTables').value || 0);
    const otherTables = parseInt(document.getElementById('otherTables').value || 0);
    const notTables = parseInt(document.getElementById('notTables').value || 0);

    const hangoverCure = parseInt(document.getElementById('hangoverCure').value || 0);
    // 음용 테이블 수 계산
    const drinkTables = goodDayTables + busanTables + maesilTables + whiteTables + talkSeriesTables +
        muhakOtherTables + chamisulTables + jinroTables + hitejinroOtherTables +
        daeseonC1Tables + daeseonOtherTables + saeroTables + cheonghaTables +
        lotteOtherTables + otherTables
    // 총 테이블 수 계산
    const totalTables = drinkTables + notTables;

    // 전환 테이블 계산
    const totalConversion = worker1Conversion + worker2Conversion;
    const totalAddition = worker1Addition + worker2Addition;

    // 점유비 계산을 위한 데이터 구조
    const 점유비 = {
        "무학": {
            total: goodDayTables + busanTables + maesilTables + whiteTables + talkSeriesTables + muhakOtherTables,
            items: {
                "좋은데이": goodDayTables,
                "부산갈매기": busanTables,
                "매실마을": maesilTables,
                "화이트": whiteTables,
                "톡시리즈": talkSeriesTables,
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
    const conversionRate = totalConversion / (drinkTables - (goodDayTables + busanTables + maesilTables + whiteTables + talkSeriesTables + muhakOtherTables)) * 100;

    // 실시간 결과 업데이트
    document.getElementById('muhakPercentage').textContent = `${점유비["무학"].percentage || 0}%`;
    document.getElementById('conversionRate').textContent = `${conversionRate.toFixed(1)}%`;

    // 오늘 날짜 가져오기
    const today = new Date();
    const month = today.getMonth() + 1; // 월은 0부터 시작하므로 +1
    const day = today.getDate();
    const formattedDate = `${month}월 ${day}일`;

    // 보고서 포맷팅
    report = `< ${formattedDate} ${businessArea || "상권명"} 상권보고 >

1. 방문업소 : ${visitingEstablishments || 0}개
2. 테이블수 : ${totalTables || 0}T (미음용 ${notTables || 0}T)
3. 전환테이블
가. 전환 T : ${totalConversion || 0}T 
[${worker1Name} : ${worker1Conversion || 0}T, ${worker2Name} : ${worker2Conversion || 0}T]
- 좋은데이 ( ${goodDayTables || 0}T )
- 화이트 ( ${whiteTables || 0}T )
- 부산갈매기 ( ${busanTables || 0}T )
- 매실마을 ( ${maesilTables || 0}T )
- 톡톡(석류/블루베리 등) ( ${talkSeriesTables || 0}T )
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

6. 특이사항 
`;
    // 보고서 출력
}

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

// 입력 필드 초기화 함수
function clearFields() {
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        if (input.id !== 'date') {
            input.value = '';
        }
    });
    document.getElementById('reportOutput').textContent = '';
}
// 마우스 스크롤 시 이벤트 
document.addEventListener('wheel', function (event) {
    if (event.deltaY > 0) {
        document.getElementById("top").style.position = "fixed";
        document.getElementById("top").style.top = "0px"; // 제목 폼을 top 0 으로 고정
        document.getElementById("bottom1").style.position = "fixed";
        document.getElementById("bottom1").style.bottom = "0px"; // 보고서 생성 폼을 bottom 0으로 고정
    }
});


// 이벤트 리스너 설정
document.getElementById('generateReport').addEventListener('click', generateReport);
document.getElementById('copyReport').addEventListener('click', copyReport);
document.getElementById('clearFields').addEventListener('click', clearFields);

// 페이지 로드 시 날짜 설정
window.onload = setTodayDate;

