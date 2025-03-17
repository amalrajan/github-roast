"use client";

import { Button, Image, Input, Spinner } from "@heroui/react";
import { useState } from "react";

import { title } from "@/components/primitives";

export default function Home() {
  const [username, setUsername] = useState("theprimeagen");
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
      <div className="inline-block max-w-xl text-center justify-center mb-4">
        <span className={title()}>Absolutely&nbsp;</span>
        <span className={title({ color: "violet" })}>stunning&nbsp;</span>
        <br />
        <span className={title()}>praise regardless of your skill level.</span>
      </div>

      <div className="inline-block max-w-xl text-center justify-center mb-10 text-gray-500">
        <i>
          Are you feeling a crushing sense of inadequacy? Do you struggle to
          muster even a faint glimmer of self-confidence? Well, you&apos;re at
          the right place!
        </i>
      </div>
      {username && (
        <div className="mb-10 flex justify-center items-center">
          <Image
            isBlurred
            alt="HeroUI Album Cover"
            className="max-w-xl w-full m-5"
            radius="full"
            src={`https://github.com/${username}.png`}
            width="70%"
          />
        </div>
      )}

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
          color="secondary"
          disabled={isFetching}
          onPress={handleFetchClick}
        >
          Praise Me!
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {isFetching && (
        <div className="mt-4">
          <Spinner size="lg" />
        </div>
      )}

      {result && (
        <div className="max-w-xl w-full mt-4 p-4 rounded text-gray-600 text-sm leading-relaxed text-justify">
          {result}
        </div>
      )}
    </section>
  );
}
