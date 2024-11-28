// let report = "";
// function inputUpdate() {
//     // 폼에서 입력값 가져오기
//     const businessArea = document.getElementById('businessArea').value;
//     const visitingEstablishments = parseInt(document.getElementById('visitingEstablishments').value || 0);

//     // 근무 내용
//     const worker1Name = document.getElementById('worker1Name').value;
//     const worker1Conversion = parseInt(document.getElementById('worker1Conversion').value || 0);
//     const worker1Addition = parseInt(document.getElementById('worker1Addition').value || 0);
//     const worker2Name = document.getElementById('worker2Name').value;
//     const worker2Conversion = parseInt(document.getElementById('worker2Conversion').value || 0);
//     const worker2Addition = parseInt(document.getElementById('worker2Addition').value || 0);

//     // 전환 세부사항
//     const gooddayConversion = parseInt(document.getElementById('gooddayConversion').value || 0);
//     const busangalmaeConversion = parseInt(document.getElementById('busangalmaeConversion').value || 0);
//     const maesilConversion = parseInt(document.getElementById('maesilConversion').value || 0);
//     const whiteConversion = parseInt(document.getElementById('whiteConversion').value || 0);
//     const talkseriesConversion = parseInt(document.getElementById('talkseriesConversion').value || 0);
//     // 무학
//     const gooddayTables = parseInt(document.getElementById('gooddayTables').value || 0);
//     const busangalmaeTables = parseInt(document.getElementById('busangalmaeTables').value || 0);
//     const maesilTables = parseInt(document.getElementById('maesilTables').value || 0);
//     const whiteTables = parseInt(document.getElementById('whiteTables').value || 0);
//     const talkseriesTables = parseInt(document.getElementById('talkseriesTables').value || 0);
//     const muhakOtherTables = parseInt(document.getElementById('muhakOtherTables').value || 0);

//     // 하이트진로
//     const chamisulTables = parseInt(document.getElementById('chamisulTables').value || 0);
//     const jinroTables = parseInt(document.getElementById('jinroTables').value || 0);
//     const hitejinroOtherTables = parseInt(document.getElementById('hitejinroOtherTables').value || 0);

//     // 대선주조
//     const daeseonC1Tables = parseInt(document.getElementById('daeseonC1Tables').value || 0);
//     const daeseonOtherTables = parseInt(document.getElementById('daeseonOtherTables').value || 0);

//     // 롯데
//     const saeroTables = parseInt(document.getElementById('saeroTables').value || 0);
//     const cheonghaTables = parseInt(document.getElementById('cheonghaTables').value || 0);
//     const lotteOtherTables = parseInt(document.getElementById('lotteOtherTables').value || 0);

//     // 기타
//     const otherTables = parseInt(document.getElementById('otherTables').value || 0);
//     const notDrinkTables = parseInt(document.getElementById('notDrinkTables').value || 0);

//     // 판촉물 사용량
//     const hangoverCure = parseInt(document.getElementById('hangoverCure').value || 0);
//     const tissue = parseInt(document.getElementById('tissue').value || 0);
//     const jelly = parseInt(document.getElementById('jelly').value || 0);
//     const coffeeCoupon = parseInt(document.getElementById('coffeeCoupon').value || 0);

//     // 음용 테이블 수 계산
//     const drinkTables = gooddayTables + busangalmaeTables + maesilTables + whiteTables + talkseriesTables +
//         muhakOtherTables + chamisulTables + jinroTables + hitejinroOtherTables +
//         daeseonC1Tables + daeseonOtherTables + saeroTables + cheonghaTables +
//         lotteOtherTables + otherTables
//     // 총 테이블 수 계산
//     const totalTables = drinkTables + notDrinkTables;

//     // 전환 테이블 계산
//     const totalConversion = worker1Conversion + worker2Conversion;
//     const totalAddition = worker1Addition + worker2Addition;

