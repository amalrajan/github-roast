"use client";

import { Button, Image, Input, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";

export default function Home() {
  const [username, setUsername] = useState("theprimeagen");
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [result, setResult] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (result && !isFetching) {
      let i = 0;

      setDisplayedText(""); // Reset text before typing

      const interval = setInterval(() => {
        if (i <= result.length) {
          setDisplayedText(result.substring(0, i)); // Use substring to avoid extra characters
          i++;
        } else {
          clearInterval(interval);
        }
      }, 5); // 5ms per character

      return () => clearInterval(interval); // Clean up on unmount
    }
  }, [result, isFetching]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "") {
      setUsername("theprimeagen");
    }
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

      <div className="inline-block max-w-xl text-center justify-center mb-10 text-gray-400">
        Are you feeling a crushing sense of inadequacy? Do you struggle to
        muster even a faint glimmer of self-confidence? Well, you&apos;re at the
        right place!
      </div>
      {username && (
        <div className="mb-10 flex justify-center items-center">
          <Image
            isBlurred
            alt="GitHub Profile Picture"
            height={300}
            radius="full"
            src={`https://github.com/${username}.png`}
            width={300}
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

      {displayedText && isFetching === false && (
        <div className="max-w-xl w-full mt-4 mb-10 p-4 rounded text-sm leading-relaxed whitespace-pre-wrap">
          {displayedText}
        </div>
      )}
    </section>
  );
}
