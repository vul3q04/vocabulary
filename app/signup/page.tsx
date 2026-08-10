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

export default function Signup() {
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [inviteCodeError, setInviteCodeError] = React.useState(false);
  const [inviteCodeErrorMessage, setInviteCodeErrorMessage] =
    React.useState("");

  function handleSubmit() {
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: (document.getElementById("username") as HTMLInputElement)
          .value,
        password: (document.getElementById("password") as HTMLInputElement)
          .value,
        invite_code: (document.getElementById("invite_code") as HTMLInputElement)
          .value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "/";
        } else {
          setUsernameError(true);
          setUsernameErrorMessage(data.message);
          setPasswordError(true);
          setPasswordErrorMessage(data.message);
          setInviteCodeError(true);
          setInviteCodeErrorMessage(data.message);
        }
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
        >
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={usernameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="invite_code">Invite Code</FormLabel>
            <TextField
              error={inviteCodeError}
              helperText={inviteCodeErrorMessage}
              id="invite_code"
              type="text"
              name="invite_code"
              placeholder="Invite Code"
              autoComplete="invite_code"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={inviteCodeError ? "error" : "primary"}
            />
          </FormControl>
          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Signup
          </Button>
          <Button type="button" fullWidth variant="contained" href="/login">
            Login
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
