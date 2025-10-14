import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Review } from '../types';

// --- ✨ 스타일 정의 시작 ---

const PageWrapper = styled.div`
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 카드가 위쪽에 정렬되도록 */
  min-height: 100%;
`;

const ReviewCard = styled.div`
  width: 100%;
  max-width: 800px; /* 최대 너비 설정으로 가독성 확보 */
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden; /* 내부 요소가 radius를 벗어나지 않도록 */
`;

const ReviewHeader = styled.div`
  padding: 24px 32px;
  background-color: #f8f9fa; /* 헤더에 약간의 배경색 */
  border-bottom: 1px solid #dee2e6;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #212529;
    margin: 0;
    line-height: 1.4;
  }
`;

const MetaInfo = styled.div`
  padding: 20px 32px;
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.95rem;
  color: #495057;

  p {
    margin: 8px 0;
    display: flex;
    align-items: center;
    
    strong {
      font-weight: 600;
      margin-right: 8px;
      color: #343a40;
    }
  }
`;

const ContentBody = styled.div`
  padding: 32px;
  font-size: 1.1rem;
  line-height: 1.7; /* 줄 간격을 넓혀서 읽기 편하게 */
  color: #343a40;
  
  /* pre 태그 대신 div에 white-space 속성을 직접 적용 */
  white-space: pre-wrap; 
  word-break: break-word; /* 긴 영단어나 URL이 있을 경우 줄바꿈 */
`;

const ButtonContainer = styled.div`
  padding: 20px 32px;
  text-align: right; /* 버튼을 오른쪽에 배치 */
  border-top: 1px solid #e9ecef;
`;

// Link 컴포넌트를 버튼처럼 스타일링
const BackButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #343a40;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #495057;
  }
`;

// --- ✨ 스타일 정의 끝 ---


const ReviewDetailPage: React.FC = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔄 다른 페이지들과 일관성을 위해 sessionStorage에서 데이터를 가져옵니다.
    const savedReviewsJSON = sessionStorage.getItem('reviews'); 
    if (savedReviewsJSON && reviewId) {
      const savedReviews: Review[] = JSON.parse(savedReviewsJSON);
      const currentReview = savedReviews.find(r => r.id === parseInt(reviewId, 10));
      setReview(currentReview || null);
    }
  }, [reviewId]);

  if (!review) {
    return <div>감상문을 찾을 수 없습니다.</div>;
  }

  return (
    <PageWrapper>
      <ReviewCard>
        <ReviewHeader>
          <h2>{review.reviewTitle}</h2>
        </ReviewHeader>
        
        <MetaInfo>
          <p><strong>영화:</strong> {review.movieTitle} ({review.movieInfo})</p>
          <p><strong>관람일:</strong> {review.viewDate}</p>
        </MetaInfo>

        <ContentBody>
          {review.reviewContent}
        </ContentBody>
        
        <ButtonContainer>
          <BackButton to="/filmreview">목록으로</BackButton>
        </ButtonContainer>
      </ReviewCard>
    </PageWrapper>
  );
};

export default ReviewDetailPage;