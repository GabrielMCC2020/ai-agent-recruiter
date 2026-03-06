import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-6 py-16">
      <SignIn 
        routing="path" 
        path="/sign-in"
        forceRedirectUrl="/dashboard"
      />
    </main>
  );
}
