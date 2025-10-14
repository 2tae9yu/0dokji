// FilmReview.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'; // 💅 1. styled-components import
import { Review } from '../types';

// 💅 2. 모든 스타일을 styled-components로 정의합니다.
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
  margin-bottom: 25px; /* 목록과의 간격 조정 */
`;

// Link 컴포넌트를 스타일링합니다.
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

// react-router-dom의 Link 컴포넌트를 기반으로 스타일을 적용합니다.
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
  margin: 0 0 5px 0;
`;

const ReviewCardMovieTitle = styled.p`
  font-size: 1rem;
  color: #95a5a6;
  margin: 0;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  padding: 40px 0;
  font-size: 1.1rem;
`;


// --- 컴포넌트 본문 ---
const FilmReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const savedReviewsJSON = sessionStorage.getItem('reviews');
    if (savedReviewsJSON) {
      setReviews(JSON.parse(savedReviewsJSON));
    }
  }, []);

  return (
    // 💅 3. JSX 부분을 className 대신 정의한 styled component로 교체합니다.
    <Container>
      <Title>감상문 목록</Title>

      <ButtonContainer>
        <AddReviewButton to="/">+ 새 감상문 작성</AddReviewButton>
      </ButtonContainer>

      {reviews.length > 0 ? (
        <ReviewList>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <ReviewLink to={`/review/${review.id}`}>
                <ReviewCardTitle>{review.reviewTitle}</ReviewCardTitle>
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