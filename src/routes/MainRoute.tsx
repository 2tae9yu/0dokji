import { createBrowserRouter } from "react-router-dom";

import Home from "../screens/Home";
import FilmWritePage from "../screens/Film";
import Layout from "../layout/Layout";

export const router = createBrowserRouter([{
    path: "/",

    children: [
        { path: "", element: <Home /> },
        { path: "film", element: <FilmWritePage /> }
    ]
}]);