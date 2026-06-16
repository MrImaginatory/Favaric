import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ReactLenis } from "lenis/react"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

// A temporary dashboard content component
function DashboardContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Panel</h1>
      <p className="mt-4 text-muted-foreground">Select an option from the sidebar to get started.</p>
    </div>
  )
}

export function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup"

  return (
    <ReactLenis root>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardContent />} />
          {/* Add other nested routes here later */}
        </Route>
      </Routes>
      {isAuthPage && (
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}
    </ReactLenis>
  )
}

export default App
