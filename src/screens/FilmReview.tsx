// HomePage.tsx (또는 목록을 보여줄 다른 컴포넌트)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 상세 보기 링크를 위해 import
import { Review } from '../types'; // 1단계에서 만든 타입 import

const FilmReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 localStorage에서 데이터를 불러옵니다.
    const savedReviewsJSON = localStorage.getItem('reviews');
    if (savedReviewsJSON) {
      setReviews(JSON.parse(savedReviewsJSON));
    }
  }, []);

  return (
    <div>
      <h1>나의 영화 감상문 목록</h1>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              {/* 각 리뷰를 클릭하면 상세 페이지로 ID를 넘겨주며 이동합니다. */}
              <Link to={`/review/${review.id}`}>
                <strong>{review.reviewTitle}</strong> ({review.movieTitle})
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>작성된 감상문이 없습니다.</p>
      )}
      {/* 감상문 작성 페이지로 가는 버튼 등 추가 */}
    </div>
  );
};

export default FilmReview;