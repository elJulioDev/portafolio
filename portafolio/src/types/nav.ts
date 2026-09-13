import type { Route } from "next"

export type NavItem<T extends string = string> = {
  title: string
  href: T
}