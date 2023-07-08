import { useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import grey from "@mui/material/colors/grey";

interface User {
  id: number;
  name: string;
  city: string;
  country: string;
  favoriteSport: string;
}

const getUsers = async (query?: string) => {
  const url = new URL("api/users", import.meta.env.VITE_API_URL);
  if (query) url.searchParams.set("q", query);
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
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const [file] = Array.from(e.target.files ?? []);
    setFile(file ?? null);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);

    try {
      const response = await fetch(
        new URL("api/files", import.meta.env.VITE_API_URL),
        { method: "POST", body: new FormData(formRef.current) }
      );

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      setSended(true);
      formRef.current.reset();
    } catch (err) {
      setError(err as any);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);

    getUsers(query)
      .then((data) => setUsers(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Box bgcolor={grey[300]} minHeight="100vh">
      <Container
        maxWidth="sm"
        sx={{ py: 5, display: "flex", flexDirection: "column", gap: 4 }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          {!!error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error.message}
            </Alert>
          )}

          {sended && (
            <Alert onClose={() => setSended(false)}>
              CSV enviado com sucesso!
            </Alert>
          )}
        </Box>

        <Paper
          component="form"
          onSubmit={handleSubmit}
          ref={formRef}
          onReset={() => setFile(null)}
          sx={{ p: 2, display: "flex", justifyContent: "center" }}
        >
          <input
            type="file"
            name="csv"
            accept="text/csv"
            ref={inputRef}
            onChange={handleChange}
            style={{ display: "none" }}
            required
          />
          {file ? (
            <Box display="flex" width="100%" alignItems="center">
              <Box mr="auto">{file.name}</Box>
              <Button
                variant="outlined"
                type="reset"
                disabled={loading}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={loading}>
                Send
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => inputRef.current?.click()}
            >
              choose csv file
            </Button>
          )}
        </Paper>

        <Paper>
          <Box
            component="form"
            onSubmit={handleSearch}
            p={2}
            display="flex"
            gap={1}
            alignItems="center"
          >
            <TextField
              label="Search"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
            />
            <Button variant="contained" type="submit">
              Search
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Favorite Sport</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.city}</TableCell>
                      <TableCell>{user.country}</TableCell>
                      <TableCell>{user.favoriteSport}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    <TableRow>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell>...</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}
