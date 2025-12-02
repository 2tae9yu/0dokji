import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Review } from '../types';

interface BookReviewType extends Review {
  bookTitle: string;
  bookInfo: string;
  coverImage?: string;
}

// --- ✨ 스타일 정의 시작 ---

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

// ✅ [추가] 이미지와 텍스트를 감싸는 컨테이너
const InfoContainer = styled.div`
  padding: 20px 32px;
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

// ✅ [추가] 표지 이미지 스타일 (영화와 동일하게 너비 100px)
const CoverImage = styled.img`
  width: 100px;
  height: 144px; /* 비율 유지 */
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #eee;
  flex-shrink: 0;
`;

const MetaInfo = styled.div`
  flex: 1;
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
      min-width: 60px;
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
  display: flex;
  justify-content: space-between; /* 양쪽 정렬 */
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

// ✅ [추가] 삭제 버튼
const DeleteButton = styled.button`
  padding: 10px 20px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: #fa5252; }
`;

// --- ✨ 스타일 정의 끝 ---


const BookReviewDetail: React.FC = () => {
  const params = useParams();
  // ✅ ID 파라미터 방어 로직 (reviewId 또는 id 모두 허용)
  const targetIdString = params.reviewId || params.id;

  const [review, setReview] = useState<BookReviewType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 'bookReviews' 키 사용 확인
    const savedReviewsJSON = sessionStorage.getItem('bookReviews'); 
    
    if (savedReviewsJSON && targetIdString) {
      const savedReviews: BookReviewType[] = JSON.parse(savedReviewsJSON);
      const targetId = parseInt(targetIdString, 10);
      const currentReview = savedReviews.find(r => r.id === targetId);
      setReview(currentReview || null);
    }
  }, [targetIdString]);

  // ✅ 삭제 기능 추가
  const handleDelete = () => {
    if (window.confirm("정말로 이 독서 감상문을 삭제하시겠습니까?")) {
      const savedReviewsJSON = sessionStorage.getItem('bookReviews');
      if (savedReviewsJSON) {
        const savedReviews: BookReviewType[] = JSON.parse(savedReviewsJSON);
        const updatedReviews = savedReviews.filter(r => r.id !== review?.id);
        
        sessionStorage.setItem('bookReviews', JSON.stringify(updatedReviews));
        alert("삭제되었습니다.");
        navigate('/book-review');
      }
    }
  };

  if (!review) {
    return <div style={{textAlign: 'center', marginTop: 50}}>감상문을 찾을 수 없습니다.</div>;
  }

  return (
    <PageWrapper>
      <ReviewCard>
        <ReviewHeader>
          <h2>{review.reviewTitle}</h2>
        </ReviewHeader>
        
        {/* ✅ InfoContainer 적용 및 CoverImage 추가 */}
        <InfoContainer>
          {review.coverImage ? (
            <CoverImage src={review.coverImage} alt={review.bookTitle} />
          ) : (
            <CoverImage as="div" style={{display:'flex', alignItems:'center', justifyContent:'center', color:'#888', fontSize:'0.8rem'}}>No Image</CoverImage>
          )}
          
          <MetaInfo>
            {/* ✅ [수정] 책 제목과 정보를 분리하여 표시 */}
            <p><strong>도서:</strong> {review.bookTitle}</p>
            <p><strong>정보:</strong> {review.bookInfo}</p>
            <p><strong>완독일:</strong> {review.viewDate}</p>
          </MetaInfo>
        </InfoContainer>

        <ContentBody>
          {review.reviewContent}
        </ContentBody>
        
        {/* ✅ [수정] 버튼 위치 교환 */}
        <ButtonContainer>
          <DeleteButton onClick={handleDelete}>삭제하기</DeleteButton>
          <BackButton to="/book-review">목록으로</BackButton>
        </ButtonContainer>
      </ReviewCard>
    </PageWrapper>
  );
};

export default BookReviewDetail;