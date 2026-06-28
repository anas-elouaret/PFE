const BASE = "https://images.unsplash.com/";
const QUALITY = "auto=format&fit=crop&w=600&q=80&v=9999";

const serviceAssets = {
  // ─── GRAPHIC DESIGN ─────────────────────────────────────────────
  "logo-design": {
    visualCore: "Minimalist Vector Geometry – clean mark exploration on designer workspace",
    url: `${BASE}photo-1626785774573-4b799315345d?${QUALITY}`,
  },
  "brand-identity": {
    visualCore: "Brand Guidelines Mockup – color palette, typography, and stationery system",
    url: `${BASE}photo-1531403009284-440f080d1e12?${QUALITY}`,
  },
  "social-media-design": {
    visualCore: "Smartphone Grid – social platform interfaces on multiple devices",
    url: `${BASE}photo-1611162617213-7d7a39e9b1d7?${QUALITY}`,
  },
  "poster-design": {
    visualCore: "High-Contrast Typography – bold editorial layout on magazine spread",
    url: `${BASE}photo-1561070791-26c113006238?${QUALITY}`,
  },
  "flyer-design": {
    visualCore: "Promotional Print Collateral – folded flyer mockup on branded desk",
    url: `${BASE}photo-1572044162444-ad60f128bdea?${QUALITY}`,
  },
  "business-cards": {
    visualCore: "Premium Stationery – debossed business cards on textured surface",
    url: `${BASE}photo-1541450805268-4822a3a774ca?${QUALITY}`,
  },
  "packaging-design": {
    visualCore: "Product Packaging Mockup – box dieline with branded wrap",
    url: `${BASE}photo-1544367567-0f2fcb009e0b?${QUALITY}`,
  },
  "infographic-design": {
    visualCore: "Data Visualization – colorful charts and infographic layout",
    url: `${BASE}photo-1551288049-bebda4e38f71?${QUALITY}`,
  },

  // ─── SOCIAL MEDIA ───────────────────────────────────────────────
  "ig-management": {
    visualCore: "Instagram Feed Curation – phone screen with photo grid",
    url: `${BASE}photo-1611162617474-5b21e879e113?${QUALITY}`,
  },
  "fb-management": {
    visualCore: "Facebook Brand Page – social dashboard on laptop",
    url: `${BASE}photo-1560472354-b33ff0c44a43?${QUALITY}`,
  },
  "tiktok-management": {
    visualCore: "TikTok Content Feed – short-form video interface on phone",
    url: `${BASE}photo-1611605698335-8b1563e5c0e6?${QUALITY}`,
  },
  "linkedin-management": {
    visualCore: "LinkedIn Professional Network – B2B profile and content",
    url: `${BASE}photo-1573164713714-d95e436ab8d6?${QUALITY}`,
  },
  "content-calendar": {
    visualCore: "Editorial Planner – monthly calendar with content blocks",
    url: `${BASE}photo-1506784983877-45594efa4cbe?${QUALITY}`,
  },
  "community-management": {
    visualCore: "Engagement Hub – conversation bubbles and community icons",
    url: `${BASE}photo-1556157382-97eda2d62296?${QUALITY}`,
  },
  "analytics-reporting": {
    visualCore: "Data Dashboard – performance metrics and KPI charts",
    url: `${BASE}photo-1551288049-bebda4e38f71?${QUALITY}`,
  },

  // ─── MARKETING STRATEGY ─────────────────────────────────────────
  "brand-positioning": {
    visualCore: "Strategy Workshop – whiteboard with brand positioning maps",
    url: `${BASE}photo-1559136555-9303baea8ebd?${QUALITY}`,
  },
  "market-research": {
    visualCore: "Research Desk – market reports, personas, and data sheets",
    url: `${BASE}photo-1454165804606-c3d57bc86b40?${QUALITY}`,
  },
  "competitor-analysis": {
    visualCore: "Competitive Landscape – comparison matrix and SWOT board",
    url: `${BASE}photo-1507925921958-8a62f3d1a50d?${QUALITY}`,
  },
  "content-strategy": {
    visualCore: "Editorial Blueprint – content pillars, topics, and channel plan",
    url: `${BASE}photo-1434030216411-0b793f4b4173?${QUALITY}`,
  },
  "funnel-strategy": {
    visualCore: "Conversion Funnel – awareness-to-retention pipeline visualization",
    url: `${BASE}photo-1460925895917-afdab827c52f?${QUALITY}`,
  },
  "launch-strategy": {
    visualCore: "Go-To-Market Launch – product reveal and campaign timeline",
    url: `${BASE}photo-1519389950473-47ba0277781c?${QUALITY}`,
  },
  "growth-strategy": {
    visualCore: "Growth Trajectory – scaling metrics and hockey-stick chart",
    url: `${BASE}photo-1553729459-afe8f2e2a910?${QUALITY}`,
  },

  // ─── UGC CONTENT ────────────────────────────────────────────────
  "tiktok-videos": {
    visualCore: "TikTok Creator Setup – ring light, phone tripod, behind-the-scenes",
    url: `${BASE}photo-1611162617474-5b21e879e113?${QUALITY}`,
  },
  "instagram-reels": {
    visualCore: "Reels Production – dynamic framing with music waveform overlay",
    url: `${BASE}photo-1611162616475-46b635cb6868?${QUALITY}`,
  },
  "product-reviews": {
    visualCore: "Honest Review Setup – product on clean background with review card",
    url: `${BASE}photo-1492691527719-9d1e07e534b4?${QUALITY}`,
  },
  "unboxing-videos": {
    visualCore: "Unboxing Experience – packaging tear with product reveal moment",
    url: `${BASE}photo-1600857062241-98e5dba7f214?${QUALITY}`,
  },
  "lifestyle-videos": {
    visualCore: "Authentic Lifestyle – natural product integration in real-world scene",
    url: `${BASE}photo-1522202176988-66273c2b55e9?${QUALITY}`,
  },
  "storytelling-ads": {
    visualCore: "Narrative Ad Production – storyboard with emotional arc frames",
    url: `${BASE}photo-1559136555-9303baea8ebd?${QUALITY}`,
  },
  "tutorial-videos": {
    visualCore: "How-To Content – step-by-step demonstration with tool close-up",
    url: `${BASE}photo-1492691527719-9d1e07e534b4?${QUALITY}`,
  },
  "before-after": {
    visualCore: "Transformation Comparison – split-screen before/after result",
    url: `${BASE}photo-1553729459-afe8f2e2a910?${QUALITY}`,
  },

  // ─── PHOTOGRAPHY ────────────────────────────────────────────────
  "product-photography": {
    visualCore: "Studio Product Shot – professional lighting with focus on texture",
    url: `${BASE}photo-1542038784456-1ea8e935640e?${QUALITY}`,
  },
  "lifestyle-photography": {
    visualCore: "Candid Lifestyle – natural light portrait in authentic setting",
    url: `${BASE}photo-1522202176988-66273c2b55e9?${QUALITY}`,
  },
  "corporate-photography": {
    visualCore: "Corporate Headshot – professional portrait with office backdrop",
    url: `${BASE}photo-1573164713714-d95e436ab8d6?${QUALITY}`,
  },
  "event-photography": {
    visualCore: "Event Coverage – keynote speaker with audience in conference hall",
    url: `${BASE}photo-1505373877841-8d25f7d46678?${QUALITY}`,
  },
  "food-photography": {
    visualCore: "Food Styling – overhead flat lay of plated dish with props",
    url: `${BASE}photo-1467003909585-2f8a72700288?${QUALITY}`,
  },
  "ecommerce-photography": {
    visualCore: "E-Commerce Catalog – consistent product isolation on white",
    url: `${BASE}photo-1556742049-0cfed4f6a45d?${QUALITY}`,
  },
  "fashion-photography": {
    visualCore: "Editorial Fashion – dramatic lighting with styled lookbook composition",
    url: `${BASE}photo-1469334031218-e382a71b716b?${QUALITY}`,
  },
  "real-estate-photography": {
    visualCore: "Interior Architecture – wide-angle room with natural light",
    url: `${BASE}photo-1560448204-e02f11c3d0e2?${QUALITY}`,
  },
  "portrait-photography": {
    visualCore: "Portrait Session – professional depth-of-field with subject focus",
    url: `${BASE}photo-1519699047748-de8e457a634e?${QUALITY}`,
  },
  "architectural-photography": {
    visualCore: "Structural Architecture – geometric lines of modern facade",
    url: `${BASE}photo-1518005020951-eccb494ad742?${QUALITY}`,
  },
};

export default serviceAssets;

export function getServiceImage(serviceId) {
  const asset = serviceAssets[serviceId];
  return asset ? asset.url : null;
}

export function getServiceVisualCore(serviceId) {
  const asset = serviceAssets[serviceId];
  return asset ? asset.visualCore : null;
}
