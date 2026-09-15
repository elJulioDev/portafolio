"use client"

import { useCallback, useRef } from "react"
import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"

import { META_THEME_COLORS } from "@/config/site"
import { MoonIcon } from "@/components/animated-icons/moon-icon"
import { SunMediumIcon } from "@/components/animated-icons/sun-medium-icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

const CLICK_SOFT_URI =
  "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjMuMTAwAAAAAAAAAAAAAAD/+1DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAIAAAJxAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr//////////////////////////////////////////////////////////////////wAAAABMYXZjNjIuMTEAAAAAAAAAAAAAAAAkBYYAAAAAAAACcU7MYgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAACghZUlTHgAGDlWufHzAAAVWgJg3EszX3mlF95pSk7enve+GBDEMNMg4R8BLACwAsA7BVjjOhDEMQxWKx5EcJwfB/KBiU8/wI7QH+BHaA/ynv6PB8/LgQEMgD78CHO/oGiAIBAQBAYFAA1hDi4z22DmJ7Et+PSEd1f8Y4PmLI5uDYKAWyCmBlSZJ3gAmD0RBEUDS/HKFzC5iZIr/5FTIvE0Yl3/8ipkXi8Yl0u/xEFQVER7/WCoiCoKiL/4VBURPOqgAQuacbblgZh//7UsQEg8aUBv9cMIAgAAA0gAAABIKqErhFDZUNQ7PRK4S8s8r1HiuGlHuSnenrcW9yvO/PcFflep5XqPKfrO9NTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
let cachedBuffer: AudioBuffer | null = null
let audioCtx: AudioContext | null = null

function playClickSoft() {
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === "suspended") audioCtx.resume()

  const base64 = CLICK_SOFT_URI.split(",")[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  const play = (buffer: AudioBuffer) => {
    const source = audioCtx!.createBufferSource()
    const gain = audioCtx!.createGain()
    source.buffer = buffer
    gain.gain.value = 0.3
    source.connect(gain)
    gain.connect(audioCtx!.destination)
    source.start(0)
  }

  if (cachedBuffer) {
    play(cachedBuffer)
  } else {
    audioCtx.decodeAudioData(bytes.buffer.slice(0)).then((buf) => {
      cachedBuffer = buf
      play(buf)
    })
  }
}

export function ThemeToggle() {
  const { resolvedTheme, systemTheme, setTheme } = useTheme()

  const switchTheme = useCallback(() => {
    playClickSoft()

    const next = resolvedTheme === "dark" ? "light" : "dark"

    setTheme(next === systemTheme ? "system" : next)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        resolvedTheme === "dark"
          ? META_THEME_COLORS.light
          : META_THEME_COLORS.dark
      )
  }, [resolvedTheme, systemTheme, setTheme])

  useHotkeys("d", () => switchTheme())

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="relative touch-manipulation border-none"
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle mode"
            onClick={() => switchTheme()}
          >
            <span
              className="absolute size-12 pointer-fine:hidden"
              aria-hidden
            />
            <MoonIcon className="hidden [html.dark_&]:block" aria-hidden />
            <SunMediumIcon
              className="hidden [html.light_&]:block"
              aria-hidden
            />
          </Button>
        }
      />
      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          Toggle mode
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}