//     // 서버로 전송하기 전에 worker2Name에 대한 유효성 체크 및 전환수 업데이트 요청
//     fetch('/updateConversion', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             worker2Name: worker2Name,
//             worker2Conversion: worker2Conversion
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             console.log("근무자 2 전환수 업데이트 성공:", data);
//         } else {
//             console.error("전환수 업데이트 실패:", data.error);
//         }
//     })
//     .catch(error => {
//         console.error("서버 요청 오류:", error);
//     });

//     // 점유비 계산을 위한 데이터 구조
//     const 점유비 = {
//         "무학": {
//             total: gooddayTables + busangalmaeTables + maesilTables + whiteTables + talkseriesTables + muhakOtherTables,
//             items: {
//                 "좋은데이": gooddayTables,
//                 "부산갈매기": busangalmaeTables,
//                 "매실마을": maesilTables,
//                 "화이트": whiteTables,
//                 "톡시리즈": talkseriesTables,
//                 "기타": muhakOtherTables
//             }
//         },
//         "하이트진로": {
//             total: chamisulTables + jinroTables + hitejinroOtherTables,
//             items: {
//                 "참이슬": chamisulTables,
//                 "진로": jinroTables,
//                 "기타": hitejinroOtherTables
//             }
//         },
//         "대선주조": {
//             total: daeseonC1Tables + daeseonOtherTables,
//             items: {
//                 "대선(C1포함)": daeseonC1Tables,
//                 "기타": daeseonOtherTables
//             }
//         },
//         "롯데": {
//             total: saeroTables + cheonghaTables + lotteOtherTables,
//             items: {
//                 "새로": saeroTables,
//                 "청하(별빛청하 포함)": cheonghaTables,
//                 "기타": lotteOtherTables
//             }
//         },
//         "기타": {
//             total: otherTables,
//             items: {}
//         }
//     }
//     // 점유비 각 항목의 비율 계산
//     for (let key in 점유비) {
//         const category = 점유비[key];
//         category.percentage = drinkTables ? ((category.total / drinkTables) * 100).toFixed(1) : '0';
//         for (let item in category.items) {
//             category.items[item + '_percentage'] = drinkTables ? ((category.items[item] / drinkTables) * 100).toFixed(1) : '0';
//         }
//     }
//     // 전환율 계산
//     const conversionRate = totalConversion / (drinkTables - (gooddayTables + busangalmaeTables + maesilTables + whiteTables + talkseriesTables + muhakOtherTables)) * 100;

//     // 실시간 결과 업데이트
//     document.getElementById('muhakPercentage').textContent = `${점유비["무학"].percentage || 0}%`;
//     document.getElementById('conversionRate').textContent = `${conversionRate.toFixed(1)}%`;

//     // 오늘 날짜 가져오기
//     const today = new Date();
//     const month = today.getMonth() + 1; // 월은 0부터 시작하므로 +1
//     const day = today.getDate();
//     const formattedDate = `${month}월 ${day}일`;

//     // 보고서 포맷팅
//     report = `< ${formattedDate} ${businessArea || "상권명"} 상권보고 >

// 1. 방문업소 : ${visitingEstablishments || 0}개
// 2. 테이블수 : ${totalTables || 0}T (미음용 ${notDrinkTables || 0}T)
// 3. 전환테이블
// 가. 전환 T : ${totalConversion || 0}T 
// [${worker1Name} : ${worker1Conversion || 0}T, ${worker2Name} : ${worker2Conversion || 0}T]
// - 좋은데이 ( ${gooddayConversion || 0}T )
// - 화이트 ( ${whiteConversion || 0}T )
// - 부산갈매기 ( ${busangalmaeConversion || 0}T )
// - 매실마을 ( ${maesilConversion || 0}T )
// - 톡톡(석류/블루베리 등) ( ${talkseriesConversion || 0}T )
// - 추가 : ${totalAddition || 0}T
// [${worker1Name} : ${worker1Addition || 0}T, ${worker2Name} : ${worker2Addition || 0}T]
// 4. 점유비
// 가. 무학 : ${점유비["무학"].total || 0}T (${점유비["무학"].percentage || 0}%)
// - 좋은데이 : ${점유비["무학"].items["좋은데이"] || 0}T (${점유비["무학"].items["좋은데이_percentage"] || 0}%)
// - 화이트 : ${점유비["무학"].items["화이트"] || 0}T (${점유비["무학"].items["화이트_percentage"] || 0}%)
// - 부산갈매기 : ${점유비["무학"].items["부산갈매기"] || 0}T (${점유비["무학"].items["부산갈매기_percentage"] || 0}%)
// - 매실마을 : ${점유비["무학"].items["매실마을"] || 0}T (${점유비["무학"].items["매실마을_percentage"] || 0}%)
// - 톡시리즈 : ${점유비["무학"].items["톡시리즈"] || 0}T (${점유비["무학"].items["톡시리즈_percentage"] || 0}%)
// - 기타 : ${점유비["무학"].items["기타"] || 0}T (${점유비["무학"].items["기타_percentage"] || 0}%)

