import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Investing" />
      <main className="max-w-md mx-auto px-4 pt-6">
        {/* Content removed */}
      </main>
      <BottomNav />
    </div>
  );
}