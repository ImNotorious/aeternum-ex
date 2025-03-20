"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/logo"
import { Mail, AlertCircle, ArrowLeft, CheckCircle, Brain, Shield, Zap, Clock, Users, Sparkles } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [icons, setIcons] = useState<any[]>([])

  // Ensuring window is only used on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIcons([
        { icon: <Brain className="h-8 w-8 text-primary/30" />, delay: 0 },
        { icon: <Shield className="h-8 w-8 text-primary/30" />, delay: 1.5 },
        { icon: <Zap className="h-8 w-8 text-primary/30" />, delay: 0.8 },
        { icon: <Clock className="h-8 w-8 text-primary/30" />, delay: 2.2 },
        { icon: <Users className="h-8 w-8 text-primary/30" />, delay: 1.2 },
        { icon: <Sparkles className="h-8 w-8 text-primary/30" />, delay: 0.5 },
      ])
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Failed to send password reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background/0 to-background overflow-hidden">
      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {icons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{ x: Math.random() * 100 - 50, y: -50, opacity: 0 }}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [0, 100, 200], // Simpler animation to avoid SSR issues
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 15,
              times: [0, 0.5, 1],
              repeat: Number.POSITIVE_INFINITY,
              delay: item.delay,
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          className="flex justify-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Logo />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Check your email</h3>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to your email. Please check your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/auth/login" className="flex items-center text-sm text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
