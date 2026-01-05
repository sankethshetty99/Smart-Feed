import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-muted-foreground text-center max-w-[300px] mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link href="/">
        <Button className="w-full max-w-xs font-semibold rounded-xl h-12">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
