import { useState } from "react";

export function App() {
  const [error, setError] = useState<Error | null>(null);
  const [sended, setSended] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const response = await fetch(
      new URL("api/files", import.meta.env.VITE_API_URL),
      { method: "POST", body: new FormData(e.currentTarget) }
    );

    if (!response.ok) {
      const { message } = await response.json();
      setError(new Error(message));
      return;
    }

    setSended(true);
  };

  return (
    <div>
      {!!error && (
        <div>
          {error.message}{" "}
          <button type="button" onClick={() => setError(null)}>
            Fechar
          </button>
        </div>
      )}

      {sended && (
        <div>
          CSV enviado com sucesso!{" "}
          <button type="button" onClick={() => setSended(false)}>
            Fechar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="csv">CSV File</label>
          <input type="file" id="csv" name="csv" accept="text/csv" required />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
