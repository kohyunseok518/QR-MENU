import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
const MenuApp = lazy(() => import("./App"));
const AdminApp = lazy(() => import("./admin/AdminApp"));
const isAdmin = /^\/admin\/?$/.test(location.pathname);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<p role="status">불러오는 중…</p>}>
      {isAdmin ? <AdminApp /> : <MenuApp />}
    </Suspense>
  </StrictMode>,
);
