import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// types.ts에 BookReview 타입이 정의되어 있다고 가정
import { Review } from '../types'; 

interface BookReviewType extends Review {
  bookTitle: string;
  coverImage?: string;
}

// ✅ [수정] Container에 ref를 연결하기 위해 relative 설정
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px 30px;
  font-family: 'Pretendard', sans-serif;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative; /* 팝오버 절대 위치 기준 */
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2.2rem;
`;

const ButtonContainer = styled.div`
  text-align: right;
  margin-bottom: 20px;
`;

const AddReviewButton = styled(Link)`
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: #2980b9; }
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  background-color: #eee;
  padding: 5px;
  border-radius: 10px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background-color: ${(props) => (props.$active ? '#fff' : 'transparent')};
  color: ${(props) => (props.$active ? '#3498db' : '#7f8c8d')};
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${(props) => (props.$active ? '0 2px 5px rgba(0,0,0,0.1)' : 'none')};
  transition: all 0.2s ease;
  font-size: 1rem;
  &:hover { color: #3498db; }
`;

// --- 달력 스타일 ---
const CalendarContainer = styled.div`
  width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0 20px;
    font-size: 1.5rem;
    color: #333;
  }
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #555;
    &:hover { color: #3498db; }
  }
`;

const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
  color: #7f8c8d;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

const DayCell = styled.div`
  aspect-ratio: 2 / 3;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
  position: relative;
  overflow: visible; 
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    z-index: 5;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const DateNumber = styled.span<{ $isToday?: boolean }>`
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  color: ${(props) => (props.$isToday ? '#3498db' : '#333')};
  z-index: 2;
  background-color: rgba(255,255,255,0.8);
  padding: 2px 5px;
  border-radius: 4px;
`;

const CoverContainer = styled.div<{ $count: number }>`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  box-shadow: ${(props) => 
    props.$count > 1 
      ? '3px 3px 0 #ddd, 6px 6px 0 #eee' 
      : 'none'};
`;

const CalendarCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CountOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0 8px 5px 0;
  font-size: 0.9rem;
  font-weight: bold;
  box-sizing: border-box;
