"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthPage() {
  const router = useRouter()
  const handleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error("Login failed", {
        description: error.message,
      })
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push("/")
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">HealthCare EHR</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLogin}>
            Sign In with GitHub
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            This is a demo application. Use your GitHub account to sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}