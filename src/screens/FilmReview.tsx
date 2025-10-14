// FilmReview.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// ✨ types.ts 파일에 reviewContent, viewDate 등이 있으므로 그대로 import 합니다.
import { Review } from '../types';

// ... (Container, Title 등 다른 스타일은 이전과 동일)
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px 30px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.2rem;
`;

const ButtonContainer = styled.div`
  text-align: right;
  margin-bottom: 25px;
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
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #2980b9;
    transform: scale(1.05);
  }
`;

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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

const ReviewLink = styled(Link)`
  display: block;
  padding: 20px 25px;
  text-decoration: none;
  color: inherit;
`;

const ReviewCardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #34495e;
  margin: 0 0 8px 0;
`;

const ReviewCardMovieTitle = styled.p`
  font-size: 1rem;
  color: #95a5a6;
  margin: 0;
  padding-top: 8px;
  border-top: 1px solid #ecf0f1;
  margin-top: 12px;
`;

const ReviewCardDate = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  padding: 40px 0;
  font-size: 1.1rem;
`;


const FilmReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const savedReviewsJSON = sessionStorage.getItem('reviews');
    if (savedReviewsJSON) {
      setReviews(JSON.parse(savedReviewsJSON));
    }
  }, []);

  // ✨ 날짜가 이미 'YYYY년 MM월 DD일' 형식이라 formatDate 함수가 필요 없습니다!

  return (
    <Container>
      <Title>감상문 목록</Title>

      <ButtonContainer>
        <AddReviewButton to="/">+ 새 감상문 작성</AddReviewButton>
      </ButtonContainer>

      {reviews.length > 0 ? (
        <ReviewList>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              {/* ✨ id가 number 타입이므로 문자열로 변환해줍니다. */}
              <ReviewLink to={`/review/${review.id.toString()}`}>
                <ReviewCardTitle>{review.reviewTitle}</ReviewCardTitle>
                
                {/* ✨ review.createdAt 대신 review.viewDate를 바로 사용합니다. */}
                {review.viewDate && (
                  <ReviewCardDate>{review.viewDate}</ReviewCardDate>
                )}
                
                <ReviewCardMovieTitle>{review.movieTitle}</ReviewCardMovieTitle>
              </ReviewLink>
            </ReviewCard>
          ))}
        </ReviewList>
      ) : (
        <EmptyMessage>작성된 감상문이 없습니다. 첫 감상문을 작성해보세요!</EmptyMessage>
      )}
    </Container>
  );
};

export default FilmReview;