// 나. 하이트진로 : ${점유비["하이트진로"].total || 0}T (${점유비["하이트진로"].percentage || 0}%)
// - 참이슬 : ${점유비["하이트진로"].items["참이슬"] || 0}T (${점유비["하이트진로"].items["참이슬_percentage"] || 0}%)
// - 진로 : ${점유비["하이트진로"].items["진로"] || 0}T (${점유비["하이트진로"].items["진로_percentage"] || 0}%)
// - 기타 : ${점유비["하이트진로"].items["기타"] || 0}T (${점유비["하이트진로"].items["기타_percentage"] || 0}%)

// 다. 대선주조 : ${점유비["대선주조"].total || 0}T (${점유비["대선주조"].percentage || 0}%)
// - 대선(C1포함) : ${점유비["대선주조"].items["대선(C1포함)"] || 0}T (${점유비["대선주조"].items["대선(C1포함)_percentage"] || 0}%)
// - 기타 : ${점유비["대선주조"].items["기타"] || 0}T (${점유비["대선주조"].items["기타_percentage"] || 0}%)

// 라. 롯데 : ${점유비["롯데"].total || 0}T (${점유비["롯데"].percentage || 0}%)
// - 새로 : ${점유비["롯데"].items["새로"] || 0}T (${점유비["롯데"].items["새로_percentage"] || 0}%)
// - 청하(별빛청하 포함) : ${점유비["롯데"].items["청하(별빛청하 포함)"] || 0}T (${점유비["롯데"].items["청하(별빛청하 포함)_percentage"] || 0}%)
// - 기타 : ${점유비["롯데"].items["기타"] || 0}T (${점유비["롯데"].items["기타_percentage"] || 0}%)

// 마. 기타 : ${점유비["기타"].total || 0}T (${점유비["기타"].percentage || 0}%)

// 5. 타사 판촉인원 / 판촉물 및 판촉 내용
// 숙취해소제 : ${hangoverCure || 0}개 
// 물티슈 : ${tissue || 0}개 
// 젤리 : ${jelly || 0}개 
// 커피쿠폰 : ${coffeeCoupon || 0}개 

// 6. 특이사항 
// `;
//     // 보고서 출력
// }

// function generateReport() {
//     inputUpdate();
//     document.getElementById('reportOutput').innerText = report;
// }

// // 보고서 복사 함수
// function copyReport() {
//     const reportText = document.getElementById('reportOutput').innerText;
//     if (!reportText) {
//         alert('생성된 보고서가 없습니다.');
//         return;
//     }
//     navigator.clipboard.writeText(reportText).then(() => {
//         alert('보고서가 클립보드에 복사되었습니다.');
//     }).catch(err => {
//         alert('복사에 실패했습니다.');
//         console.error('복사 실패:', err);
//     });
// }

// // 이벤트 리스너 설정
// document.getElementById('generateReport').addEventListener('click', generateReport);
// document.getElementById('copyReport').addEventListener('click', copyReport);
// document.getElementById('clearFields').addEventListener('click', clearFields);

// // 페이지 로드 시 날짜 설정
// window.onload = setTodayDate;