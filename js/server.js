const express = require('express');
const mysql = require('mysql2');
// const bcrypt = require('bcryptjs'); // 비밀번호 해싱 및 비교
const crypto = require('crypto-js');

const bodyParser = require('body-parser');
const path = require('path'); // 경로 관련 모듈

const app = express();

// JSON 데이터를 처리하기 위한 미들웨어
app.use(express.json());

// MySQL 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Manager1',
  database: 'BusinessRankingDB'
});

// Express 설정
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 로그인 페이지 제공
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 회원가입 페이지 제공
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// 로그인 API (POST)
app.post('/login', (req, res) => {
    const { user_id, password } = req.body;

    console.log('입력된 아이디:', user_id);
    console.log('입력된 비밀번호:', password);
    hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex)


    // 입력한 아이디를 기준으로 DB에서 사용자 정보 조회
    const query = 'SELECT * FROM Users WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {

        console.log("A")
        if (err) {
            console.error('로그인 DB 오류:', err);
            return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }
        console.log("A")

        // 사용자가 존재하지 않으면 아이디가 틀렸다고 응답
        if (results.length === 0) {
            return res.status(401).json({ error: '아이디가 틀렸습니다.' });
        }
        // 비밀번호가 일치하는지 확인
        const user = results[0];

        // user = {
        //   user_id: 1111,
        //   created_at: 2024-11-25T12:29:44.000Z,
        //   password: '0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c'
        // }
        //password O password_hash X

        if (user.password !== hashedPassword) {
          console.log(user.password, hashedPassword)

          return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
        }
        // 로그인 성공
        res.status(200).json({ message: '로그인 성공!' });
    });
});



// 회원가입 API (POST)
app.post('/signup', (req, res) => {
  const { user_id, password } = req.body;  // name을 user_id로 변경

  if (!user_id || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요.' });
  }

  hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex)
  
  console.log(`해싱전: ${password}`)
  console.log(`해싱후: ${hashedPassword}`)

  const query = 'INSERT INTO Users (user_id, password) VALUES (?, ?)';  // name을 user_id로 변경
  db.query(query, [user_id, hashedPassword], (err, result) => {
  if (err) {
    console.error('회원가입 DB 오류:', err);
    return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
  else{
    res.status(201).json({ message: '회원가입 성공!' });
  }
  console.log(result)
  }
)})



  // bcrypt.hash(password, 10, (err, hashedPassword) => {
  //   if (err) {
  //     console.error('비밀번호 해싱 오류:', err);
  //     return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  //   }

  //   const query = 'INSERT INTO Users (user_id, password) VALUES (?, ?)';  // name을 user_id로 변경
  //   db.query(query, [user_id, hashedPassword], (err, result) => {
  //     if (err) {
  //       console.error('회원가입 DB 오류:', err);
  //       return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  //     }

  //     res.status(201).json({ message: '회원가입 성공!' });
  //   });
    




// 서버 시작
app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중입니다.');
});
