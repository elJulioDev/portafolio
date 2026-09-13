import { cn } from "@/lib/utils"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Overview } from "@/features/portfolio/components/overview"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { Projects } from "@/features/portfolio/components/projects"
import { Certifications } from "@/features/portfolio/components/certifications"
import { Experiences } from "@/features/portfolio/components/experiences"
import { Education } from "@/features/portfolio/components/education"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { About } from "@/features/portfolio/components/about"
import { ContactForm } from "@/features/portfolio/components/contact-form"
import { Footer } from "@/features/portfolio/components/footer"

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "stripe-divider h-(--separator-height) w-full border-x",
        className
      )}
    />
  )
}

export default function Home() {
  return (
    <div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
      <div className="mx-auto md:max-w-3xl">
        <ProfileHeader />
        <Separator />

        <Overview />
        <SocialLinks />
        <GitHubContributions />
        <Separator />
        
        <About />
        <Separator />

        <TechStack />
        <Separator />

        <Experiences />
        <Separator />

        <Education />
        <Separator />

        <Projects />
        <Separator />

        <Certifications />
        <Separator />

        <ContactForm />
      </div>

      <Footer />
    </div>
  )
}
