import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen flex-col items-center justify-center p-6">
                <h1 className="text-3xl font-semibold tracking-tight">Admin Panel</h1>
                <p className="mt-4 text-muted-foreground">Ready for development.</p>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ThemeToggle />
    </>
  )
}

export default App
