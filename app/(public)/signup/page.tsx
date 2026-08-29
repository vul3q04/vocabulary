"use client";

import React from "react";
import useSWR from "swr";
import {
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
import { signup } from "@/app/actions/auth";

export default function Signup() {
  const [stateError, action, pending] = React.useActionState(signup, {});
  const [state, setState] = React.useState({
    username: "",
    password: "",
    invite_code: "",
  });

  function submitSignup(e: React.SubmitEvent) {
    e.preventDefault();
    React.startTransition(() => {
      action(state);
    });
  }

  return (
    <Container maxWidth="sm" className="gap-4 py-32">
      <Card className="p-4">
        <Typography component="h1" variant="h4">
          Signup
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
          onSubmit={submitSignup}
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
              onChange={(e) => setState({ ...state, username: e.target.value })}
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
              onChange={(e) => setState({ ...state, password: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="invite_code">Invite Code</FormLabel>
            <TextField
              error={!!stateError.error?.invite_code}
              helperText={stateError.error?.invite_code?.[0] || ""}
              id="invite_code"
              type="text"
              name="invite_code"
              placeholder="Invite Code"
              autoComplete="invite_code"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={!!stateError.error?.invite_code ? "error" : "primary"}
              value={state.invite_code}
              onChange={(e) =>
                setState({ ...state, invite_code: e.target.value })
              }
            />
          </FormControl>
          <Button type="submit" fullWidth variant="contained">
            Signup
          </Button>
          <Button type="button" fullWidth variant="outlined" href="/login">
            Back to login
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
