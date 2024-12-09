 // const bcrypt = require('bcryptjs'); // 비밀번호 해싱 및 비교
 const express = require('express');
 const session = require('express-session'); // 세션 관리 모듈 불러오기
 const app = express(); // Express 애플리케이션 인스턴스 생성
 const mysql = require('mysql2'); // MySQL 연결을 위한 mysql2 모듈 불러오기
 const path = require('path'); // 파일 및 디렉토리 경로 처리 모듈
 const bodyParser = require('body-parser'); // 요청 본문(body) 파싱을 위한 모듈
 const cors = require('cors'); // CORS 설정 모듈 불러오기

 // CORS 설정: Cross-Origin 요청을 처리할 수 있도록 설정
 app.use(cors({
   origin: function (origin, callback) { // 요청의 출처(origin)를 검사
     // 추가적인 도메인도 허용하거나, development 환경에서만 허용할 수 있도록 설정
     if (!origin || origin === 'http://localhost:8000') {
       return callback(null, true); // CORS 허용
     }
     // 그 외의 origin에서 요청이 오면 오류 발생
     return callback(new Error('Not allowed by CORS'));
   },
   methods: ['GET', 'POST'], // 허용할 HTTP 메서드 설정 (GET, POST만 허용)
   credentials: true, // 인증 정보를 포함한 요청을 허용 (세션, 쿠키 사용을 위해 허용)
 }));

 // JSON 데이터를 처리하기 위한 미들웨어
 app.use(express.json()); // 클라이언트로부터 오는 JSON 데이터를 자동으로 파싱
 app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

 // 정적 파일 제공
 app.use(express.static(path.join(__dirname, 'public'))); // 'public' 폴더 내의 파일을 정적 파일로 제공



 // MySQL 연결
 const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'Manager1',
   database: 'BusinessRankingDB'
 });



 app.use(session({
   secret: 'secret-key',  // 세션 암호화를 위한 키
   resave: false,             // 세션 데이터가 변경되지 않아도 저장 여부
   saveUninitialized: true,   // 초기화되지 않은 세션 저장 여부
   cookie: {
     secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서는 true
     httpOnly: true,        // 클라이언트에서 쿠키 접근 방지
     maxAge: 1000 * 60 * 60 // 쿠키 만료 시간 설정 (1시간)
   }
 }));



 //===============================GET===============================
 // 로그인 페이지 제공
 app.get('/login', (req, res) => {
   // 클라이언트에게 'public' 폴더 내의 'login.html' 파일을 전송
   res.sendFile(path.join(__dirname, 'public', 'login.html'));
 });

 // 회원가입 페이지 제공
 app.get('/signup', (req, res) => {
  // 클라이언트에게 'public' 폴더 내의 'signup.html' 파일을 전송
   res.sendFile(path.join(__dirname, 'public', 'signup.html'));
 });

 //인덱스 페이지
 app.get('/', (req, res) => {
  // 클라이언트에게 'public' 폴더 내의 'homePage.html' 파일을 전송
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

     req.session.user_id = user.user_id;
     console.log('로그인 성공: 세션에 user_id 저장됨:', req.session.user_id);

     // 로그인 성공
     res.status(200).json({ message: '로그인 성공!' });
   });
 });




 //==============================POST===============================
 // 회원가입 API (POST)
 app.post('/signup', (req, res) => {
  // 클라이언트가 보낸 데이터에서 name, user_id, password 값을 가져옴
   const { name, user_id, password } = req.body;

   if (!user_id || !password) {
     return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요.' });
   }

   // SQL 쿼리: 회원 정보를 Users 테이블에 삽입
   const query = 'INSERT INTO Users (name, user_id, password) VALUES (?, ?, ?)';
   db.query(query, [name, user_id, password], (err, result) => {
     if (err) {
       console.error('회원가입 DB 오류:', err);
       return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
     }
     else {
       res.status(201).json({ message: '회원가입 성공!' });
     }
     console.log(result) // 디버깅용 로그
   });
 });



 //===============================GET===============================
 // 사용자 정보 API
 app.get('/api/user-info', (req, res) => {
   console.log('세션 정보:', req.session); // 디버깅용 로그

   // 1. 세션에서 `user_id`가 존재하지 않을 경우, 로그인 필요 응답
   if (!req.session.user_id) {
     console.log("user_id가 존재하지 않음");  // 디버깅용 로그
     return res.status(401).json({ error: '로그인 필요' });
   }

   // 2. `user_id`를 기준으로 DB에서 사용자 정보를 조회하는 SQL 쿼리
   const query = 'SELECT name FROM users WHERE user_id = ?';
   db.query(query, [req.session.user_id], (err, results) => {
     // 쿼리 실행 중 오류가 발생한 경우
     if (err) {
       console.error('사용자 정보 조회 중 오류:', err);
       // "상태 코드 500: 에러 메시지" 반환
       return res.status(500).json({ error: '사용자 정보를 가져오는 중 오류가 발생했습니다.' });
     }

     // 쿼리 결과가 비어 있는 경우 (user_id가 DB에 없는 경우)
     if (results.length === 0) {
       // "상태 코드 404: 에러 메시지" 반환
       return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
     }

     // 3. 사용자 정보가 정상적으로 조회된 경우, JSON 형식으로 응답
     res.json({ name: results[0].name });
   });
 });



 //===============================GET===============================
 // 랭킹 API
 app.get('/api/ranking', (req, res) => {
   // Ranking_View 테이블에서 점수를 기준으로 내림차순 정렬하여 랭킹 데이터를 조회
   const query = 'SELECT * FROM Ranking_View ORDER BY total_score DESC';

   // 데이터베이스에서 쿼리 실행
   db.query(query, (err, results) => {
     if (err) {
       console.error('랭킹 조회 중 오류:', err);
       return res.status(500).json({ error: '랭킹 데이터를 가져오는 중 오류가 발생했습니다.' });
     }
     // 쿼리 실행이 성공적으로 완료되면 랭킹 데이터를 클라이언트에 JSON 형식으로 반환
     res.json(results);
   });
 });



 //==============================POST===============================
 // '업무 마감' 버튼 클릭 시 실행되는 함수
 app.post('/submit-report', (req, res) => {

   // 요청 본문을 확인하기 위한 로그
   console.log('요청 받은 데이터:', req.body);

   // 클라이언트에서 전송된 데이터에서 필요한 값 추출
   const { worker1Name, worker2Name, worker1Conversion, worker2Conversion, business_id } = req.body;

   // 필수 값이 누락되면 "400: 오류 메시지" 반환
   if (!worker1Name || !worker2Name || !worker1Conversion || !worker2Conversion || !business_id) {
     return res.status(400).json({ error: '모든 필드를 입력하세요.' });
   }

   // DB에 데이터 삽입하는 쿼리
   const query = 'INSERT INTO Work_Records (worker1_name, worker2_name, worker1_conversion, worker2_conversion, business_id, record_date) VALUES (?, ?, ?, ?, ?, NOW())';

   // 데이터베이스 쿼리 실행
   db.query(query, [worker1Name, worker2Name, worker1Conversion, worker2Conversion, business_id], (err, result) => {
     if (err) {
       console.error('DB 오류:', err);
       return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
     }
     res.status(201).json({ message: '데이터가 성공적으로 저장되었습니다.' });
   });
 });


 // 서버 실행
 var listener = app.listen(8000, function () {
   console.log(`서버가 ${listener.address().port} 포트에서 시작됩니다!\n링크: http://localhost:${listener.address().port}`);
 });