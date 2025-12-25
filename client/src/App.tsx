import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Obello from "./internal/Obello/Obello";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./modules/Boundaries/NotFound";
import { PomodoroProvider } from "./modules/Pomodoro/PomodoroContext";

const ErrorBoundary = lazy(() => import("@/modules/Boundaries/ErrorBoundary"));
const Home = lazy(() => import("@/modules/Home/Home"));
const Setting = lazy(() => import("@/modules/Setting/Setting"));
const Entertainment = lazy(
  () => import("@/modules/Entertainment/Entertainment")
);
const Work = lazy(() => import("@/modules/Work/Work"));
const ImageEditor = lazy(
  () => import("@/modules/ImageEditor/ImageEditorLayout")
);
const Vault = lazy(() => import("@/modules/Vault/Vault"));

const mainRouter = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "work",
        Component: Work,
      },
      {
        path: "vault",
        Component: Vault,
      },
      {
        path: "setting",
        Component: Setting,
      },
      {
        path: "relax",
        Component: Entertainment,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
  {
    path: "img-editor",
    Component: ImageEditor,
  },
  { path: "/internal", children: [{ path: "obello", Component: Obello }] },
]);

function App() {
  return (
    <PomodoroProvider>
      <RouterProvider router={mainRouter} />
    </PomodoroProvider>
  );
}

export default App;
