import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";
import Home from "../screens/Home";
import FilmWrite from "../screens/FilmWrite";
import FilmReview from "../screens/FilmReview";
import FilmReviewDetail from "../screens/FilmReviewDetail";
import BookWrite from "../screens/BookWrite";

export const router = createBrowserRouter([{
    path: "/",

    element: <Layout />,

    children: [
        { path: "", element: <Home /> },
        { path: "film", element: <FilmWrite /> },
        { path: "filmreview", element: <FilmReview /> },
        { path: "/review/:reviewId", element: <FilmReviewDetail /> },
        { path: "book", element: <BookWrite /> },
    ]
}]);