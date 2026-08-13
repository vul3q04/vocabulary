"use client";

import React from "react";
import useSWR from "swr";
import * as Material from "@mui/material";
import * as MaterialIcon from "@mui/icons-material";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    return res.json();
  });

export default function Home() {
  const [state, setState] = React.useState({ isActionLoading: false });
  const {
    data: { data: words } = { data: [] },
    error,
    isLoading,
    mutate,
  }: {
    data: { data: { name: string; _id: string }[] };
    error: any;
    isLoading: boolean;
    mutate: () => void;
  } = useSWR("/api/word", fetcher);
  const [word, setWord] = React.useState("");

  function addWord() {
    openGoogleSearch(word);
    setState({ ...state, isActionLoading: true });
    fetch("/api/word", {
      method: "POST",
      body: JSON.stringify({ name: word }),
    })
      .then(() => {
        setWord("");
        mutate();
      })
      .finally(() => {
        setState({ ...state, isActionLoading: false });
      });
  }

  function deleteWord(id: string) {
    setState({ ...state, isActionLoading: true });
    fetch("/api/word", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
      .then(() => {
        mutate();
      })
      .finally(() => {
        setState({ ...state, isActionLoading: false });
      });
  }

  function openGoogleSearch(word: string) {
    const url = `https://www.google.com/search?q=中文 ${encodeURIComponent(word)}`;
    window.open(url, "_blank");
  }

  function openCambridgeDictionary(word: string) {
    const url = `https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/${encodeURIComponent(
      word,
    )}`;
    window.open(url, "_blank");
  }

  return (
    <Material.Card color="inherit">
      <Material.CardContent>
        <Material.Typography variant="h5" color="text.secondary">
          List of vocabulary words for learning English.
        </Material.Typography>
        {error && <p>Error loading words</p>}
        {isLoading && <p>Loading...</p>}
        {words && (
          <div className="">
            {words.map((word, index) => (
              <div key={index} className="flex gap-4 items-center">
                <p>{word.name}</p>
                <Material.Button
                  endIcon={<MaterialIcon.OpenInNew />}
                  onClick={() => openGoogleSearch(word.name)}
                >
                  google
                </Material.Button>
                <Material.Button
                  endIcon={<MaterialIcon.OpenInNew />}
                  onClick={() => openCambridgeDictionary(word.name)}
                >
                  cambridge
                </Material.Button>
                <Material.IconButton
                  color="error"
                  aria-label="delete"
                  onClick={() => deleteWord(word._id)}
                >
                  <MaterialIcon.Delete />
                </Material.IconButton>
              </div>
            ))}
          </div>
        )}
      </Material.CardContent>
      <Material.CardActions>
        <Material.TextField
          type="text"
          name="word"
          placeholder="word"
          variant="outlined"
          color="primary"
          size="small"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <Material.Button
          endIcon={<MaterialIcon.OpenInNew />}
          variant="contained"
          onClick={addWord}
          loading={state.isActionLoading}
        >
          Add
        </Material.Button>
      </Material.CardActions>
    </Material.Card>
  );
}
