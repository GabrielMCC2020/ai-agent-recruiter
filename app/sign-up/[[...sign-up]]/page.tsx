import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-6 py-16">
      <SignUp 
        routing="path" 
        path="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </main>
  );
}
