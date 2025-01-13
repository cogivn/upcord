import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginButtons } from "@/components/auth/login-buttons";
import Image from "next/image";
import { getRandomAuthImage } from "@/lib/images";

export default async function LoginPage() {
  const session = await getServerSession();
  const authImage = getRandomAuthImage();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-black p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0">
          <Image
            src={authImage.url}
            alt={authImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 0vw, 50vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50" />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="rounded-lg bg-black/30 p-2 backdrop-blur-sm border border-white/10 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Upcord
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg bg-black/30 p-4 rounded-lg backdrop-blur-sm border border-white/10">
              &ldquo;Manage your Discord status and notifications through Telegram with ease.&rdquo;
            </p>
            <footer className="text-sm bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm inline-block border border-white/10">
              Built with Next.js and Shadcn UI
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in with Discord to continue
            </p>
          </div>
          <LoginButtons />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
