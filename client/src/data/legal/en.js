import { entity } from "../legalEntity";

/** The five legal documents, in English. Mirrors fr.js section for section. */
const UPDATED = "26 November 2026";

const en = {
  confidentialite: {
    title: "Privacy policy",
    intro:
      "What GROWSTACK collects on growstack.ma, why, who it is shared with, and how to ask " +
      "for it to be deleted.",
    updated: UPDATED,
    sections: [
      {
        h: "Who is responsible",
        p: [
          `The controller is ${entity.tradingName}, represented by ${entity.founder}, in ` +
            `${entity.city}, Morocco. For any question about your data: ${entity.email}.`,
        ],
      },
      {
        h: "What we collect, and why",
        p: ["We collect only what a service needs in order to exist."],
        ul: [
          "Client account: name, email address, password (stored hashed, never in clear text), and phone and city if you give them. Needed to sign you in and track your orders.",
          "Orders and projects: the services chosen, amounts, your brief, our exchanges and any files you send us. Needed to perform the contract.",
          "Contact form: name, email, phone if given, subject and message. Used to reply to you.",
          "Reviews: display name, email (never published), rating and comment.",
          "Quizzes and certificates: your scores, and the name printed on any certificate you earn.",
          "Chat assistant: the content of the messages you send it (see “Processors” below).",
        ],
      },
      {
        h: "What we do not do",
        ul: [
          "No analytics tool, no advertising pixel and no third-party tracker is installed on this site.",
          "We do not build advertising profiles and we do not profile you automatically.",
          "We do not sell, rent or trade personal data.",
        ],
      },
      {
        h: "Processors",
        p: ["Four technical providers process data on our behalf. They are the only ones."],
        ul: [
          `Site and API hosting: ${entity.host.name} (${entity.host.address}).`,
          "Database: MongoDB Atlas, holding accounts, orders, messages and reviews.",
          "Transactional email (address verification, password reset, order updates): the Resend SMTP relay.",
          "Chat assistant: OpenAI. The messages you write to the assistant are sent to it to produce the reply. Do not write sensitive or confidential information there.",
        ],
      },
      {
        h: "How long we keep it",
        ul: [
          "Client account: as long as the account exists, then deleted on request.",
          "Orders and invoices: kept for the statutory accounting retention period.",
          "Contact form messages: up to three years after the last exchange.",
          "Certificates: kept as long as they need to stay verifiable by their reference.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "Under Law 09-08 on the protection of individuals with regard to the processing of " +
            "personal data, you have rights of access, rectification, objection and deletion.",
          `To exercise them, write to ${entity.email} from the address linked to your account. ` +
            "We answer within 30 days. You may also refer the matter to the CNDP, Morocco's " +
            "data protection authority.",
        ],
      },
      {
        h: "Deleting your data",
        p: [
          `Write to ${entity.email} with the subject “Delete my data”, from your account's ` +
            "email address. We confirm receipt, then delete your account, your reviews, your " +
            "quiz results and your certificates.",
          "What cannot be deleted straight away: records attached to a paid order, which " +
            "accounting law requires us to keep. Those are set aside and used for nothing else.",
        ],
      },
      {
        h: "Minimum age",
        p: [
          "This site is aimed at professionals and is not intended for children. Accounts may " +
            "only be created by people aged 16 or over. If you find that an account was created " +
            `by a child under 16, write to ${entity.email} and we will delete it.`,
        ],
      },
      {
        h: "Security",
        p: [
          "Passwords are hashed. Traffic to the site is encrypted over HTTPS. The token that " +
            "keeps your session is set as an `httpOnly` cookie, out of reach of page scripts.",
        ],
      },
      {
        h: "Changes",
        p: [
          "Any change to this page is dated at the top. Changes affecting what is collected will " +
            "be sent to you by email if you hold an account.",
        ],
      },
    ],
  },

  cookies: {
    title: "Cookie policy",
    intro:
      "This site uses no advertising cookies and no analytics. Here is the complete list of " +
      "what is stored on your device.",
    updated: UPDATED,
    sections: [
      {
        h: "Cookie set by the site",
        table: {
          head: ["Name", "Type", "What it does", "Lifetime"],
          rows: [
            ["token", "httpOnly cookie", "Keeps you signed in. Without it you would be signed out on every page.", "Until you sign out"],
          ],
        },
      },
      {
        h: "Browser local storage",
        p: [
          "The entries below are not cookies: they stay in your browser and are never sent to " +
            "any third-party server.",
        ],
        table: {
          head: ["Key", "What it does"],
          rows: [
            ["auth_token, client_token, client_user, admin_token", "Keeps you signed in to your area."],
            ["app_lang", "Remembers the language you chose."],
            ["rememberedEmail", "Pre-fills your email on the sign-in screen, if you asked for it."],
          ],
        },
      },
      {
        h: "Why there is no accept / reject banner",
        p: [
          "Consent is required for trackers that are not strictly necessary: analytics, " +
            "advertising, social widgets. This site sets none. Everything above either signs " +
            "you in or remembers a choice you made yourself.",
          "A banner asking you to accept trackers that do not exist would make you click for " +
            "nothing. We show an information notice once instead, pointing here. If an analytics " +
            "tool is ever added, a real choice will appear here and in the notice.",
        ],
      },
      {
        h: "Clearing what is stored",
        p: [
          "Signing out removes the session cookie and the account keys. You can also clear the " +
            "site's storage from your browser settings at any time, without asking us.",
        ],
      },
      {
        h: "Fonts and images",
        p: [
          "Typefaces are loaded from Google Fonts, which passes your IP address to Google while " +
            "they load. No cookie is set that way. Photographs come from Unsplash and are served " +
            "from its delivery network.",
        ],
      },
    ],
  },

  conditions: {
    title: "Terms of use and sale",
    intro: "The terms covering growstack.ma and the services ordered through it.",
    updated: UPDATED,
    sections: [
      {
        h: "Scope",
        p: [
          `${entity.tradingName} provides graphic design, social media management, UGC content, ` +
            "photography, marketing strategy and web development. Prices shown on the site are " +
            "in Moroccan dirhams (MAD).",
        ],
      },
      {
        h: "Orders and quotes",
        p: [
          "An order placed on the site is a request for work. It becomes firm once we confirm it " +
            "in writing, setting out scope, timeline and final price.",
          "The price shown is the price of the service described. No file fee, setup fee or " +
            "handling fee is added to it. If your request falls outside the scope shown, the " +
            "difference is quoted and agreed in writing before any work starts.",
        ],
      },
      {
        h: "Payment",
        p: [
          "Payment is by bank transfer. A 50% deposit is due on order, the balance on delivery. " +
            "No recurring charge is set up, and no banking details are entered or stored on this site.",
        ],
      },
      {
        h: "Timelines",
        p: [
          "Most projects are delivered within 7 to 14 business days. The exact timeline is set " +
            "in the order confirmation, with its milestones. Where a timeline depends on material " +
            "you must supply, it runs from the moment we receive it.",
        ],
      },
      {
        h: "Revisions",
        p: [
          "Each service includes up to three rounds of changes, within the listed price. Beyond " +
            "that, or where a request changes the nature of the work, the extra is quoted before " +
            "it is started.",
        ],
      },
      {
        h: "Ownership of deliverables",
        p: [
          "Rights in the final deliverables transfer to you on full payment. Source files are " +
            "handed over on the terms set in the quote.",
          "Third-party licensed material inside a deliverable (fonts, photographs, music) stays " +
            "under its own licence, which is named to you on delivery.",
        ],
      },
      {
        h: "Your obligations",
        ul: [
          "Supply material you hold the rights to.",
          "Do not use the site to publish unlawful, defamatory or misleading content.",
          "Do not attempt to reach another user's private area.",
        ],
      },
      {
        h: "Accounts and posted content",
        p: [
          "Accounts may only be created by people aged 16 or over. You are responsible for what " +
            "you post in the community areas. We may take down clearly unlawful content and, " +
            "where needed, suspend the account behind it.",
        ],
      },
      {
        h: "Liability",
        p: [
          "The guides and courses in the resources section are published for information. " +
            "GROWSTACK is a digital agency, not an accredited training body: the certificates " +
            "issued after a quiz are neither a diploma nor a recognised professional qualification.",
          "Information about support programmes published on our other sites is taken from " +
            "official sources and dated. It does not replace checking with the body concerned.",
        ],
      },
      {
        h: "Governing law",
        p: [
          "These terms are governed by Moroccan law. In the event of a dispute, the parties will " +
            "seek an amicable solution before any action.",
        ],
      },
    ],
  },

  remboursement: {
    title: "Cancellation and refund policy",
    intro: "What you can cancel, when, and what comes back to you.",
    updated: UPDATED,
    sections: [
      {
        h: "Before work starts",
        p: [
          "While the work has not started, you can cancel and the deposit is refunded in full. " +
            "Write to us; the date that counts is the date of your email.",
        ],
      },
      {
        h: "After work starts",
        p: [
          "Once work is under way, cancelling refunds the part not yet done. What has already " +
            "been produced is handed to you, and the remainder of the deposit is returned.",
        ],
      },
      {
        h: "If the deliverable does not match the order",
        p: [
          "The three included rounds of revisions exist for this first. If, after those rounds, " +
            "the deliverable still does not match what the order confirmation described, the " +
            "service is refunded.",
          "A disagreement over an aesthetic choice, where the deliverable matches what was " +
            "ordered, is a matter for revisions rather than a refund.",
        ],
      },
      {
        h: "What is not refundable",
        ul: [
          "Services delivered, accepted and in use.",
          "Costs actually incurred with third parties at your request (printing, image licences, font purchases, equipment hire) where those cannot be cancelled.",
          "The site's free resources: guides, courses, quizzes and certificates are not sold.",
        ],
      },
      {
        h: "Timing and method",
        p: [
          "An accepted refund is paid within 14 days, by transfer, to the account used for " +
            "payment. No fee is deducted from the amount refunded.",
          `To open a request: ${entity.email}, subject “Refund”, quoting the order reference.`,
        ],
      },
    ],
  },

  "mentions-legales": {
    title: "Legal notice",
    intro: "Who publishes this site, who hosts it, and how to reach us.",
    updated: UPDATED,
    sections: [
      {
        h: "Publisher",
        rows: [
          ["Trading name", entity.tradingName],
          ["Represented by", entity.founder],
          ["Publication director", entity.publicationDirector],
          ["Based in", `${entity.city}, Morocco`],
          ["Email", entity.email],
          ["Phone / WhatsApp", entity.phone],
          ["Instagram", entity.instagram],
        ],
        registration: true,
      },
      {
        h: "Host",
        rows: [
          ["Company", entity.host.name],
          ["Address", entity.host.address],
          ["Site", entity.host.site],
        ],
      },
      {
        h: "Intellectual property",
        p: [
          "The GROWSTACK name, the logo, and the text, guides and courses published on this site " +
            "belong to it. Reproducing them without written permission is not allowed.",
          "The photographs illustrating the services come from Unsplash and are used under the " +
            "Unsplash licence. The typefaces (Inter, Space Grotesk, Noto Sans Arabic) are " +
            "released under SIL Open Font License 1.1. The icons come from Lucide, under the " +
            "ISC licence.",
        ],
      },
      {
        h: "Reporting content",
        p: [
          `To report content published on this site: ${entity.email}. Give the address of the ` +
            "page and the reason.",
        ],
      },
    ],
  },
};

export default en;
