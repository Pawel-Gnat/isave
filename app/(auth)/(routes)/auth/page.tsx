'use client';

import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import LoginForm from './components/login-form';
import RegisterForm from './components/register-form';

const AuthPage = () => {
  const [login, setIsLogin] = useState(true);

  const toggleAuthStatus = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="container grid min-h-screen items-center px-4 sm:px-8">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>
            {login ? 'Zaloguj się na swoje konto.' : 'Utwórz swoje konto.'}
          </CardTitle>
          <CardDescription>
            {login
              ? 'Podaj swój adres email i hasło, aby się zalogować.'
              : 'Podaj swoje dane osobiste, adres email i hasło, aby utworzyć konto.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {login ? <LoginForm /> : <RegisterForm toggleAuthStatus={toggleAuthStatus} />}
        </CardContent>
        <CardFooter>
          <p>{login ? `Nie masz konta?` : 'Masz już konto?'}</p>
          <button onClick={toggleAuthStatus} className="ml-1 underline">
            {login ? 'Utwórz konto' : 'Zaloguj się'}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
