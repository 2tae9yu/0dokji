import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Review } from '../types';

// 종이 질감을 위한 SVG 노이즈 패턴 (데이터 URI)
const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

// --- ✨ 스타일 정의 시작 ---

const PageWrapper = styled.div`
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  background-color: #fcfaf2;
  background-image: ${paperTexture};
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

const PosterImage = styled.img`
  width: 100px;
  height: 144px;
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
  font-family: 'Nanum Pen Script', cursive;
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
  justify-content: space-between; /* 양쪽 끝으로 배치 */
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

// ✅ [추가] 삭제 버튼 스타일
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


const FilmReviewDetail: React.FC = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 'filmReviews' 키 확인
    const savedReviewsJSON = sessionStorage.getItem('filmReviews'); 
    if (savedReviewsJSON && reviewId) {
      const savedReviews: Review[] = JSON.parse(savedReviewsJSON);
      const currentReview = savedReviews.find(r => r.id === parseInt(reviewId, 10));
      setReview(currentReview || null);
    }
  }, [reviewId]);

  // ✅ [추가] 삭제 핸들러 (키: filmReviews / 이동: /film-review)
  const handleDelete = () => {
    if (window.confirm("정말로 이 영화 감상문을 삭제하시겠습니까?")) {
      const savedReviewsJSON = sessionStorage.getItem('filmReviews');
      if (savedReviewsJSON) {
        const savedReviews: Review[] = JSON.parse(savedReviewsJSON);
        const updatedReviews = savedReviews.filter(r => r.id !== review?.id);
        
        sessionStorage.setItem('filmReviews', JSON.stringify(updatedReviews));
        alert("삭제되었습니다.");
        navigate('/film-review'); // 목록으로 이동
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
        
        <InfoContainer>
          {review.posterUrl ? (
            <PosterImage src={review.posterUrl} alt={review.movieTitle} />
          ) : (
            <PosterImage as="div" style={{display:'flex', alignItems:'center', justifyContent:'center', color:'#888', fontSize:'0.8rem'}}>No Image</PosterImage>
          )}

          <MetaInfo>
            <p><strong>영화:</strong> {review.movieTitle}</p>
            <p><strong>정보:</strong> {review.movieInfo}</p>
            <p><strong>관람일:</strong> {review.viewDate}</p>
          </MetaInfo>
        </InfoContainer>

        <ContentBody>
          {review.reviewContent}
        </ContentBody>
        
        <ButtonContainer>
          {/* ✅ 삭제 버튼(왼쪽), 목록 버튼(오른쪽) 배치 */}
          <DeleteButton onClick={handleDelete}>삭제하기</DeleteButton>
          <BackButton to="/film-review">목록으로</BackButton>
        </ButtonContainer>
      </ReviewCard>
    </PageWrapper>
  );
};

export default FilmReviewDetail;