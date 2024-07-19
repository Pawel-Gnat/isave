export const Banner = () => {
  // if (process.env.NEXT_PUBLIC_ENV === 'production') return;

  return (
    <div className="fixed bottom-0 right-0 flex flex-col p-4 text-right text-destructive">
      <p className="text-sm">AI functions restricted</p>
      <strong className="text-xl">Development Environment</strong>
    </div>
  );
};
