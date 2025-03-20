import { NextResponse } from "next/server";

interface GithubDataRequestBody {
  username: string;
}

export async function POST(request: Request) {
  try {
    // Read the username from the request body.
    const { username } = (await request.json()) as GithubDataRequestBody;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 },
      );
    }

    // Use server-only environment variables.
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) throw new Error("GitHub token is not configured.");

    // Fetch GitHub user data.
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          "User-Agent": "request",
        },
      },
    );

    if (!userResponse.ok) {
      const errorDetails = await userResponse.text();

      return NextResponse.json(
        { error: `GitHub API Error: ${userResponse.status} - ${errorDetails}` },
        { status: userResponse.status },
      );
    }
    const userData = await userResponse.json();

    // Fetch the repositories.
    const reposResponse = await fetch(userData.repos_url, {
      headers: {
        Authorization: `token ${githubToken}`,
        "User-Agent": "request",
      },
    });

    if (!reposResponse.ok) {
      const errorDetails = await reposResponse.text();

      return NextResponse.json(
        {
          error: `GitHub Repos API Error: ${reposResponse.status} - ${errorDetails}`,
        },
        { status: reposResponse.status },
      );
    }
    const reposData = await reposResponse.json();

    // Fetch languages for each repository.
    const langCounts: { [lang: string]: number } = {};

    for (const repo of reposData) {
      const langResponse = await fetch(repo.languages_url, {
        headers: {
          Authorization: `token ${githubToken}`,
          "User-Agent": "request",
        },
      });

      if (langResponse.ok) {
        const languages = await langResponse.json();

        for (const lang in languages) {
          langCounts[lang] = (langCounts[lang] || 0) + languages[lang];
        }
      }
    }

    // Get the top 20 repositories by stars.
    const topRepos = reposData
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 20);

    // Get the top 3 languages by usage.
    const sortedLanguages = Object.entries(langCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 3)
      .map(([lang]) => lang);

    const summary = `
GitHub User Summary:
Username: ${userData.login}
Name: ${userData.name || "N/A"}
Bio: ${userData.bio || "N/A"}
Location: ${userData.location || "N/A"}
Followers: ${userData.followers}
Following: ${userData.following}
Public Repos: ${userData.public_repos}
Top Repositories: ${topRepos.map((repo: any) => `${repo.name}`).join(", ")}
Top Languages: ${sortedLanguages.join(", ")}
    `.trim();

    const groqApiKey = process.env.GROQ_API_KEY;

    if (groqApiKey) {
      const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";

      const groqResponse = await fetch(groqEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `Write a scathing, sarcastic, two-paragraph speech like roast of this GitHub user based on their stats. In the first paragraph, utterly annihilate their bio, location, and follower/following count - what kind of loser has that few followers? Towards the end of first paragraph and in the beginning of second paragraph, eviscerate their repositories - which ones are the most cringeworthy, and what do they say about this person's coding skills (or lack thereof)? Be ruthless. In the second paragraph, mock their top 3 programming languages (you're given those) and use them to make a broader point about their intelligence, work ethic, and overall personality. Think of the most creative ways to insult their coding abilities, problem-solving skills, and general competence as a human being. Don't hold back - we want to see a roast that's both hilarious and devastating. Go ahead, tear this GitHub user apart, and leave no stone unturned in your ridicule.:\n\n${summary}`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!groqResponse.ok) {
        const errorDetails = await groqResponse.text();

        return NextResponse.json(
          { error: `Groq API Error: ${groqResponse.status} - ${errorDetails}` },
          { status: groqResponse.status },
        );
      }
      const groqData = await groqResponse.json();

      // Return the result from Groq.
      return NextResponse.json({
        summary: groqData.choices[0].message.content,
      });
    }

    // If Groq is not called, return the generated summary directly.
    return NextResponse.json({ summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
