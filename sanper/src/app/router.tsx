import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { HomePage } from "../pages/HomePage/HomePage";
import { ArticlePage } from "../pages/ArticlePage/ArticlePage";
import { MarketsPage } from
  "../pages/MarketsPage/MarketsPage";

import { SettingsPage } from
  "../pages/SettingsPage/SettingsPage";

import { SavedPage } from
  "../pages/SavedPage/SavedPage";

import { CommunityPage } from
  "../pages/CommunityPage/CommunityPage";

import { AdminPage } from
  "../pages/AdminPage/AdminPage";

  const router = createBrowserRouter([
  {
    element: <MainLayout />,

    children: [
      {
        path: "/",
        element: <HomePage />,
      },
{
  path: "/ajustes",
  element: <SettingsPage />,
},{
  path: "/admin",
  element: <AdminPage />,
},
      {
        path: "/noticia/:slug",
        element: <ArticlePage />,
      },{
  path: "/comunidad",
  element: <CommunityPage />,
},
      {
  path: "/mercados",
  element: <MarketsPage />,
},{
  path: "/guardados",
  element: <SavedPage />,
},
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}