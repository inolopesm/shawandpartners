import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  city: string;
  country: string;
  favoriteSport: string;
}

const getUsers = async () => {
  const url = new URL("api/users", import.meta.env.VITE_API_URL);
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data as User[];
};

export function App() {
  const [error, setError] = useState<Error | null>(null);
  const [sended, setSended] = useState(false);
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        new URL("api/files", import.meta.env.VITE_API_URL),
        { method: "POST", body: new FormData(e.currentTarget) }
      );

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      setSended(true);
    } catch (err) {
      setError(err as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!!error && (
        <div>
          {error.message}{" "}
          <button
            type="button"
            onClick={() => setError(null)}
            disabled={loading}
          >
            Fechar
          </button>
        </div>
      )}

      {sended && (
        <div>
          CSV enviado com sucesso!{" "}
          <button
            type="button"
            onClick={() => setSended(false)}
            disabled={loading}
          >
            Fechar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="csv">CSV File</label>
          <input
            type="file"
            id="csv"
            name="csv"
            accept="text/csv"
            disabled={loading}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>

      <pre>
        <code>{JSON.stringify(users, null, 4)}</code>
      </pre>
    </div>
  );
}
