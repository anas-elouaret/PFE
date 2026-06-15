export const projectCategories = [
  "All",
  "Web Design",
  "Branding",
  "UGC",
  "Video Editing",
  "Development",
  "UI/UX",
  "Marketing",
];

export const projects = [];

/*

  ── Add a real project ────────────────────────────────

  Copy this structure into the projects array above:

  {
    id: "my-project-slug",
    title: "Project Title",
    category: "Web Design",       // must match one of projectCategories
    description: "Full description of the project, its goals, and outcome.",
    shortDescription: "One-line summary for card display.",
    technologies: ["React", "Figma", "Tailwind"],
    date: "2025-06-01",
    budget: "XX,XXX MAD",
    satisfaction: 96,              // 0–100
    rating: 4.8,                   // 0–5
    likes: 120,
    comments: 34,
    image: "/images/project-thumbnail.jpg",
    gallery: [
      "/images/gallery-1.jpg",
      "/images/gallery-2.jpg",
      "/images/gallery-3.jpg",
    ],
    beforeAfter: {
      before: "/images/before.jpg",
      after: "/images/after.jpg",
    },
    timeline: [
      { phase: "Research & Discovery", date: "May 2025", duration: "2 weeks" },
      { phase: "Design Phase",          date: "Jun 2025", duration: "4 weeks" },
      { phase: "Development",           date: "Jul 2025", duration: "6 weeks" },
      { phase: "Delivery",              date: "Aug 2025", duration: "1 week" },
    ],
    clientReview: {
      name: "Client Name",
      role: "Title, Company",
      avatar: "/images/client-avatar.jpg",
      text: "What the client said about working with us.",
      rating: 5,
    },
    objectives: "Describe what the project set out to achieve.",
    results: "Key outcomes, metrics, or wins delivered.",
    metrics: [
      { label: "Metric A", value: "+XX%" },
      { label: "Metric B", value: "XX" },
      { label: "Metric C", value: "XX%" },
      { label: "Metric D", value: "XX" },
    ],
    story: "The full behind-the-scenes story of the project from kickoff to delivery.",
  },

*/
