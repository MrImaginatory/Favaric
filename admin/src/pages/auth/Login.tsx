import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/lib/api"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const appTitle = import.meta.env.VITE_APP_TITLE || "Admin Panel"
  const projectName = import.meta.env.VITE_APP_PROJECT_NAME || "Favric"
  const logoPath = import.meta.env.VITE_APP_LOGO || "/logo.svg"

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: loginUser, isPending: isLoading } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (result) => {
      if (result.success) {
        login(result.data.accessToken, {
          userName: result.data.userName,
          email: result.data.email,
        })
        toast.success(result.message || "Logged in successfully")
        navigate("/")
      } else {
        toast.error(result.message || "Failed to login. Please check your credentials.")
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "An error occurred during login. Please try again later.")
    }
  })

  function onSubmit(data: LoginFormValues) {
    loginUser(data)
  }

  function onError(errors: any) {
    const firstError = Object.values(errors)[0] as any
    if (firstError?.message) {
      toast.error(firstError.message)
    } else {
      toast.error("Please fix the validation errors in the form.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-6 flex flex-col items-center text-center w-full">
            <img src={logoPath} alt={`${projectName} Logo`} className="h-12 w-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">{appTitle}</h1>
            <div className="mt-6 w-full border-b border-border"></div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} disabled={isLoading} autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} disabled={isLoading} className="pr-10" autoComplete="current-password" />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                    <div className="flex justify-end pt-1 pb-2">
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
