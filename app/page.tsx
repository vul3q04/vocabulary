"use client";

import React from "react";
import useSWR from "swr";
import { Button, TextField } from "@mui/material";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    return res.json();
  });

export default function Home() {
  const {
    data: { data: words } = { data: [] },
    error,
    isLoading,
    mutate,
  }: {
    data: { data: { name: string }[] };
    error: any;
    isLoading: boolean;
    mutate: () => void;
  } = useSWR("/api/word", fetcher);
  const [word, setWord] = React.useState("");

  function addWord() {
    fetch("/api/word", {
      method: "POST",
      body: JSON.stringify({ name: word }),
    }).then(() => {
      setWord("");
      mutate();
    });
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            List of vocabulary words for learning English.
          </h1>
          {error && <p>Error loading words</p>}
          {isLoading && <p>Loading...</p>}
          {words && (
            <div className="block max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {words.map((word, index) => (
                <p key={index}>
                  {index}: {word.name}
                </p>
              ))}
            </div>
          )}

          <TextField
            type="text"
            name="word"
            placeholder="word"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color="primary"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <Button variant="contained" onClick={addWord}>
            Add
          </Button>
        </div>
      </main>
    </div>
  );
}
