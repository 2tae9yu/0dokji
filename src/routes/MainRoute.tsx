import { createBrowserRouter } from "react-router-dom";

import Home from "../screens/Home";
import Layout from "../layout/Layout";

export const router = createBrowserRouter([{
    path: "/",

    children: [
        { path: "", element: <Home /> }
    ]
}]);