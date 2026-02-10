"use client";

import { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Globe,
  AlertTriangle,
  Activity,
  Users,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login - redirect to dashboard
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-cyan-600/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI5M2UiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJWMThoMnY0em0wLTZoLTJ2LTRoMnY0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">SIRS</h1>
                <p className="text-xs text-slate-400 tracking-wide">SADC Impact Risk Studio</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              Regional Risk Intelligence
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {" "}for Southern Africa
              </span>
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-10">
              Transforming fragmented risk data into actionable intelligence.
              One shared risk picture powering faster, evidence-based decisions
              across the SADC region.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Globe className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-white">16</p>
                  <p className="text-sm text-slate-400">SADC Member States</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-white">Real-time</p>
                  <p className="text-sm text-slate-400">Risk Monitoring</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Activity className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-white">INFORM</p>
                  <p className="text-sm text-slate-400">Risk Model Powered</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Users className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-white">Multi-Partner</p>
                  <p className="text-sm text-slate-400">Collaboration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Built by</p>
              <p className="text-sm font-semibold text-slate-300">7Square Inc.</p>
              <p className="text-xs text-slate-500">Converting Africa&apos;s Challenges into Opportunities</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Prepared for the</p>
              <p className="text-sm text-slate-400">SADC DRR Community of Practice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SIRS</h1>
              <p className="text-xs text-slate-400">SADC Impact Risk Studio</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Sign in to access the risk intelligence platform</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@sadc.int"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-center text-sm text-slate-500 mb-4">Or sign in with</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-2.5 px-4 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" />
                  SADC SSO
                </button>
                <button className="py-2.5 px-4 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  UN Identity
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            SADC Impact Risk Studio v1.0 &middot; Built by 7Square Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
