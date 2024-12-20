# report_jinro

db 구조
Table Users {
  user_id VARCHAR(255) [pk, unique]  // 사용자 ID는 기본 키
  name VARCHAR(255)                 // 사용자 이름
  password_hash VARCHAR(255)        // 비밀번호 해시값
  created_at TIMESTAMP              // 가입 일자
}

Table Businesses {
  business_id INT [pk, increment]  // 상권 ID는 자동 증가
  name VARCHAR(255) [unique]       // 상권 이름
}

Table Work_Records {
  record_id INT [pk, increment]         // 기록 ID는 자동 증가
  user_id INT                           // 사용자 ID (FK to Users.user_id)
  business_id INT                       // 상권 ID (FK to Businesses.business_id)
  conversion_count INT                  // 전환 수
  extra_count INT                       // 추가 수
  record_date DATE                      // 작업 날짜
  created_at TIMESTAMP                  // 기록 생성 일자
  worker1_name VARCHAR(255)            // 작업자 1 이름
  worker2_name VARCHAR(255)            // 작업자 2 이름
  worker1_conversion INT               // 작업자 1 전환 수
  worker2_conversion INT               // 작업자 2 전환 수
}

Table User_Workdays {
  user_id INT                           // 사용자 ID (FK to Users.user_id)
  month INT                             // 월 정보 (YYYYMM 형식)
  workdays INT                          // 출근 일수
}

Table Ranking_View {
  worker_name VARCHAR(255)             // 작업자 이름
  total_score INT                      // 전환수 합산
  workdays_in_month INT                // 월별 출근 일수
  month INT                            // 월 정보 (YYYYMM 형식)
  latest_record_date DATE              // 가장 최신 기록 날짜
}

Table Salary_Calculation {
  user_name VARCHAR(255)               // 사용자 이름
  salary INT                           // 월급 계산 결과
}

Ref: Work_Records.user_id > Users.user_id
Ref: Work_Records.business_id > Businesses.business_id
Ref: User_Workdays.user_id > Users.user_id

// Ranking_View 설명
// - worker_name은 Work_Records의 worker1_name과 worker2_name을 조합하여 생성됩니다.
// - workdays_in_month은 Work_Records에서 날짜별 DISTINCT 값을 계산합니다.
// - 뷰 정의는 아래와 같습니다:
//
// CREATE OR REPLACE VIEW Ranking_View AS
// SELECT 
//     worker_name,  
//     SUM(worker_conversion) AS total_score,  
//     COUNT(DISTINCT DATE(record_date)) AS workdays_in_month,  
//     YEAR(record_date) * 100 + MONTH(record_date) AS month,  
//     MAX(record_date) AS latest_record_date  
// FROM (
//     SELECT worker1_name AS worker_name, worker1_conversion AS worker_conversion, record_date, business_id, user_id
//     FROM Work_Records
//     UNION
//     SELECT worker2_name AS worker_name, worker2_conversion AS worker_conversion, record_date, business_id, user_id
//     FROM Work_Records
// ) AS combined_worknames
// GROUP BY worker_name, YEAR(record_date), MONTH(record_date)
// ORDER BY total_score DESC;

// Salary_Calculation 설명
// - Salary_Calculation은 Users와 User_Workdays를 기반으로 월급을 계산합니다.
// - 뷰 정의는 아래와 같습니다:
//
// CREATE VIEW Salary_Calculation AS
// SELECT 
//     u.name AS user_name,
//     CASE
//         WHEN DAY(CURRENT_DATE) <= 17 THEN 
//             (uw.workdays - IFNULL((
//                 SELECT workdays 
//                 FROM User_Workdays 
//                 WHERE user_id = u.user_id 
//                   AND month = (YEAR(CURRENT_DATE) * 100 + MONTH(CURRENT_DATE) - 1)
//             ), 0)) * 39000
//         ELSE 
//             uw.workdays * 39000
//     END AS salary
// FROM Users u
// JOIN User_Workdays uw 
//     ON u.user_id = uw.user_id
// WHERE uw.month = YEAR(CURRENT_DATE) * 100 + MONTH(CURRENT_DATE);
