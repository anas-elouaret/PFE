import { services as socialServices } from "./socialMediaServicesData";
import { services as marketingServices } from "./marketingStrategyData";
import { services as ugcServices } from "./ugcServicesData";
import { services as photoServices } from "./photographyServicesData";
import { services as graphicServices } from "./graphicServicesData";

export const categoryGroups = [
  {
    id: "graphic-design",
    name: "Graphic Design",
    icon: "pen-tool",
    description: "Premium graphic design services including logos, brand identities, social media creatives, and packaging.",
    services: graphicServices,
  },
  {
    id: "social-media",
    name: "Social Media Management",
    icon: "megaphone",
    description: "Full-spectrum social media management across Instagram, TikTok, Facebook, and LinkedIn with data-driven growth.",
    services: socialServices,
  },
  {
    id: "marketing-strategy",
    name: "Marketing Strategy",
    icon: "trending-up",
    description: "Data-driven marketing strategies from brand positioning and market research to growth and launch strategies.",
    services: marketingServices,
  },
  {
    id: "ugc",
    name: "UGC Content Creation",
    icon: "clapperboard",
    description: "Authentic user-generated content including TikTok videos, Instagram Reels, product reviews, and storytelling ads.",
    services: ugcServices,
  },
  {
    id: "photography",
    name: "Photography",
    icon: "camera",
    description: "Professional photography services from product and lifestyle to corporate events and architectural shoots.",
    services: photoServices,
  },
];
