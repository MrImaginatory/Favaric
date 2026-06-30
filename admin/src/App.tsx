import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ReactLenis } from "lenis/react"

import Brand from "@/pages/master/Brand"
import Category from "@/pages/master/Category"
import Color from "@/pages/master/Color"
import CountryOfOrigin from "@/pages/master/CountryOfOrigin"
import Dimensions from "@/pages/master/Dimensions"
import Fabric from "@/pages/master/Fabric"
import Length from "@/pages/master/Length"
import Occassion from "@/pages/master/Occassion"
import Pattern from "@/pages/master/Pattern"
import Product from "@/pages/master/Product"
import ProductTypes from "@/pages/master/ProductTypes"
import Shipping from "@/pages/master/Shipping"
import Size from "@/pages/master/Size"
import Subcategory from "@/pages/master/Subcategory"
import Weight from "@/pages/master/Weight"
import Metric from "@/pages/master/Metric"

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
          <Route path="master/brand" element={<Brand />} />
          <Route path="master/category" element={<Category />} />
          <Route path="master/color" element={<Color />} />
          <Route path="master/countryoforigin" element={<CountryOfOrigin />} />
          <Route path="master/dimensions" element={<Dimensions />} />
          <Route path="master/fabric" element={<Fabric />} />
          <Route path="master/length" element={<Length />} />
          <Route path="master/metric" element={<Metric />} />
          <Route path="master/occassion" element={<Occassion />} />
          <Route path="master/pattern" element={<Pattern />} />
          <Route path="master/product" element={<Product />} />
          <Route path="master/producttypes" element={<ProductTypes />} />
          <Route path="master/shipping" element={<Shipping />} />
          <Route path="master/size" element={<Size />} />
          <Route path="master/subcategory" element={<Subcategory />} />
          <Route path="master/weight" element={<Weight />} />
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
