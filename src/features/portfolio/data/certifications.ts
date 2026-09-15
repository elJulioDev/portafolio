export interface Certification {
  title: string
  desc: string
  date: string
  issuer: string
  url: string
  img: string
}

export const CERTIFICATIONS: Certification[] = [
  {
    title: "AWS Academy Graduate — Cloud Foundations",
    desc: "Fundamentos de la nube AWS: servicios clave, arquitectura, seguridad y modelos de precios.",
    date: "12 jul 2024",
    issuer: "Amazon Web Services Training and Certification",
    url: "https://www.credly.com/badges/0c12e8e5-a9aa-4e92-bb56-e37a909956ff/linked_in_profile",
    img: "https://images.credly.com/images/e3541a0c-dd4a-4820-8052-5001006efc85/blob",
  },
  {
    title: "AWS Academy Graduate — Cloud Security Foundations",
    desc: "Seguridad en la nube: identidades, redes, cifrado y cumplimiento de normativas AWS.",
    date: "5 jul 2026",
    issuer: "Amazon Web Services Training and Certification",
    url: "https://www.credly.com/badges/46b3fa59-cd96-4dc4-a3d3-876eef6f6edc/linked_in_profile",
    img: "https://images.credly.com/images/7f7ea828-a10d-44f8-8baa-58a9c1af7671/blob",
  },
  {
    title: "AWS Academy Graduate — Machine Learning for NLP",
    desc: "Procesamiento de lenguaje natural con servicios de ML de AWS: comprehend, Lex y transcripción.",
    date: "2 jul 2026",
    issuer: "Amazon Web Services Training and Certification",
    url: "https://www.credly.com/badges/eb362ccb-cc96-4284-8096-76de42edcc20/linked_in_profile",
    img: "https://images.credly.com/images/683b2e3c-0d28-42a2-ab84-7203a209f9d0/blob",
  },
  {
    title: "AWS Academy Graduate — Data Engineering",
    desc: "Ingeniería de datos: ETL, Data Pipeline, Glue, Redshift y analítica a escala en AWS.",
    date: "15 ago 2026",
    issuer: "Amazon Web Services Training and Certification",
    url: "https://www.credly.com/badges/9f023a99-106a-4da7-b38c-63e80bf6c131/public_url",
    img: "https://images.credly.com/images/8a28a66c-151d-4f2d-b021-ca7d3e146437/blob",
  },
]
