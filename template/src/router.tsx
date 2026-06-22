import { HashRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import HomePage from "./pages/HomePage"

const ComponentsPage = import.meta.env.DEV
  ? lazy(() => import("./pages/dev/ComponentsPage"))
  : null

const ChartsPage = import.meta.env.DEV
  ? lazy(() => import("./pages/dev/ChartsPage"))
  : null

const Loading = () => <div className="p-8 text-muted-foreground">加载中...</div>

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 新增页面在此追加：<Route path="/xxx" element={<XxxPage />} /> */}

        {import.meta.env.DEV && ComponentsPage && (
          <Route path="/dev/components" element={<Suspense fallback={<Loading />}><ComponentsPage /></Suspense>} />
        )}
        {import.meta.env.DEV && ChartsPage && (
          <Route path="/dev/charts" element={<Suspense fallback={<Loading />}><ChartsPage /></Suspense>} />
        )}
      </Routes>
    </HashRouter>
  )
}
