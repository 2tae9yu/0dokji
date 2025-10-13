import { createBrowserRouter } from "react-router-dom";

import Home from "../screens/Home";
import FilmWritePage from "../screens/Film";
import Layout from "../layout/Layout";
import FilmReview from "../screens/FilmReview";
import ReviewDetailPage from "../screens/FilmReviewDetail";

export const router = createBrowserRouter([{
    path: "/",

    children: [
        { path: "", element: <Home /> },
        { path: "film", element: <FilmWritePage /> },
        { path: "filmreview", element: <FilmReview /> },
        { path: "/review/:reviewId", element: <ReviewDetailPage /> },
    ]
}]);