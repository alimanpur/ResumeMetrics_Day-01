import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router'

// Marketing pages
const Landing = lazy(() => import('./pages/Landing.jsx'))
const AtsIntelligence = lazy(() => import('./pages/AtsIntelligence.jsx'))
const PricingComingSoon = lazy(() => import('./pages/PricingComingSoon.jsx'))
const CaseStudies = lazy(() => import('./pages/CaseStudies.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Faq = lazy(() => import('./pages/Faq.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))

// Auth pages
const SignIn = lazy(() => import('./pages/SignIn.jsx'))
const SignUp = lazy(() => import('./pages/SignUp.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail.jsx'))

// App pages
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Upload = lazy(() => import('./pages/Upload.jsx'))
const Analysis = lazy(() => import('./pages/Analysis.jsx'))
const History = lazy(() => import('./pages/History.jsx'))
const Compare = lazy(() => import('./pages/Compare.jsx'))
const JobMatch = lazy(() => import('./pages/JobMatch.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Billing = lazy(() => import('./pages/Billing.jsx'))
const Help = lazy(() => import('./pages/Help.jsx'))

// Not Found
import NotFound from './pages/NotFound.jsx'

// Layouts
import { AppShell } from './components/app/AppShell.jsx'
import { MarketingLayout } from './components/marketing/MarketingLayout.jsx'

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="font-mono text-sm text-ink/40">Loading…</div>
    </div>
  )
}

function AnimatedPage({ children }) {
  const location = useLocation()
  return children
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Marketing routes */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
          <Route path="/ats-intelligence" element={<AnimatedPage><AtsIntelligence /></AnimatedPage>} />
          <Route path="/pricing" element={<AnimatedPage><PricingComingSoon /></AnimatedPage>} />
          <Route path="/case-studies" element={<AnimatedPage><CaseStudies /></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
          <Route path="/faq" element={<AnimatedPage><Faq /></AnimatedPage>} />
          <Route path="/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
          <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
        </Route>

        {/* Auth routes */}
        <Route path="/sign-in" element={<AnimatedPage><SignIn /></AnimatedPage>} />
        <Route path="/sign-up" element={<AnimatedPage><SignUp /></AnimatedPage>} />
        <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
        <Route path="/reset-password" element={<AnimatedPage><ResetPassword /></AnimatedPage>} />
        <Route path="/verify-email" element={<AnimatedPage><VerifyEmail /></AnimatedPage>} />

        {/* App routes */}
        <Route path="/dashboard" element={<AnimatedPage><AppShell><Dashboard /></AppShell></AnimatedPage>} />
        <Route path="/upload" element={<AnimatedPage><AppShell><Upload /></AppShell></AnimatedPage>} />
        <Route path="/analysis/:id" element={<AnimatedPage><AppShell><Analysis /></AppShell></AnimatedPage>} />
        <Route path="/history" element={<AnimatedPage><AppShell><History /></AppShell></AnimatedPage>} />
        <Route path="/compare" element={<AnimatedPage><AppShell><Compare /></AppShell></AnimatedPage>} />
        <Route path="/job-match" element={<AnimatedPage><AppShell><JobMatch /></AppShell></AnimatedPage>} />
        <Route path="/settings" element={<AnimatedPage><AppShell><Settings /></AppShell></AnimatedPage>} />
        <Route path="/billing" element={<AnimatedPage><AppShell><Billing /></AppShell></AnimatedPage>} />
        <Route path="/help" element={<AnimatedPage><AppShell><Help /></AppShell></AnimatedPage>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App