import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';

const SettingsPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Ustawienia" />
      <p>
        <span className="font-bold">Nazwa konta:</span> {user.name}
      </p>
      <p>
        <span className="font-bold">Adres e-mail:</span> {user.email}
      </p>
      <p>
        <span className="font-bold">ID zaproszenia do budżetu:</span> {user.inviteId}
      </p>
    </>
  );
};

export default SettingsPage;
