// db.js
const mysql = require('mysql2');

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'localhost', // MySQL 서버 주소
    user: 'root',      // MySQL 사용자
    password: 'Manager1', // MySQL 비밀번호
    database: 'BusinessRankingDB' // 사용할 데이터베이스
});

// 연결 확인
connection.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err);
        return;
    }
    console.log('데이터베이스에 연결되었습니다.');
});

module.exports = connection; // 다른 파일에서 사용할 수 있도록 내보냄
