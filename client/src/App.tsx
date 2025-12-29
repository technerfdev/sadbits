import { lazy, Suspense } from "react";
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

const AppLoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Suspense fallback={<AppLoadingAnimation />}>
      <PomodoroProvider>
        <RouterProvider router={mainRouter} />
      </PomodoroProvider>
    </Suspense>
  );
}

export default App;
