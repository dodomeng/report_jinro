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