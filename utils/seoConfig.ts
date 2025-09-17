
export const seoConfig = {
  title: "Arnaud Brégère | Développeur Front-End",
  meta: [
    {
      name: "description",
      content:
        "Portfolio interactif d'Arnaud Brégère, Développeur Front-End spécialisé en interfaces modernes et dynamiques. Découvrez mes projets, compétences et expériences.",
    },
    {
      name: "keywords",
      content:
        "développeur front-end, portfolio, web development, Nuxt.js, Vue.js, JavaScript, interfaces utilisateur",
    },
    {
      name: "author",
      content: "Arnaud Brégère",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
    {
      property: "og:title",
      content: "Arnaud Brégère - Portfolio Développeur Front-End",
    },
    {
      property: "og:description",
      content:
        "Explorez le portfolio d'Arnaud Brégère, expert en développement Front-End. Découvrez des projets innovants et des interfaces utilisateur au design unique.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://arnaudbregere.fr",
    },
    {
      property: "og:image",
      content: "/images/og-image.jpg",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "Arnaud Brégère | Développeur Front-End",
    },
    {
      name: "twitter:description",
      content:
        "Portfolio d'Arnaud Brégère, Développeur Front-End créatif, spécialisé en Vue.js, Nuxt.js et design interactif.",
    },
    {
      name: "twitter:image",
      content: "/images/og-image.jpg",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://arnaudbregere.fr",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Arnaud Brégère",
        jobTitle: "Développeur Front-End",
        url: "https://arnaudbregere.fr",
        sameAs: [
          "https://www.linkedin.com/in/arnaud-bregere/",
          "https://github.com/arnaud-bregere",
        ],
        description:
          "Développeur Front-End passionné par la création d'interfaces utilisateur modernes et interactives avec une esthétique rétro-futuriste.",
      }),
    },
  ],
};