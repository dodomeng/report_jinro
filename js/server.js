const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path'); // 경로 관련 모듈 추가

const app = express();

// JSON 데이터를 처리하기 위한 미들웨어
app.use(express.json());

// MySQL 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // MySQL 사용자명
  password: 'Manager1',  // MySQL 비밀번호
  database: 'BusinessRankingDB'
});

// Express 설정
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // 정적 파일 제공

// 로그인 페이지 제공 (GET)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login'));
});

// 회원가입 페이지 제공 (GET)
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup'));
});

// 로그인 API (POST)
// 로그인 API (POST)
// 로그인 API (POST)
app.post('/login', (req, res) => {
    const { name, password } = req.body;

    console.log('입력된 이름:', name);
    console.log('입력된 비밀번호:', password);
    console.log('DB에서 가져온 사용자 정보:', results);

    // 입력한 이름을 기준으로 DB에서 사용자 정보 조회
    const query = 'SELECT * FROM Users WHERE name = ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('로그인 DB 오류:', err);
            return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }

        // 사용자가 존재하지 않으면 로그인 실패
        if (results.length === 0) {
            return res.status(401).json({ error: '아이디나 비밀번호가 일치하지 않습니다.' });
        }

        // 비밀번호가 평문일 경우 직접 비교
        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ error: '아이디나 비밀번호가 일치하지 않습니다.' });
        }

        // 로그인 성공
        res.status(200).json({ message: '로그인 성공!' });
    });
});

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // 사용자 확인 쿼리
//   db.query('SELECT * FROM Users WHERE name = ?', [username], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
//     }

//     if (results.length === 0) {
//       return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
//     }

//     const user = results[0];

//     // 비밀번호 확인
//     bcrypt.compare(password, user.password_hash, (err, isMatch) => {
//       if (err) {
//         return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
//       }

//       if (!isMatch) {
//         return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
//       }

//       // 로그인 성공
//       res.status(200).json({ message: '로그인 성공!' });
//     });
//   });
// });

// 회원가입 API (POST)



// 회원가입 API (POST)
app.post('/signup', (req, res) => {
    const { name, password } = req.body;  // user_id는 입력받지 않음

    console.log('이름:', name);
    console.log('비밀번호:', password); // 평문 비밀번호 확인

    // 평문 비밀번호를 그대로 DB에 저장
    const query = 'INSERT INTO Users (name, password) VALUES (?, ?)';
    db.query(query, [name, password], (err, result) => {
        if (err) {
            console.error('회원가입 DB 오류:', err);
            return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
        }
    res.status(201).json({ message: '회원가입 성공!' });
});

});

// app.post('/signup', (req, res) => {
//     const { name, password } = req.body;  // user_id는 입력받지 않음
  
//     // 비밀번호 해싱
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) {
//         console.error('비밀번호 해싱 오류:', err); // 해싱 오류 디버깅
//         return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
//       }
  
//       console.log('이름:', name);
//         console.log('해시된 비밀번호:', hashedPassword);

//       // 해시된 비밀번호와 함께 데이터를 DB에 저장
//       const query = 'INSERT INTO Users (name, password) VALUES (?, ?)';
//       console.log('쿼리 실행 전:', name, hashedPassword); // 쿼리 실행 전 확인
      
//       db.query('INSERT INTO Users (name, password_hash) VALUES (?, ?)', [name, hashedPassword], (err, result) => {
//         if (err) {
//             console.error('회원가입 DB 오류:', err); // 상세 오류 로그
//             return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
//         }
//         // 회원가입 성공
//         res.status(201).json({ message: '회원가입 성공!' });
//       });
//     });
//   });
  
// app.post('/signup', (req, res) => {
//   const { user_id, password, name } = req.body;

//   // 비밀번호 해싱
//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//       return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
//     }

//     // 사용자 추가 쿼리
//     db.query('INSERT INTO Users (user_id, password_hash, name) VALUES (?, ?, ?)', [user_id, hashedPassword, name], (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
//       }

//       // 회원가입 성공
//       res.status(201).json({ message: '회원가입 성공!' });
//     });
//   });
// });

// 서버 시작
app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중입니다.');
});
