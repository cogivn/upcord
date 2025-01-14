import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Manage Your Discord Status <br />
          with <span className="text-primary">Upcord</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Keep your Discord status online during work hours and forward important notifications to Telegram.
          Never miss a message while staying in control of your online presence.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <a href="#">Get Started</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/your-repo/upcord" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
