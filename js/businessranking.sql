	-- DB 생성
	CREATE DATABASE IF NOT EXISTS BusinessRankingDB;
	USE BusinessRankingDB;



	-- (Users) 사용자 테이블 생성 (user_id를 사용자가 지정)
	CREATE TABLE IF NOT EXISTS Users (
		user_id INT NOT NULL PRIMARY KEY,  -- 사용자 ID는 사용자가 지정
		name VARCHAR(255) UNIQUE NOT NULL,  -- 사용자 이름
		password_hash VARCHAR(255) NOT NULL,  -- 비밀번호 해시값
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 가입 일자
		UNIQUE (user_id)  -- user_id는 중복되지 않도록 설정
	);



	-- (Businesses) 상권 테이블 생성
	CREATE TABLE IF NOT EXISTS Businesses (
		business_id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) UNIQUE NOT NULL
	);



	-- (Work_Records) 작업 기록 테이블 생성
	CREATE TABLE IF NOT EXISTS Work_Records (
		record_id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		business_id INT NOT NULL,
		conversion_count INT DEFAULT 0,
		extra_count INT DEFAULT 0,
		record_date DATE NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
		FOREIGN KEY (business_id) REFERENCES Businesses(business_id) ON DELETE CASCADE,
		UNIQUE (user_id, business_id, record_date)
	);

	ALTER TABLE Work_Records
	ADD COLUMN worker1_name VARCHAR(255),
	ADD COLUMN worker2_name VARCHAR(255),
	ADD COLUMN worker1_conversion INT DEFAULT 0,
	ADD COLUMN worker2_conversion INT DEFAULT 0;



	-- (User_Workdays) 출근 일수 테이블 생성
	CREATE TABLE IF NOT EXISTS User_Workdays (
		user_id INT NOT NULL,
		month INT NOT NULL,
		workdays INT DEFAULT 0,
		PRIMARY KEY (user_id, month),
		FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
	);



	-- 뷰 생성
	CREATE OR REPLACE VIEW Ranking_View AS
	SELECT 
		COALESCE(u1.name, w.worker1_name) AS worker1_name,  -- worker1_name이 Users 테이블과 일치하면 그 값을 사용, 아니면 클라이언트 값 그대로
		COALESCE(u2.name, w.worker2_name) AS worker2_name,  -- worker2_name이 Users 테이블과 일치하면 그 값을 사용, 아니면 클라이언트 값 그대로
		SUM(w.worker1_conversion + w.worker2_conversion) AS total_score,  -- worker1, worker2의 전환수 합산
		COALESCE(ANY_VALUE(uw.workdays), 0) AS workdays_in_month,  -- 월별 출근 일수, 없으면 0으로 설정
		YEAR(w.record_date) * 100 + MONTH(w.record_date) AS month,  -- 월 계산
		SUM(w.worker1_conversion) + SUM(w.worker2_conversion) AS total_conversions,  -- 누적 전환수
		MAX(w.record_date) AS latest_record_date  -- 가장 최신 기록 날짜
	FROM Work_Records w
	LEFT JOIN Users u1 ON w.worker1_name = u1.name  -- worker1_name과 Users 테이블의 name을 비교하여 일치하는 user 찾기
	LEFT JOIN Users u2 ON w.worker2_name = u2.name  -- worker2_name과 Users 테이블의 name을 비교하여 일치하는 user 찾기
	LEFT JOIN User_Workdays uw ON w.user_id = uw.user_id AND YEAR(w.record_date) * 100 + MONTH(w.record_date) = uw.month  -- 출근 일수 포함
	GROUP BY YEAR(w.record_date), MONTH(w.record_date), w.worker1_name, w.worker2_name
	ORDER BY total_score DESC;



	-- (Salary_Calculation) 월급 계산 뷰 생성
	CREATE VIEW Salary_Calculation AS
	SELECT 
		u.name AS user_name,
		CASE
			WHEN DAY(CURRENT_DATE) <= 17 THEN 
				(uw.workdays - IFNULL((
					SELECT workdays 
					FROM User_Workdays 
					WHERE user_id = u.user_id 
					  AND month = (YEAR(CURRENT_DATE) * 100 + MONTH(CURRENT_DATE) - 1)
				), 0)) * 39000
			ELSE 
				uw.workdays * 39000
		END AS salary
	FROM Users u
	JOIN User_Workdays uw 
		ON u.user_id = uw.user_id
	WHERE uw.month = YEAR(CURRENT_DATE) * 100 + MONTH(CURRENT_DATE);



	-- 예제 사용자 데이터 삽입
	INSERT INTO Users (user_id, password_hash, name) 
	VALUES 
		('1001', SHA2('1001', 256), '김인서'),
		('1002', SHA2('1002', 256), '노도균'),
		('1003', SHA2('1003', 256), '배정우');

	-- 예제 상권 데이터 삽입
	INSERT INTO Businesses (name) 
	VALUES
		('경상대'),
		('호탄동'),
		('과기대'),
		('평거동'),
		('상대동'),
		('하대동A'),
		('하대동B'),
		('혁신도시');

	INSERT INTO Businesses (business_id, name) VALUES (1, '경상대');
	INSERT INTO Businesses (business_id, name) VALUES (2, '호탄동');
	INSERT INTO Businesses (business_id, name) VALUES (3, '과기대');
	INSERT INTO Businesses (business_id, name) VALUES (4, '평거동');
	INSERT INTO Businesses (business_id, name) VALUES (5, '상대동');
	INSERT INTO Businesses (business_id, name) VALUES (6, '하대동A');
	INSERT INTO Businesses (business_id, name) VALUES (7, '하대동B');
	INSERT INTO Businesses (business_id, name) VALUES (8, '혁신도시');

	-- 예제 작업 기록 데이터 삽입
	INSERT INTO Work_Records (user_id, business_id, conversion_count, extra_count, record_date)
	VALUES
		('1001', 1, 10, 5, '2024-11-01'),
		('1002', 1, 8, 3, '2024-11-01'),
		('1003', 2, 7, 2, '2024-11-02'),
		('1001', 3, 12, 6, '2024-11-18'),
		('1003', 2, 9, 4, '2024-11-19'),
		('1002', 1, 7, 3, '2024-11-20');


	-- 추가 예정 기능
	-- -- 출근 일수(User_Workdays) 계산 및 업데이트
	-- INSERT INTO User_Workdays (user_id, month, workdays)
	-- SELECT
	-- 	user_id,
	-- 	YEAR(record_date) * 100 + MONTH(record_date) AS month,
	-- 	COUNT(DISTINCT record_date) AS workdays
	-- FROM Work_Records
	-- GROUP BY user_id, YEAR(record_date), MONTH(record_date)
	-- ON DUPLICATE KEY UPDATE
	-- 	workdays = workdays;  -- 여기서 VALUES(workdays)를 사용하지 않고, 그냥 컬럼명 그대로 사용

	-- -- 월급 계산 결과를 확인
	-- SELECT * FROM Salary_Calculation;

	-- -- 특정 사용자("김인서")의 월급 확인
	-- SELECT salary 
	-- FROM Salary_Calculation 
	-- WHERE user_name = '김인서';

	-- -- 월급 상위 5명의 사용자 리스트 출력
	-- SELECT user_name, salary 
	-- FROM Salary_Calculation 
	-- ORDER BY salary DESC 
	-- LIMIT 5;

	-- -- 월급이 50만 원 이상인 사용자만 조회
	-- SELECT user_name, salary 
	-- FROM Salary_Calculation 
	-- WHERE salary >= 500000;

	-- SHOW columns from users;



	-- 기존에 password_hash가 있었다면 이 컬럼을 수정하거나 삭제 후 새 컬럼을 추가합니다.
	ALTER TABLE Users ADD COLUMN password VARCHAR(255);

	ALTER TABLE Users ALTER COLUMN user_id SET DEFAULT 1;

	SHOW COLUMNS FROM Users;

	ALTER TABLE Users DROP COLUMN password_hash;

	ALTER TABLE Users MODIFY COLUMN user_id INT AUTO_INCREMENT;

	select * from users;



	-- 사용자 ID가 1001인 사용자가 경상대에서 15개의 전환수와 8개의 추가 수를 기록한 경우
	INSERT INTO Work_Records (user_id, business_id, conversion_count, extra_count, record_date)
	VALUES
		(1001, 1, 15, 8, '2024-11-25');

	-- 사용자 ID가 1002인 사용자가 호탄동에서 10개의 전환수와 5개의 추가 수를 기록한 경우
	INSERT INTO Work_Records (user_id, business_id, conversion_count, extra_count, record_date)
	VALUES
		(1002, 2, 10, 5, '2024-11-25');

	-- 사용자 ID가 1003인 사용자가 과기대에서 20개의 전환수와 7개의 추가 수를 기록한 경우
	INSERT INTO Work_Records (user_id, business_id, conversion_count, extra_count, record_date)
	VALUES
		(1003, 3, 20, 7, '2024-11-25');

	-- 사용자 ID가 1001인 사용자의 2024년 11월 출근 일수를 10일로 추가
	INSERT INTO User_Workdays (user_id, month, workdays)
	VALUES
		(1001, 202411, 10)
	ON DUPLICATE KEY UPDATE workdays = 10;

	-- 사용자 ID가 1002인 사용자의 2024년 11월 출근 일수를 12일로 추가
	INSERT INTO User_Workdays (user_id, month, workdays)
	VALUES
		(1002, 202411, 12)
	ON DUPLICATE KEY UPDATE workdays = 12;

	-- 사용자 ID가 1003인 사용자의 2024년 11월 출근 일수를 15일로 추가
	INSERT INTO User_Workdays (user_id, month, workdays)
	VALUES
		(1003, 202411, 15)
	ON DUPLICATE KEY UPDATE workdays = 15;