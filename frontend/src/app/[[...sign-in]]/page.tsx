'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs' // make sure you're importing the right hook

export default function SignInPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  // Redirect based on user role after sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const role = user?.publicMetadata.role
      if (role) {
        router.push(`/${role}`)
      }
    }
  }, [isLoaded, isSignedIn, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fcDarkBg via-fcSurface to-fcDarkBg px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-fcGarnet/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-fcBlue/10 rounded-full blur-3xl" />

      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="relative z-10 w-full max-w-md space-y-6 rounded-2xl glass-card border border-fcBorder px-6 py-10 shadow-xl sm:px-10"
        >
          <header className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fcGarnet to-fcBlue mb-4 shadow-glow-garnet">
              <span className="text-3xl">⚽</span>
            </div>
            <h1 className="mt-4 text-2xl font-heading font-bold tracking-tight text-white">
              Sign in to FC Manager
            </h1>
            <p className="mt-2 text-sm text-fcTextMuted">
              Welcome back! Please enter your credentials
            </p>
          </header>

          <Clerk.GlobalError className="block text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2" />

          <div className="space-y-4">
            <Clerk.Field name="identifier" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-fcTextMuted">Username or Email</Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-lg bg-fcSurface border border-fcBorder px-4 py-2.5 text-sm text-white placeholder:text-fcTextDim outline-none transition-all hover:border-fcGarnet/50 focus:border-fcGarnet focus:ring-2 focus:ring-fcGarnet/20 data-[invalid]:border-red-400 data-[invalid]:ring-red-400/20"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>

            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-fcTextMuted">Password</Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-lg bg-fcSurface border border-fcBorder px-4 py-2.5 text-sm text-white placeholder:text-fcTextDim outline-none transition-all hover:border-fcGarnet/50 focus:border-fcGarnet focus:ring-2 focus:ring-fcGarnet/20 data-[invalid]:border-red-400 data-[invalid]:ring-red-400/20"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>

          <SignIn.Action
            submit
            className="w-full rounded-lg bg-gradient-to-r from-fcGarnet to-fcBlue px-4 py-2.5 text-center text-sm font-semibold text-white shadow-glow-garnet outline-none transition-all hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fcGarnet active:scale-[0.98]"
          >
            Sign In
          </SignIn.Action>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-fcBorder"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-fcDarkBg px-2 text-fcTextDim">New to FC Manager?</span>
            </div>
          </div>

         

          <div className="mt-6 text-center">
            <p className="text-xs text-fcTextDim">
              By signing in, you agree to our{' '}
              <a href="#" className="text-fcGarnet hover:text-fcGold transition-colors">Terms</a> and{' '}
              <a href="#" className="text-fcGarnet hover:text-fcGold transition-colors">Privacy Policy</a>
            </p>
          </div>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}
