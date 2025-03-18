// database/import-postcodes.js
const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./config');

async function importPostcodes() {
  console.log('호주 우편번호 데이터 가져오기 시작...');
  
  // CSV 파일 경로
  const csvFilePath = './database/australian_postcodes.csv';
  
  // 중복 방지를 위한 Set
  const processedLocations = new Set();
  // 배치 처리를 위한 배열
  let batch = [];
  // 카운터
  let totalProcessed = 0;
  let totalInserted = 0;
  
  // 데이터베이스 연결
  const connection = await pool.getConnection();
  
  try {
    // 트랜잭션 시작
    await connection.beginTransaction();
    
    // CSV 파일 스트림 생성 및 처리
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          totalProcessed++;
          
          // 필수 데이터 확인
          if (!row.postcode || !row.locality || !row.state) {
            return;
          }
          
          // 중복 체크를 위한 키 생성
          const locationKey = `${row.locality}-${row.state}-${row.postcode}`.toLowerCase();
          
          // 중복이 아닌 경우만 처리
          if (!processedLocations.has(locationKey)) {
            processedLocations.add(locationKey);
            
            // 데이터 변환
            batch.push([
              row.postcode,
              row.locality,
              row.state,
              row.Long_precise || row.long || null,
              row.Lat_precise || row.lat || null,
              row.region || null,
              row.altitude || null
            ]);
            
            // 배치 크기가 1000개가 되면 삽입
            if (batch.length >= 1000) {
              insertBatch(connection, batch)
                .then(inserted => {
                  totalInserted += inserted;
                  console.log(`${totalInserted}개 레코드 삽입 완료`);
                })
                .catch(err => {
                  console.error('배치 삽입 오류:', err);
                });
              
              // 배치 초기화
              batch = [];
            }
          }
        })
        .on('end', async () => {
          // 남은 배치 처리
          if (batch.length > 0) {
            try {
              const inserted = await insertBatch(connection, batch);
              totalInserted += inserted;
            } catch (err) {
              console.error('최종 배치 삽입 오류:', err);
            }
          }
          
          // 트랜잭션 커밋
          await connection.commit();
          
          console.log(`데이터 가져오기 완료! 총 ${totalProcessed}개 처리, ${totalInserted}개 삽입`);
          resolve();
        })
        .on('error', async (error) => {
          await connection.rollback();
          console.error('CSV 파싱 오류:', error);
          reject(error);
        });
    });
  } catch (error) {
    await connection.rollback();
    console.error('데이터 가져오기 오류:', error);
  } finally {
    connection.release();
  }
}

// 배치 삽입 함수
async function insertBatch(connection, rows) {
  if (rows.length === 0) return 0;
  
  const query = `
    INSERT INTO australian_locations 
    (postcode, locality, state, longitude, latitude, region, altitude)
    VALUES ?
  `;
  
  const [result] = await connection.query(query, [rows]);
  return result.affectedRows;
}

// 실행
importPostcodes()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('프로그램 오류:', err);
    process.exit(1);
  });