"use client"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/'

  return (
    <div className="flex h-screen w-full items-center justify-center relative overflow-hidden bg-black/90">
      {/* Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]" />
      
      {/* Login Card (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center">
        
        <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <i className="bx bx-fingerprint text-3xl text-white"></i>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">WJEXSTUDIO OS</h1>
        <p className="text-gray-400 text-sm mb-10 text-center">Secure Access Gateway. Only authorized admins may enter.</p>

        <button 
          onClick={() => signIn('google', { callbackUrl: from })}
          className="w-full relative group overflow-hidden rounded-xl p-[1px]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center gap-3 bg-black/80 px-6 py-4 rounded-xl transition-all duration-300 group-hover:bg-black/50">
            <i className="bx bxl-google text-2xl text-white"></i>
            <span className="text-white font-medium tracking-wide">Continue with Google</span>
          </div>
        </button>

        <div className="mt-8 text-xs text-gray-500 flex items-center gap-2">
          <i className="bx bx-shield-alt-2"></i>
          Powered by NextAuth.js
        </div>
      </div>
    </div>
  )
}
