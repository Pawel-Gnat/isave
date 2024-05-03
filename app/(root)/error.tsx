'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h2>Something went wrong!</h2>
      {/* <Button onClick={() => reset()} className="w-fit">
        Try again
      </Button>
      <NavLink href="/" label="Go to the dashboard" icon={LuNavigation} /> */}
    </div>
  );
}
