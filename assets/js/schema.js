(function injectPersonSchema() {
  // Prevent duplicate injection
  if (document.getElementById("person-schema")) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://chetan-maikhuri.onrender.com/#chetan-maikhuri",
    name: "Chetan Maikhuri",
    url: "https://chetan-maikhuri.onrender.com/",
    jobTitle: "Quality Engineering Leader | SDET Architect",
    description:
      "Director-level Quality Engineering Leader with 13+ years of experience in QA strategy, automation, performance engineering and release governance.",
    sameAs: [
      "https://www.linkedin.com/in/cm6/",
      "https://github.com/programming-maestro",
    ],
    knowsAbout: [
      "Quality Engineering",
      "Test Automation",
      "Performance Testing",
      "SDET Architecture",
      "CI/CD",
      "Release Engineering",
      "Platform Reliability",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Microsoft Azure Fundamentals",
        credentialCategory: "Certification",
        recognizedBy: {
          "@type": "Organization",
          name: "Microsoft",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Azure Developer Associate",
        credentialCategory: "Certification",
        recognizedBy: {
          "@type": "Organization",
          name: "Microsoft",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Azure Administrator Associate",
        credentialCategory: "Certification",
        recognizedBy: {
          "@type": "Organization",
          name: "Microsoft",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Microsoft SQL Server Developer",
        credentialCategory: "Certification",
        recognizedBy: {
          "@type": "Organization",
          name: "Microsoft",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Masters in Information Technology",
        credentialCategory: "Degree",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Masters in Financial Management",
        credentialCategory: "Degree",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "GNIIT Software Engineering Program",
        credentialCategory: "Diploma",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Advanced Data Science Program",
        credentialCategory: "Postgraduate Program",
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "IIIT Bangalore",
        },
      },
    ],
  };

  const script = document.createElement("script");
  script.id = "person-schema";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema, null, 2);

  document.head.appendChild(script);
})();
