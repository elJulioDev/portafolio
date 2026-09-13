"use client"

import { useEffect, useState } from "react"

import { GITHUB_USERNAME } from "@/config/site"
import { GitHubStars } from "@/components/github-stars"

export function NavItemGitHub() {
  const [stargazersCount, setStargazersCount] = useState(0)

  useEffect(() => {
    async function fetchStargazers() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2026-03-10",
            },
          }
        )

        if (!response.ok) {
          return
        }

        const json = (await response.json()) as { stargazers_count?: number }
        setStargazersCount(Number(json?.stargazers_count) || 0)
      } catch {
        // Silently fail
      }
    }

    fetchStargazers()
  }, [])

  return (
    <GitHubStars
      repo={`${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io`}
      stargazersCount={stargazersCount}
    />
  )
}