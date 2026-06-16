import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react"
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

const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  userName: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
  confirmPassword: z.string(),
  countryCode: z.string().min(1, { message: "Country code is required." }),
  mobile: z.string().min(10, { message: "Valid mobile number is required." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function Signup() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const appTitle = import.meta.env.VITE_APP_TITLE || "Admin Panel"
  const projectName = import.meta.env.VITE_APP_PROJECT_NAME || "Favric"
  const logoPath = import.meta.env.VITE_APP_LOGO || "/logo.svg"

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      countryCode: "91",
      mobile: "",
    },
  })

  const password = form.watch("password") || ""
  
  const rules = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /[0-9]/, text: "One number" },
    { regex: /[^A-Za-z0-9]/, text: "One special character" },
  ]

  const strength = rules.filter(rule => rule.regex.test(password)).length

  const { mutate: signupUser, isPending: isLoading } = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Account created successfully! Please sign in.")
        navigate("/login")
      } else {
        toast.error(result.message || "Failed to create account. Please try again.")
      }
    },
    onError: (error: any) => {
      console.error("Signup error:", error)
      toast.error(error.response?.data?.message || "An error occurred during signup. Please try again later.")
    }
  })

  function onSubmit(data: SignupFormValues) {
    const { confirmPassword, countryCode, ...rest } = data
    const payload = { ...rest, countryCode: Number(countryCode) }
    signupUser(payload)
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-6 flex flex-col items-center text-center w-full">
            <img src={logoPath} alt={`${projectName} Logo`} className="h-12 w-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">{appTitle}</h1>
            <div className="mt-6 w-full border-b border-border"></div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} disabled={isLoading} autoComplete="given-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} disabled={isLoading} autoComplete="family-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe123" {...field} disabled={isLoading} autoComplete="username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <div className="grid grid-cols-[1fr_3fr] gap-4">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="91" {...field} disabled={isLoading} autoComplete="tel-country-code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} disabled={isLoading} autoComplete="tel-national" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} disabled={isLoading} className="pr-10" autoComplete="new-password" />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Strength Indicator */}
              <div className="flex flex-col gap-2 mt-1 mb-2">
                <div className="flex gap-1 h-1.5 w-full">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-full flex-1 rounded-full ${
                        password.length === 0 ? "bg-muted" :
                        i < strength ? (strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-yellow-500" : "bg-green-500") : "bg-muted"
                      }`} 
                    />
                  ))}
                </div>
                <div className="text-muted-foreground text-xs font-medium mt-1">Password must contain:</div>
                <ul className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs">
                  {rules.map((rule, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      {rule.regex.test(password) ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
                      <span className={rule.regex.test(password) ? "text-foreground" : "text-muted-foreground"}>{rule.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} disabled={isLoading} className="pr-10" autoComplete="new-password" />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
