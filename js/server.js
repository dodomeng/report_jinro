const express = require('express');
const app = express();
const mysql = require('mysql2');
const path = require('path');

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Manager1', // MySQL 비밀번호 입력
    database: 'BusinessRankingDB'
});

connection.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err.stack);
        return;
    }
    console.log('데이터베이스 연결 성공');
});

// 정적 파일 제공 (HTML, CSS, JS 등)
app.use(express.static(path.join(__dirname, 'public')));

// /login.html 경로 처리
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 로그인 POST 요청 처리 (임시로 예시 추가)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // 로그인 처리 로직을 추가합니다.
    // 예시로 username과 password를 검증하는 코드 작성
    res.send('로그인 처리 로직');
});

// 서버 실행
app.listen(3000, () => {
    console.log('서버주소(Ctrl + Rclick): http://localhost:3000');
});
