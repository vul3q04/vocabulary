"use client";

import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { login } from "@/app/actions/auth";

export default function Login() {
  const [stateError, action, pending] = React.useActionState(login, {});
  const [state, setState] = React.useState({
    username: "",
    password: "",
  });

  function submitLogin(e: React.SubmitEvent) {
    e.preventDefault();
    React.startTransition(() => {
      action(state);
    });
  }

  return (
    <Container maxWidth="xs">
      <Card sx={{ p: 4 }}>
        <Typography component="h1" variant="h4">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={submitLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextField
              error={!!stateError.error?.username}
              helperText={stateError.error?.username?.[0] || ""}
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={!!stateError.error?.username ? "error" : "primary"}
              value={state.username}
              onChange={(e) => {
                setState({ ...state, username: e.target.value });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={!!stateError.error?.password}
              helperText={stateError.error?.password?.[0] || ""}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={!!stateError.error?.password ? "error" : "primary"}
              value={state.password}
              onChange={(e) => {
                setState({ ...state, password: e.target.value });
              }}
            />
          </FormControl>
          {stateError.message && (
            <Alert severity="error">{stateError.message}</Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onSubmit={submitLogin}
          >
            Login
          </Button>
          <Button
            type="button"
            color="secondary"
            fullWidth
            variant="contained"
            href="/signup"
          >
            Signup
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
