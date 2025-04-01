import { Heading } from '@/components/shared/heading';
import { auth } from '@/lib/auth';

const SettingsPage = async () => {
  const session = await auth();

  return (
    <>
      <Heading text="Ustawienia" />
      <p>
        <span className="font-bold">Nazwa konta:</span> {session?.user?.name}
      </p>
      <p>
        <span className="font-bold">Adres e-mail:</span> {session?.user?.email}
      </p>
      <p>
        <span className="font-bold">ID zaproszenia do budżetu:</span>{' '}
        {session?.user?.inviteId}
      </p>
    </>
  );
};

export default SettingsPage;
