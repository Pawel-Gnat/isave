export const Banner = () => {
  if (process.env.NEXT_ENV === 'production') return;

  return (
    <div className="text-destructive fixed right-0 bottom-0 flex flex-col p-4 text-right">
      <p className="text-sm">AI functions restricted</p>
      <strong className="text-xl">Development Environment</strong>
    </div>
  );
};
