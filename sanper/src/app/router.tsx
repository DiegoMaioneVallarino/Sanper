import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { HomePage } from "../pages/HomePage/HomePage";
import { ArticlePage } from "../pages/ArticlePage/ArticlePage";
import { MarketsPage } from
  "../pages/MarketsPage/MarketsPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,

    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/noticia/:slug",
        element: <ArticlePage />,
      },
      {
  path: "/mercados",
  element: <MarketsPage />,
},
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}