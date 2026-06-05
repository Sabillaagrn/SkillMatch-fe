// The 35 canonical skill categories the model classifies into.
// Mirrors ml/artifacts/master_skill_list.csv (single source of truth on the
// backend). Kept static here to avoid an extra round-trip on page load.
export const SKILLS = [
  { code: "ACCT", name: "Accounting" },
  { code: "ADM", name: "Administration" },
  { code: "ADVR", name: "Advertising" },
  { code: "ANLS", name: "Analysis & Analytics" },
  { code: "ART", name: "Arts & Design" },
  { code: "BD", name: "Business Development" },
  { code: "CNSL", name: "Consulting" },
  { code: "CUST", name: "Customer Service" },
  { code: "DIST", name: "Distribution & Logistics" },
  { code: "DSGN", name: "Design (UI/UX/Graphic)" },
  { code: "EDU", name: "Education & Training" },
  { code: "ENG", name: "Engineering (Software/Hardware)" },
  { code: "FIN", name: "Finance" },
  { code: "GENB", name: "General Business" },
  { code: "HCPR", name: "Healthcare & Pharma" },
  { code: "HR", name: "Human Resources" },
  { code: "IT", name: "Information Technology" },
  { code: "LGL", name: "Legal" },
  { code: "MGMT", name: "Management" },
  { code: "MNFC", name: "Manufacturing" },
  { code: "MRKT", name: "Marketing" },
  { code: "OTHR", name: "Other" },
  { code: "PR", name: "Public Relations" },
  { code: "PRCH", name: "Purchasing & Procurement" },
  { code: "PRDM", name: "Product Management" },
  { code: "PRJM", name: "Project Management" },
  { code: "PROD", name: "Production" },
  { code: "QA", name: "Quality Assurance" },
  { code: "RSCH", name: "Research" },
  { code: "SALE", name: "Sales" },
  { code: "SCI", name: "Science" },
  { code: "STRA", name: "Strategy & Planning" },
  { code: "SUPL", name: "Supply Chain" },
  { code: "TRNG", name: "Training & Development" },
  { code: "WRT", name: "Writing & Content" },
];

export const SKILL_NAME = Object.fromEntries(SKILLS.map((s) => [s.code, s.name]));

// Preset target roles -> representative job descriptions sent to /match.
// (The model reads a JD; these let users pick a role instead of pasting text.
//  A custom JD textarea is also provided on the analysis page.)
export const TARGET_ROLES = [
  {
    id: "data-analyst",
    label: "Data Analyst",
    description:
      "We are hiring a data analyst to build dashboards and reports, write SQL queries, perform data analysis and business intelligence, and translate analytics into recommendations for stakeholders.",
  },
  {
    id: "software-engineer",
    label: "Software Engineer",
    description:
      "Seeking a software engineer / developer proficient in Python, Java, React and backend systems to design, build and maintain scalable software and infrastructure.",
  },
  {
    id: "product-manager",
    label: "Product Manager",
    description:
      "Looking for a product manager to own the product roadmap, work with engineering and design, define strategy, and manage stakeholders across the product lifecycle.",
  },
  {
    id: "marketing-specialist",
    label: "Marketing Specialist",
    description:
      "Hiring a marketing specialist to run campaigns, manage brand and content, SEO, advertising and public relations to drive growth and business development.",
  },
  {
    id: "project-manager",
    label: "Project Manager",
    description:
      "We need a project manager experienced in agile and scrum to manage stakeholders, milestones, risks and cross-functional delivery of complex projects.",
  },
  {
    id: "ux-designer",
    label: "UX / UI Designer",
    description:
      "Seeking a UX/UI designer skilled in design, Figma, graphic and creative work to craft user experiences, research, and visual interfaces for digital products.",
  },
];
