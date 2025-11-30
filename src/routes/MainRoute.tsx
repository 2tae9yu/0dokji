import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";
import Home from "../screens/Home";
import FilmWrite from "../screens/FilmWrite";
import FilmReview from "../screens/FilmReview";
import FilmReviewDetail from "../screens/FilmReviewDetail";
import BookWrite from "../screens/BookWrite";
import BookReview from "../screens/BookReview";
import BookReviewDetail from "../screens/BookReviewDetail";
import RecordStats from "../screens/RecordStats";

export const router = createBrowserRouter([{
    path: "/",

    element: <Layout />,

    children: [
        { path: "", element: <Home /> },
        // 영화
        { path: "film", element: <FilmWrite /> },
        { path: "film-review", element: <FilmReview /> },
        { path: "film-review/:reviewId", element: <FilmReviewDetail /> },

        // 독서
        { path: "book", element: <BookWrite /> },
        { path: "book-review", element: <BookReview /> },
        { path: "book-review/:reviewId", element: <BookReviewDetail /> },

        // ✅ [추가] 통계 페이지 라우트
        { path: "stats", element: <RecordStats /> }
    ]
}]);