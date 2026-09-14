"use client"

import { useEffect, useState } from "react"

import { GITHUB_USERNAME } from "@/config/site"
import { GitHubStars } from "@/components/github-stars"

export function NavItemGitHub() {
  const [stargazersCount, setStargazersCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchStargazers() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/portafolio`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        )

        if (!response.ok) {
          return
        }

        const json = (await response.json()) as { stargazers_count?: number }
        setStargazersCount(Number(json?.stargazers_count) || 0)
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          // Silently fail
        }
      }
    }

    fetchStargazers()
    return () => controller.abort()
  }, [])

  return (
    <GitHubStars
      repo={`${GITHUB_USERNAME}/portafolio`}
      stargazersCount={stargazersCount}
    />
  )
}