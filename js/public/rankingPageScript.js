
document.addEventListener('DOMContentLoaded', function () {
    const rankingData = [
        { user: "사용자 A", conversionRate: 78 },
        { user: "사용자 B", conversionRate: 65 },
        { user: "사용자 C", conversionRate: 88 },
        { user: "사용자 D", conversionRate: 55 },
        { user: "사용자 E", conversionRate: 90 },
        { user: "사용자 F", conversionRate: 72 },
        { user: "사용자 G", conversionRate: 80 },
        { user: "사용자 H", conversionRate: 68 },
        { user: "사용자 I", conversionRate: 92 },
        { user: "사용자 J", conversionRate: 84 }
    ];

    rankingData.sort((a, b) => b.conversionRate - a.conversionRate);

    const top5RankingData = rankingData.slice(0, 5);

    const rankingList = document.getElementById('rankingList');

    top5RankingData.forEach((data, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>순위: ${index + 1}</span>
            <span>사용자: ${data.user}</span>
            <span>전환율: ${data.conversionRate}%</span>
        `;
        rankingList.appendChild(listItem);
    });
});


// document.addEventListener('DOMContentLoaded', function () {
//     // 서버에서 데이터를 가져옴
//     fetch('/api/rankings')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json(); // JSON 데이터를 파싱
//         })
//         .then(data => {
//             // 랭킹 리스트 생성
//             const rankingList = document.getElementById('rankingList');
//             data.forEach((item, index) => {
//                 const listItem = document.createElement('li');
//                 listItem.innerHTML = `
//                     <span>순위: ${index + 1}</span>
//                     <span>사용자: ${item.user}</span>
//                     <span>전환율: ${item.conversionRate}%</span>
//                 `;
//                 rankingList.appendChild(listItem);
//             });
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
// });
