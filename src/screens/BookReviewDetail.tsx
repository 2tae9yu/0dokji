import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// types.ts에 BookReview 타입 정의가 없다면, Review 타입을 확장해서 사용하거나 any로 처리해야 합니다.
import { Review } from '../types';

// ✅ 도서용 타입 확장 (필요 시)
interface BookReviewType extends Review {
  bookTitle: string;
  bookInfo: string; // 저자, 출판사 등
  coverImage?: string;
}

// --- ✨ 스타일 정의 시작 (FilmReviewDetail과 동일) ---

const PageWrapper = styled.div`
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
`;

const ReviewCard = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const ReviewHeader = styled.div`
  padding: 24px 32px;
  background-color: #f8f9fa;
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
  line-height: 1.7;
  color: #343a40;
  
  white-space: pre-wrap; 
  word-break: break-word;
`;

const ButtonContainer = styled.div`
  padding: 20px 32px;
  text-align: right;
  border-top: 1px solid #e9ecef;
`;

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


const BookReviewDetail: React.FC = () => {
  // ✅ URL 파라미터 이름 확인 (MainRoute 설정에 따름)
  const { reviewId } = useParams<{ reviewId: string }>();
  const [review, setReview] = useState<BookReviewType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔄 sessionStorage 키 변경: 'bookReviews'
    const savedReviewsJSON = sessionStorage.getItem('bookReviews'); 
    if (savedReviewsJSON && reviewId) {
      const savedReviews: BookReviewType[] = JSON.parse(savedReviewsJSON);
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
          {/* ✅ 영화 관련 필드를 도서 관련 필드로 변경 */}
          <p><strong>책 제목:</strong> {review.bookTitle} ({review.bookInfo})</p>
          <p><strong>완독일:</strong> {review.viewDate}</p>
        </MetaInfo>

        <ContentBody>
          {review.reviewContent}
        </ContentBody>
        
        <ButtonContainer>
          {/* ✅ 목록으로 돌아가는 링크 변경 */}
          <BackButton to="/book-review">목록으로</BackButton>
        </ButtonContainer>
      </ReviewCard>
    </PageWrapper>
  );
};

export default BookReviewDetail;