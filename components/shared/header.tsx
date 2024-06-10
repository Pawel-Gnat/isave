import getCurrentUser from '@/actions/getCurrentUser';

const Header = async () => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-10 ml-1 flex items-center justify-between rounded-bl-lg bg-background p-6">
      <div className="flex flex-row gap-4">
        <div className="text-left">
          <span className="hidden font-bold md:block">{user?.name || ''}</span>
          <span className="hidden md:block">{user?.email || ''}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
