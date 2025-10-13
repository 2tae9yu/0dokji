// ReviewDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Review } from '../types';

const ReviewDetailPage: React.FC = () => {
  const { reviewId } = useParams<{ reviewId: string }>(); // URL에서 reviewId 파라미터 가져오기
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    const savedReviewsJSON = localStorage.getItem('reviews');
    if (savedReviewsJSON && reviewId) {
      const savedReviews: Review[] = JSON.parse(savedReviewsJSON);
      // 전체 리뷰 중에서 URL 파라미터와 일치하는 id를 가진 리뷰를 찾습니다.
      const currentReview = savedReviews.find(r => r.id === parseInt(reviewId, 10));
      setReview(currentReview || null);
    }
  }, [reviewId]);

  if (!review) {
    return <div>감상문을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h2>{review.reviewTitle}</h2>
      <p><strong>영화:</strong> {review.movieTitle} ({review.movieInfo})</p>
      <p><strong>관람일:</strong> {review.viewDate}</p>
      <hr />
      {/* pre 태그를 사용하면 줄바꿈 등이 그대로 표시됩니다. */}
      <pre style={{ whiteSpace: 'pre-wrap' }}>{review.reviewContent}</pre>
      <br />
      <Link to="/">목록으로 돌아가기</Link>
    </div>
  );
};

export default ReviewDetailPage;