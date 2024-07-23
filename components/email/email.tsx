interface EmailTemplateProps {
  name: string;
  id: string;
}

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://isave-ten.vercel.app';

export const EmailTemplate = ({ name, id }: EmailTemplateProps) => (
  <div>
    <h1>Cześć, {name}!</h1>
    <br />
    <p>Kliknij w link aktywacyjny, aby uzyskać dostęp do aplikacji.</p>
    <br />
    <p>
      <strong>
        <a href={`${baseUrl}/activate/${id}`}>Aktywuj konto</a>
      </strong>
    </p>
    <br />
    <p>
      Aplikacja nie jest produktem komercyjnym,{' '}
      <strong>nie zbieram informacji o Twoich danych osobowych</strong>. Aplikacja służy
      wyłącznie dla rozwoju jako programista.
    </p>
    <br />
    <p>Aktywując konto wyrażasz zgodę na testowy udział w rozwoju aplikacji.</p>
    <br />
    <p>Jeśli wiadomość trafiła do Ciebie przez pomyłkę, proszę zignoruj ją.</p>
  </div>
);
