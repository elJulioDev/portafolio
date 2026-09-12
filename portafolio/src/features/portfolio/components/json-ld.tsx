import { siteConfig } from "@/config/site"

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    alternateName: siteConfig.username,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/me.jpeg`,
    jobTitle: "Ingeniero en Informática",
    worksFor: { "@type": "Organization", name: siteConfig.username },
    email: `mailto:${siteConfig.email}`,
    sameAs: [siteConfig.github, siteConfig.linkedin],
    knowsAbout: [
      "Desarrollo Full Stack",
      "JavaScript",
      "Python",
      "PHP",
      "MySQL",
      "Machine Learning",
      "Videojuegos",
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteConfig.name} | Desarrollador Full Stack`,
    url: siteConfig.url,
    inLanguage: "es",
    description: siteConfig.description,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
