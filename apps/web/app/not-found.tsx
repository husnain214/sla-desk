import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        404
      </h1>
      <p className="text-sm text-muted-foreground">This page doesn't exist.</p>
      <Button render={<Link href="/">Back to tickets</Link>} />
    </div>
  );
}
