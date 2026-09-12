import { SiteHeader } from "@/features/portfolio/components/site-header"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Overview } from "@/features/portfolio/components/overview"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { Projects } from "@/features/portfolio/components/projects"
import { Certifications } from "@/features/portfolio/components/certifications"
import { Experiences } from "@/features/portfolio/components/experiences"
import { Education } from "@/features/portfolio/components/education"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { ContactForm } from "@/features/portfolio/components/contact-form"
import { Separator } from "@/features/portfolio/components/separator"
import { Footer } from "@/features/portfolio/components/footer"

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl">
        <ProfileHeader />
        <Separator />
        <Overview />
        <Separator />
        <SocialLinks />
        <Separator variant="stripe" />
        <TechStack />
        <Projects />
        <Separator variant="stripe" />
        <Experiences />
        <Education />
        <Certifications />
        <Separator variant="stripe" />
        <GitHubContributions />
        <Separator />
        <ContactForm />
      </main>

      <Separator variant="stripe" />
      <Footer />
    </>
  )
}
