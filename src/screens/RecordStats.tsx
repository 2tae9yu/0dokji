import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- 스타일 정의 ---
const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Pretendard', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
`;

const SummaryContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  justify-content: center;
  flex-wrap: wrap;
`;

const SummaryCard = styled.div`
  background: white;
  padding: 20px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
  min-width: 150px;

  h3 {
    margin: 0 0 10px 0;
    color: #7f8c8d;
    font-size: 1rem;
  }
  p {
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
  }
  &.book p { color: #e67e22; }
  &.total p { color: #2ecc71; }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  
  h3 {
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
`;

// --- 차트용 색상 ---
const COLORS = ['#3498db', '#e67e22']; // 파랑(영화), 주황(책)

const RecordStats: React.FC = () => {
  const [filmCount, setFilmCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  
  // 차트 데이터 상태
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [ratioData, setRatioData] = useState<any[]>([]);

  useEffect(() => {
    // 1. 데이터 가져오기
    const filmJson = sessionStorage.getItem('filmReviews');
    const bookJson = sessionStorage.getItem('bookReviews');

    const films = filmJson ? JSON.parse(filmJson) : [];
    const books = bookJson ? JSON.parse(bookJson) : [];

    setFilmCount(films.length);
    setBookCount(books.length);

    // 2. 월별 데이터 가공 ("2025년 10월 27일" 형식 파싱)
    const monthMap: { [key: string]: { film: number, book: number } } = {};

    // 1~12월 초기화
    for (let i = 1; i <= 12; i++) {
      monthMap[`${i}월`] = { film: 0, book: 0 };
    }

    // 영화 데이터 집계
    films.forEach((item: any) => {
      if (item.viewDate) {
        // "2025년 10월 27일" -> 공백으로 자르고 [1]번 인덱스("10월") 가져오기
        const monthPart = item.viewDate.split(' ')[1]; // "10월"
        if (monthMap[monthPart]) {
          monthMap[monthPart].film += 1;
        }
      }
    });

    // 독서 데이터 집계
    books.forEach((item: any) => {
      if (item.viewDate) {
        const monthPart = item.viewDate.split(' ')[1];
        if (monthMap[monthPart]) {
          monthMap[monthPart].book += 1;
        }
      }
    });

    // 차트용 배열로 변환
    const processedMonthlyData = Object.keys(monthMap).map(month => ({
      name: month,
      영화: monthMap[month].film,
      독서: monthMap[month].book
    }));

    // "1월", "2월"... 순서대로 정렬 (숫자 기준)
    processedMonthlyData.sort((a, b) => parseInt(a.name) - parseInt(b.name));

    setMonthlyData(processedMonthlyData);

    // 3. 비율 데이터 설정
    setRatioData([
      { name: '영화', value: films.length },
      { name: '독서', value: books.length }
    ]);

  }, []);

  return (
    <Container>
      <Title>나의 기록 통계 📊</Title>

      {/* 1. 상단 요약 카드 */}
      <SummaryContainer>
        <SummaryCard>
          <h3>🎬 영화 기록</h3>
          <p>{filmCount} 편</p>
        </SummaryCard>
        <SummaryCard className="book">
          <h3>📚 독서 기록</h3>
          <p>{bookCount} 권</p>
        </SummaryCard>
        <SummaryCard className="total">
          <h3>📝 총 기록</h3>
          <p>{filmCount + bookCount} 개</p>
        </SummaryCard>
      </SummaryContainer>

      <ChartGrid>
        {/* 2. 월별 활동 차트 (막대 그래프) */}
        <ChartCard>
          <h3>월별 기록 현황</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="영화" fill="#3498db" radius={[4, 4, 0, 0]} />
                <Bar dataKey="독서" fill="#e67e22" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 3. 비율 차트 (파이 그래프) */}
        <ChartCard>
          <h3>영화 vs 독서 비율</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={ratioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  // ✅ [수정] percent 뒤에 '|| 0'을 붙여서 없을 땐 0으로 계산하게 합니다.
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {ratioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </ChartGrid>
    </Container>
  );
};

export default RecordStats;