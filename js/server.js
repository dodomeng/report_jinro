// const bcrypt = require('bcryptjs'); // 비밀번호 해싱 및 비교
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


const cors = require('cors');
app.use(cors());  // 모든 도메인에서의 요청을 허용

// JSON 데이터를 처리하기 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));



// MySQL 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Manager1',
  database: 'BusinessRankingDB'
});




//===============================GET===============================
// 로그인 페이지 제공
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 회원가입 페이지 제공
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

//인덱스 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homePage.html'));
  // res.redirect("/login")
});




//==============================POST===============================
// 로그인 API (POST)
app.post('/login', (req, res) => {
  const { user_id, password } = req.body;

  console.log('입력된 아이디:', user_id);
  console.log('입력된 비밀번호:', password);

  // 입력한 아이디를 기준으로 DB에서 사용자 정보 조회
  const query = 'SELECT * FROM Users WHERE user_id = ?';
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('로그인 DB 오류:', err);
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    // 사용자가 존재하지 않으면 아이디가 틀렸다고 응답
    if (results.length === 0) {
      return res.status(401).json({ error: '아이디가 틀렸습니다.' });
    }
    const user = results[0];

    // 비밀번호가 일치하는지 확인
    if (user.password !== password) {
      console.log(user.password, password)

      return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
    }
    // 로그인 성공
    res.status(200).json({ message: '로그인 성공!' });
  });
});




//==============================POST===============================
// 회원가입 API (POST)
app.post('/signup', (req, res) => {
  const { name, user_id, password } = req.body;  // name을 user_id로 변경

  if (!user_id || !password) {
    console.log("qwqw");
    return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요.' });

  }

  console.log(`해싱전: ${password}`)

  const query = 'INSERT INTO Users (name, user_id, password) VALUES (?, ?, ?)';
  db.query(query, [name, user_id, password], (err, result) => {
    if (err) {
      console.error('회원가입 DB 오류:', err);
      return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
    }
    else {
      res.status(201).json({ message: '회원가입 성공!' });
    }
    console.log(result)
  });
});



// // server.js에 추가할 랭킹 API
// app.get('/api/ranking', (req, res) => {
//   const query = 'SELECT * FROM Ranking_View ORDER BY total_score DESC';

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('랭킹 조회 중 오류:', err);
//       return res.status(500).json({ error: '랭킹 데이터를 가져오는 중 오류가 발생했습니다.' });
//     }
//     res.json(results);
//   });
// });


// 사용자 정보 API
app.get('/api/user-info', (req, res) => {
  // 예시로 로그인된 사용자의 정보를 localStorage에서 가져오는 것으로 가정
  const user_id = req.session.user_id; // 세션에서 user_id 가져오기

  if (!user_id) {
    console.log("user_id가 존재하지 않음");  // 디버깅용 로그
    return res.status(401).json({ error: '로그인 필요' });
  }

  // DB에서 사용자 정보 조회 (예: user_id로 조회)
  const query = 'SELECT * FROM Ranking_View ORDER BY total_score DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('랭킹 조회 중 오류:', err);
      return res.status(500).json({ error: '랭킹 데이터를 가져오는 중 오류가 발생했습니다.' });
    }

    res.json(results);  // 랭킹 데이터를 클라이언트로 반환
  });
});

// '업무 마감' 버튼 클릭 시 실행되는 함수
app.post('/submit-report', (req, res) => {

  // 요청 본문을 확인하기 위한 로그
  console.log('요청 받은 데이터:', req.body);

  const { worker1Name, worker2Name, worker1Conversion, worker2Conversion, business_id } = req.body;

  if (!worker1Name || !worker2Name || !worker1Conversion || !worker2Conversion || !business_id) {
    return res.status(400).json({ error: '모든 필드를 입력하세요.' });
  }

  // DB에 데이터 삽입
  const query = 'INSERT INTO Work_Records (worker1_name, worker2_name, worker1_conversion, worker2_conversion, business_id, record_date) VALUES (?, ?, ?, ?, ?, NOW())';

  db.query(query, [worker1Name, worker2Name, worker1Conversion, worker2Conversion, business_id], (err, result) => {
    if (err) {
      console.error('DB 오류:', err);
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    res.status(201).json({ message: '데이터가 성공적으로 저장되었습니다.' });
  });
});



var listener = app.listen(8000, function () {
  console.log(`서버가 ${listener.address().port} 포트에서 시작됩니다!\n링크: http://localhost:${listener.address().port}`); //Listening on port 8888
});