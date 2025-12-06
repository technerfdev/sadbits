import { useApp } from "@/hooks/useApp";
import type { JSX } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NotFound from "./NotFound";

export default function ErrorBoundary(): JSX.Element {
  const error = useRouteError();
  const { isDev } = useApp();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }
  }

  const jsError = error as Error;
  // TODO: Improving by show toast instead of blocking design for better UX
  return (
    <div className="flex justify-center items-center">
      {isDev && <pre>{jsError.stack}</pre>}
    </div>
  );
}
