import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-slate-950 to-slate-950" />

      {/* Glow Effects */}
      <div className="absolute w-[420px] h-[420px] bg-violet-600/30 blur-[120px] rounded-full top-[-120px] left-[-120px]" />
      <div className="absolute w-[420px] h-[420px] bg-purple-600/30 blur-[120px] rounded-full bottom-[-120px] right-[-120px]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center gap-5">

        {/* Logo + Heading */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg">
              💰
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">
              AI Finance Tracker
            </h1>
          </div>

          <p className="text-slate-400 text-sm">
            Create your account to start managing money smarter
          </p>
        </div>

        {/* Clerk Sign Up */}
        <div className="scale-95 origin-top">
          <SignUp
            appearance={{
              elements: {
                card: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-400",
                socialButtonsBlockButton:
                  "bg-slate-900 border border-slate-700 text-white hover:bg-slate-800",
                formButtonPrimary:
                  "bg-violet-600 hover:bg-violet-700 text-white",
              },
            }}
            fallbackRedirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-slate-500">
        © 2026 AI Finance Tracker
      </div>

    </div>
  );
}