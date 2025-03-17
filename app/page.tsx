"use client";

import { title } from "@/components/primitives";
import { Button, Input, Spinner } from "@heroui/react";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [result, setResult] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleFetchClick = async () => {
    if (!username) {
      setError("Please enter a GitHub username.");
      return;
    }
    setIsFetching(true);
    setError("");
    // setResult("Generating...");
    try {
      const res = await fetch("/api/githubData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.summary);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center mb-20">
        <span className={title()}>Absolutely&nbsp;</span>
        <span className={title({ color: "violet" })}>stunning&nbsp;</span>
        <br />
        <span className={title()}>praise regardless of your skill level.</span>
      </div>

      <div className="flex flex-col w-full items-center">
        <Input
          className="max-w-xl w-full mx-auto"
          label="username"
          placeholder="Enter your GitHub username"
          type="text"
          value={username}
          onChange={handleInputChange}
        />
        <Button
          className="max-w-xl w-full mt-4"
          color="primary"
          disabled={isFetching}
          onPress={handleFetchClick}
        >
          Fetch
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {isFetching && (
        <div className="mt-4">
          <Spinner size="lg" />
        </div>
      )}
      {result && (
        <div className="max-w-xl w-full mt-4 p-4 border rounded">
          {result}
        </div>
      )}
    </section>
  );
}
