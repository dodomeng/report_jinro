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

-- (User_Workdays) 출근 일수 테이블 생성
CREATE TABLE IF NOT EXISTS User_Workdays (
    user_id INT NOT NULL,
    month INT NOT NULL,
    workdays INT DEFAULT 0,
    PRIMARY KEY (user_id, month),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- (Ranking_View) 랭킹 뷰 생성
CREATE VIEW Ranking_View AS
SELECT 
    u.name AS user_name,
    SUM(w.conversion_count + w.extra_count) AS total_score,  -- 전환수 + 추가수
    uw.workdays AS workdays_in_month,  -- 월별 출근 일수
    YEAR(w.record_date) * 100 + MONTH(w.record_date) AS month,  -- 월 계산
    SUM(w.conversion_count) AS total_conversions  -- 누적 전환수
FROM Work_Records w
JOIN Users u ON w.user_id = u.user_id
JOIN User_Workdays uw ON w.user_id = uw.user_id AND YEAR(w.record_date) * 100 + MONTH(w.record_date) = uw.month
GROUP BY u.user_id, YEAR(w.record_date), MONTH(w.record_date)
ORDER BY month DESC, total_score DESC;

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
    ('경대 정문'),
    ('경대 후문'),
    ('하대');

-- 예제 작업 기록 데이터 삽입
INSERT INTO Work_Records (user_id, business_id, conversion_count, extra_count, record_date)
VALUES
    ('1001', 1, 10, 5, '2024-11-01'),
    ('1002', 1, 8, 3, '2024-11-01'),
    ('1003', 2, 7, 2, '2024-11-02'),
    ('1001', 3, 12, 6, '2024-11-18'),
    ('1003', 2, 9, 4, '2024-11-19'),
    ('1002', 1, 7, 3, '2024-11-20');

-- 출근 일수(User_Workdays) 계산 및 업데이트
INSERT INTO User_Workdays (user_id, month, workdays)
SELECT
    user_id,
    YEAR(record_date) * 100 + MONTH(record_date) AS month,
    COUNT(DISTINCT record_date) AS workdays
FROM Work_Records
GROUP BY user_id, YEAR(record_date), MONTH(record_date)
ON DUPLICATE KEY UPDATE
    workdays = workdays;  -- 여기서 VALUES(workdays)를 사용하지 않고, 그냥 컬럼명 그대로 사용

-- 월급 계산 결과를 확인
SELECT * FROM Salary_Calculation;

-- 특정 사용자("김인서")의 월급 확인
SELECT salary 
FROM Salary_Calculation 
WHERE user_name = '김인서';

-- 월급 상위 5명의 사용자 리스트 출력
SELECT user_name, salary 
FROM Salary_Calculation 
ORDER BY salary DESC 
LIMIT 5;

-- 월급이 50만 원 이상인 사용자만 조회
SELECT user_name, salary 
FROM Salary_Calculation 
WHERE salary >= 500000;

SHOW columns from users;

-- 기존에 password_hash가 있었다면 이 컬럼을 수정하거나 삭제 후 새 컬럼을 추가합니다.
ALTER TABLE Users ADD COLUMN password VARCHAR(255);

ALTER TABLE Users ALTER COLUMN user_id SET DEFAULT 1;

SHOW COLUMNS FROM Users;

ALTER TABLE Users DROP COLUMN password_hash;

ALTER TABLE Users MODIFY COLUMN user_id INT AUTO_INCREMENT;

-- 1. 외래 키 제약 제거
ALTER TABLE work_records DROP FOREIGN KEY work_records_ibfk_2;
ALTER TABLE user_workdays DROP FOREIGN KEY user_workdays_ibfk_1;

-- 2. Users 테이블에서 user_id 컬럼을 AUTO_INCREMENT로 변경
ALTER TABLE Users MODIFY COLUMN user_id INT AUTO_INCREMENT;

-- 3. 외래 키 제약을 다시 추가
ALTER TABLE work_records ADD CONSTRAINT work_records_ibfk_1 FOREIGN KEY (user_id) REFERENCES Users(user_id);

SHOW CREATE TABLE work_records;

-- `name` 컬럼의 유니크 제약 조건 제거
ALTER TABLE Users DROP INDEX name;

select * from users;
