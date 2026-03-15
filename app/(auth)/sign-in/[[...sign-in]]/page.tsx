import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-slate-950 to-slate-950" />

      {/* Glow Effects */}
      <div className="absolute w-[400px] h-[400px] bg-violet-600/30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

      {/* Auth Container */}
      <div className="relative z-10 flex flex-col items-center gap-4">

        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg">
              💰
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              AI Finance Tracker
            </h1>
          </div>

          <p className="text-slate-400 text-xs">
            Smart AI powered money management
          </p>
        </div>

        {/* Clerk SignIn */}
        <div className="scale-95 origin-top">
          <SignIn
            appearance={{
              elements: {
                card: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl",
              },
            }}
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>

      </div>
    </div>
  );
}