`;

// ✅ [수정] position: absolute로 변경 (컨테이너 내부 고정)
const PopoverContainer = styled.div<{ $x: number; $y: number }>`
  position: absolute; /* fixed -> absolute */
  top: ${(props) => props.$y}px;
  left: ${(props) => props.$x}px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 1000;
  width: 250px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  animation: fadeIn 0.2s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PopoverItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  &:last-child { border-bottom: none; }
  &:hover { background-color: #f9f9f9; }

  img {
    width: 30px;
    height: 45px;
    object-fit: cover;
    border-radius: 3px;
    background-color: #eee;
  }
  div {
    flex: 1;
    overflow: hidden;
    h4 {
      margin: 0;
      font-size: 0.9rem;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p {
      margin: 3px 0 0 0;
      font-size: 0.75rem;
      color: #888;
    }
  }
`;

const TransparentBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background: transparent;
  cursor: default;
`;

// --- 목록 뷰 스타일 ---
const ReviewList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const ReviewCard = styled.li` 
  background-color: #ffffff; 
  border-radius: 10px; 
  margin-bottom: 15px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); 
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; 
  &:hover { transform: translateY(-5px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12); }
`;
const ReviewLink = styled(Link)` display: block; padding: 20px 25px; text-decoration: none; color: inherit; `;
const CardContent = styled.div` display: flex; align-items: center; gap: 20px; `;
const ListCoverImg = styled.img` width: 60px; height: 86px; object-fit: cover; border-radius: 4px; background-color: #eee; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); `;
const TextContent = styled.div` display: flex; flex-direction: column; flex: 1; `;
const ReviewCardTitle = styled.h2` font-size: 1.3rem; font-weight: 600; color: #34495e; margin: 0 0 5px 0; `;
const ReviewCardBookTitle = styled.p` font-size: 0.95rem; color: #95a5a6; margin: 5px 0 0 0; `;
const ReviewCardDate = styled.p` font-size: 0.85rem; color: #7f8c8d; margin: 0; margin-bottom: 8px; `;
const EmptyMessage = styled.p` text-align: center; color: #7f8c8d; padding: 40px 0; font-size: 1.1rem; `;

const BookReview: React.FC = () => {
  const [reviews, setReviews] = useState<BookReviewType[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  // ✅ [수정] 컨테이너 ref 추가
  const containerRef = useRef<HTMLDivElement>(null);

  const [popoverReviews, setPopoverReviews] = useState<BookReviewType[] | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const savedReviewsJSON = sessionStorage.getItem('bookReviews');
    if (savedReviewsJSON) {
      setReviews(JSON.parse(savedReviewsJSON));
    }
  }, []);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // ✅ [수정] 클릭 핸들러: 컨테이너 기준 좌표 계산
  const handleDateClick = (e: React.MouseEvent, dayReviews: BookReviewType[]) => {
    e.stopPropagation();
    if (!dayReviews || dayReviews.length === 0) return;

    if (dayReviews.length === 1) {
      // ✅ 오류 방지 (id check)
      if (dayReviews[0] && dayReviews[0].id) {
          navigate(`/book-review/${dayReviews[0].id}`);
      }
    } else {
      // ✅ 좌표 계산
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + 15; 
        const y = e.clientY - rect.top - 10;
        
        setPopoverPos({ x, y });
        setPopoverReviews(dayReviews);
      }
    }
  };

  const closePopover = () => {
    setPopoverReviews(null);
    setPopoverPos(null);
  };

  const sortedReviewsForList = [...reviews].sort((a, b) => b.id - a.id);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarCells = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarCells.push(<DayCell key={`empty-${i}`} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'default', boxShadow: 'none' }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}년 ${month + 1}월 ${day}일`;
      const dayReviews = reviews.filter(review => review.viewDate === dateKey);
      const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
      const mainReview = dayReviews[0];

      calendarCells.push(
        <DayCell key={day} onClick={(e) => handleDateClick(e, dayReviews)}>
          <DateNumber $isToday={isToday}>{day}</DateNumber>
          {mainReview && (
            <CoverContainer $count={dayReviews.length}>
               {mainReview.coverImage ? (
                 <CalendarCover src={mainReview.coverImage} alt={mainReview.bookTitle} />
               ) : (
                 <div style={{ width:'100%', height:'100%', backgroundColor: '#eee', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '0.7rem', color:'#888', textAlign: 'center' }}>
                    {mainReview.bookTitle}
                 </div>
               )}
               {dayReviews.length > 1 && (
                 <CountOverlay>+{dayReviews.length - 1}</CountOverlay>
               )}
            </CoverContainer>
          )}
        </DayCell>
      );
    }
    return calendarCells;
  };

  return (
    // ✅ [수정] ref 연결
    <Container ref={containerRef}>
      <Title>독서 감상문 기록장</Title>
      <ButtonContainer>
        <AddReviewButton to="/">+ 새 감상문 작성</AddReviewButton>
      </ButtonContainer>

      <ToggleContainer>
        <ToggleButton $active={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}>📅 달력 보기</ToggleButton>
        <ToggleButton $active={viewMode === 'list'} onClick={() => setViewMode('list')}>📋 목록 보기</ToggleButton>
      </ToggleContainer>

      {viewMode === 'calendar' && (
        <CalendarContainer>
          <CalendarHeader>
            <button onClick={handlePrevMonth}>&lt;</button>
            <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
            <button onClick={handleNextMonth}>&gt;</button>
          </CalendarHeader>
          <WeekDaysGrid>
            <div style={{ color: '#e74c3c' }}>일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div style={{ color: '#3498db' }}>토</div>
          </WeekDaysGrid>
          <DaysGrid>
            {renderCalendar()}
          </DaysGrid>
        </CalendarContainer>
      )}

      {popoverReviews && popoverPos && (
        <>
          <TransparentBackdrop onClick={closePopover} />
          {/* ✅ 팝오버: 절대 위치 적용 */}
          <PopoverContainer $x={popoverPos.x} $y={popoverPos.y}>
            {popoverReviews.map((review) => (
              <PopoverItem key={review.id} onClick={() => navigate(`/book-review/${review.id}`)}>
                {review.coverImage ? <img src={review.coverImage} alt="" /> : <div style={{width:30, height:45, background:'#eee'}}/>}
                <div>
                  <h4>{review.reviewTitle}</h4>
                  <p>{review.bookTitle}</p>
                </div>
              </PopoverItem>
            ))}
          </PopoverContainer>
        </>
      )}

      {viewMode === 'list' && (
        <>
          {sortedReviewsForList.length > 0 ? (
            <ReviewList>
              {sortedReviewsForList.map((review) => (
                <ReviewCard key={review.id}>
                  <ReviewLink to={`/book-review/${review.id.toString()}`}>
                    <CardContent>
                        {review.coverImage ? <ListCoverImg src={review.coverImage} /> : <ListCoverImg as="div" />}
                        <TextContent>
                            <ReviewCardTitle>{review.reviewTitle}</ReviewCardTitle>
                            {review.viewDate && <ReviewCardDate>{review.viewDate}</ReviewCardDate>}
                            <ReviewCardBookTitle>{review.bookTitle}</ReviewCardBookTitle>
                        </TextContent>
                    </CardContent>
                  </ReviewLink>
                </ReviewCard>
              ))}
            </ReviewList>
          ) : (
            <EmptyMessage>작성된 감상문이 없습니다. 첫 감상문을 작성해보세요!</EmptyMessage>
          )}
        </>
      )}
    </Container>
  );
};

export default BookReview;