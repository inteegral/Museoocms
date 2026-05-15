import { useState } from "react";
import { X, Check, ChevronRight, Zap } from "lucide-react";
import { PageShell } from "./PageShell";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ConfigField {
  key: string;
  label: string;
  placeholder: string;
  type?: string;
}

interface Connector {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  initials: string;
  status: "connected" | "available" | "coming-soon";
  configFields: ConfigField[];
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CONNECTORS: Connector[] = [
  // Ticketing
  {
    id: "vivaticket",
    name: "Vivaticket",
    description: "Validate tickets as audio guide access codes",
    category: "Ticketing",
    color: "#e53e3e",
    initials: "VT",
    status: "connected",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "vt_live_xxxxxxxxxxxx" },
      { key: "venue_id", label: "Venue ID", placeholder: "e.g. 4821" },
    ],
  },
  {
    id: "ticketone",
    name: "TicketOne",
    description: "Sync ticketing data and gate guide access",
    category: "Ticketing",
    color: "#3182ce",
    initials: "T1",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "to_xxxxxxxxxxxxxxxx" },
      { key: "event_id", label: "Event ID", placeholder: "e.g. 99241" },
    ],
  },
  {
    id: "ticketmaster",
    name: "Ticketmaster",
    description: "Connect Ticketmaster events to your guides",
    category: "Ticketing",
    color: "#0075bf",
    initials: "TM",
    status: "available",
    configFields: [
      { key: "consumer_key", label: "Consumer Key", placeholder: "xxxxxxxxxxxxxxxx" },
      { key: "consumer_secret", label: "Consumer Secret", placeholder: "xxxxxxxxxxxxxxxx", type: "password" },
    ],
  },
  // OTA
  {
    id: "getyourguide",
    name: "GetYourGuide",
    description: "Manage availability and receive booking notifications",
    category: "OTA Platforms",
    color: "#ff5533",
    initials: "GG",
    status: "available",
    configFields: [
      { key: "api_key", label: "Supplier API Key", placeholder: "gyg_xxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "supplier_id", label: "Supplier ID", placeholder: "e.g. 12345" },
    ],
  },
  {
    id: "tiqets",
    name: "Tiqets",
    description: "Supplier API for museums and attractions across Europe",
    category: "OTA Platforms",
    color: "#e91e8c",
    initials: "TQ",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "tq_xxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "product_id", label: "Product ID", placeholder: "e.g. 78341" },
    ],
  },
  {
    id: "musement",
    name: "Musement",
    description: "Connect tours and cultural experiences via TUI Musement API",
    category: "OTA Platforms",
    color: "#e8472a",
    initials: "MU",
    status: "available",
    configFields: [
      { key: "client_id", label: "Client ID", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
      { key: "client_secret", label: "Client Secret", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxx", type: "password" },
    ],
  },
  {
    id: "viator",
    name: "Viator",
    description: "Reach millions of travellers via TripAdvisor's booking platform",
    category: "OTA Platforms",
    color: "#328f76",
    initials: "VI",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "product_code", label: "Product Code", placeholder: "e.g. 56789P1" },
    ],
  },
  {
    id: "klook",
    name: "Klook",
    description: "Supplier integration for Asia-Pacific and European markets",
    category: "OTA Platforms",
    color: "#e8282d",
    initials: "KL",
    status: "coming-soon",
    configFields: [
      { key: "merchant_id", label: "Merchant ID", placeholder: "e.g. 900123" },
      { key: "api_key", label: "API Key", placeholder: "klook_xxxxxxxxxxxxxxxx" },
    ],
  },
  {
    id: "civitatis",
    name: "Civitatis",
    description: "Distribute experiences to Spanish-speaking markets",
    category: "OTA Platforms",
    color: "#1e88c9",
    initials: "CV",
    status: "coming-soon",
    configFields: [
      { key: "partner_id", label: "Partner ID", placeholder: "e.g. 4412" },
      { key: "api_key", label: "API Key", placeholder: "civ_xxxxxxxxxxxxxxxx" },
    ],
  },
  // Venue ticketing platforms
  {
    id: "tessitura",
    name: "Tessitura",
    description: "CRM and ticketing standard for major museums and performing arts",
    category: "Venue Platforms",
    color: "#1a3a5c",
    initials: "TS",
    status: "available",
    configFields: [
      { key: "host", label: "Tessitura Host URL", placeholder: "https://api.yourmuseum.tessituranetwork.com" },
      { key: "username", label: "API Username", placeholder: "api_user" },
      { key: "password", label: "API Password", placeholder: "••••••••••••", type: "password" },
      { key: "machine_name", label: "Machine Name", placeholder: "e.g. WEBAPI" },
    ],
  },
  {
    id: "galaxy",
    name: "Galaxy",
    description: "Admissions and ticketing for visitor attractions",
    category: "Venue Platforms",
    color: "#5b2d8e",
    initials: "GX",
    status: "available",
    configFields: [
      { key: "api_url", label: "API Endpoint", placeholder: "https://api.galaxy.us/v2" },
      { key: "api_key", label: "API Key", placeholder: "gx_xxxxxxxxxxxxxxxx" },
      { key: "location_id", label: "Location ID", placeholder: "e.g. 301" },
    ],
  },
  {
    id: "convious",
    name: "Convious",
    description: "Dynamic pricing and ticketing for visitor attractions",
    category: "Venue Platforms",
    color: "#6c3fc5",
    initials: "CO",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "cv_live_xxxxxxxxxxxxxxxx" },
      { key: "venue_id", label: "Venue ID", placeholder: "e.g. vn_8821" },
    ],
  },
  // Italian / European
  {
    id: "midaticket",
    name: "Midaticket",
    description: "Italian ticketing platform used by museums and cultural venues",
    category: "Italian & European",
    color: "#c0392b",
    initials: "MD",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "mida_xxxxxxxxxxxxxxxx" },
      { key: "operator_code", label: "Operator Code", placeholder: "e.g. OP_0042" },
    ],
  },
  {
    id: "coopcult",
    name: "CoopCulture",
    description: "Ticketing for Italian state museums (Colosseo, Uffizi…)",
    category: "Italian & European",
    color: "#b7410e",
    initials: "CC",
    status: "coming-soon",
    configFields: [
      { key: "venue_code", label: "Venue Code", placeholder: "e.g. COLOSSEO" },
      { key: "api_key", label: "API Key", placeholder: "cc_xxxxxxxxxxxxxxxx" },
    ],
  },
  {
    id: "etes",
    name: "Etes",
    description: "French cultural venue ticketing and access management",
    category: "Italian & European",
    color: "#00539f",
    initials: "ET",
    status: "coming-soon",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "etes_xxxxxxxxxxxxxxxx" },
      { key: "site_id", label: "Site ID", placeholder: "e.g. 1042" },
    ],
  },
  // CRM & Marketing
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Sync visitor contacts and guide engagement data",
    category: "CRM & Marketing",
    color: "#ff7a59",
    initials: "HS",
    status: "connected",
    configFields: [
      { key: "access_token", label: "Private App Token", placeholder: "pat-eu1-xxxxxxxx-xxxx-xxxx" },
      { key: "pipeline_id", label: "Pipeline ID (optional)", placeholder: "e.g. default" },
    ],
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Send post-visit follow-up campaigns automatically",
    category: "CRM & Marketing",
    color: "#e6a817",
    initials: "MC",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1" },
      { key: "list_id", label: "Audience ID", placeholder: "e.g. a1b2c3d4e5" },
    ],
  },
  {
    id: "brevo",
    name: "Brevo",
    description: "Trigger email flows after guide completion",
    category: "CRM & Marketing",
    color: "#0092ff",
    initials: "BR",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "xkeysib-xxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "list_id", label: "Contact List ID", placeholder: "e.g. 12" },
    ],
  },
  // Analytics
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Send guide and POI events to GA4",
    category: "Analytics",
    color: "#f9ab00",
    initials: "GA",
    status: "connected",
    configFields: [
      { key: "measurement_id", label: "Measurement ID", placeholder: "G-XXXXXXXXXX" },
      { key: "api_secret", label: "API Secret", placeholder: "xxxxxxxxxxxxxxxxxxxx", type: "password" },
    ],
  },
  {
    id: "matomo",
    name: "Matomo",
    description: "Privacy-friendly analytics for guide visits",
    category: "Analytics",
    color: "#3152a0",
    initials: "MT",
    status: "available",
    configFields: [
      { key: "site_url", label: "Matomo URL", placeholder: "https://analytics.yourmuseum.it" },
      { key: "site_id", label: "Site ID", placeholder: "e.g. 3" },
      { key: "auth_token", label: "Auth Token", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", type: "password" },
    ],
  },
  // Maps & Location
  {
    id: "google-maps",
    name: "Google Maps",
    description: "Enable geofencing for Hunt unlock conditions",
    category: "Maps & Location",
    color: "#4285f4",
    initials: "GM",
    status: "connected",
    configFields: [
      { key: "api_key", label: "Maps API Key", placeholder: "AIzaXXXXXXXXXXXXXXXXXXXXXXXX" },
    ],
  },
  // Reviews
  {
    id: "tripadvisor",
    name: "TripAdvisor",
    description: "Import reviews to display in the Reviews section",
    category: "Reviews",
    color: "#34e0a1",
    initials: "TA",
    status: "available",
    configFields: [
      { key: "location_id", label: "Location ID", placeholder: "e.g. 187791" },
      { key: "api_key", label: "Content API Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
    ],
  },
  {
    id: "google-reviews",
    name: "Google Reviews",
    description: "Pull Google Business reviews automatically",
    category: "Reviews",
    color: "#34a853",
    initials: "GR",
    status: "coming-soon",
    configFields: [],
  },
  // Payments
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments for paid guide access codes",
    category: "Payments",
    color: "#635bff",
    initials: "ST",
    status: "available",
    configFields: [
      { key: "publishable_key", label: "Publishable Key", placeholder: "pk_live_xxxxxxxxxxxxxxxxxxxx" },
      { key: "secret_key", label: "Secret Key", placeholder: "sk_live_xxxxxxxxxxxxxxxxxxxx", type: "password" },
      { key: "webhook_secret", label: "Webhook Secret", placeholder: "whsec_xxxxxxxxxxxxxxxxxxxx", type: "password" },
    ],
  },
  // Developer
  {
    id: "webhook",
    name: "Webhook",
    description: "Push events to any custom endpoint in real time",
    category: "Developer",
    color: "#71717a",
    initials: "WH",
    status: "connected",
    configFields: [
      { key: "url", label: "Endpoint URL", placeholder: "https://api.yoursite.com/museoo-events" },
      { key: "secret", label: "Signing Secret (optional)", placeholder: "whsec_xxxxxxxxxxxxxxxx", type: "password" },
    ],
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect to 5,000+ apps with no-code automations",
    category: "Developer",
    color: "#ff4a00",
    initials: "ZP",
    status: "coming-soon",
    configFields: [],
  },
  // Collection Management
  {
    id: "tms",
    name: "TMS",
    description: "Gallery Systems collections management — objects, loans, exhibitions",
    category: "Collection Management",
    color: "#2d3748",
    initials: "TM",
    status: "available",
    configFields: [
      { key: "api_url", label: "eMuseum API URL", placeholder: "https://emuseum.yourmuseum.org/api/v1" },
      { key: "api_key", label: "API Key", placeholder: "tms_xxxxxxxxxxxxxxxx" },
    ],
  },
  {
    id: "museumplus",
    name: "MuseumPlus",
    description: "Zetcom RESTful collections and exhibition management",
    category: "Collection Management",
    color: "#4a5568",
    initials: "MP",
    status: "available",
    configFields: [
      { key: "host", label: "Host URL", placeholder: "https://yourmuseum.museum-digital.de/api" },
      { key: "username", label: "Username", placeholder: "api_user" },
      { key: "password", label: "Password", placeholder: "••••••••••••", type: "password" },
    ],
  },
  {
    id: "emu",
    name: "EMu",
    description: "KE Software — used by the world's three largest natural history museums",
    category: "Collection Management",
    color: "#276749",
    initials: "EM",
    status: "available",
    configFields: [
      { key: "api_url", label: "API Endpoint", placeholder: "https://emu.yourmuseum.org/api" },
      { key: "api_key", label: "API Key", placeholder: "emu_xxxxxxxxxxxxxxxx" },
      { key: "database", label: "Database Name", placeholder: "e.g. ecatalogue" },
    ],
  },
  {
    id: "argus",
    name: "Argus",
    description: "Lucidea collections management with digitization and public portal",
    category: "Collection Management",
    color: "#744210",
    initials: "AR",
    status: "available",
    configFields: [
      { key: "api_url", label: "API URL", placeholder: "https://yourmuseum.lucidea.com/argus/api" },
      { key: "api_key", label: "API Key", placeholder: "argus_xxxxxxxxxxxxxxxx" },
    ],
  },
  {
    id: "catalogit",
    name: "CatalogIt",
    description: "Cloud-based collections management with REST API and WordPress plugin",
    category: "Collection Management",
    color: "#2b6cb0",
    initials: "CI",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "ci_xxxxxxxxxxxxxxxx" },
      { key: "account_id", label: "Account ID", placeholder: "e.g. 8821" },
    ],
  },
  // Museum CRM
  {
    id: "veevart",
    name: "Veevart",
    description: "Salesforce-based all-in-one: fundraising, ticketing, shop, POS, collections",
    category: "Museum CRM",
    color: "#1a365d",
    initials: "VV",
    status: "available",
    configFields: [
      { key: "instance_url", label: "Salesforce Instance URL", placeholder: "https://yourorg.my.salesforce.com" },
      { key: "access_token", label: "Access Token", placeholder: "00Dxx0000000xxxx!xxxxxxxx", type: "password" },
    ],
  },
  {
    id: "blackbaud-altru",
    name: "Blackbaud Altru",
    description: "Ticketing and fundraising suite for arts and cultural organisations",
    category: "Museum CRM",
    color: "#2c5282",
    initials: "BA",
    status: "available",
    configFields: [
      { key: "subscription_key", label: "Subscription Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "environment_id", label: "Environment ID", placeholder: "p-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
    ],
  },
  {
    id: "humanitru",
    name: "Humanitru",
    description: "Integration-first CRM for museums, zoos and aquariums",
    category: "Museum CRM",
    color: "#285e61",
    initials: "HU",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "hum_xxxxxxxxxxxxxxxx" },
      { key: "org_id", label: "Organisation ID", placeholder: "e.g. org_4421" },
    ],
  },
  {
    id: "doubleknot",
    name: "Doubleknot",
    description: "Group sales, education programs, membership and rental management",
    category: "Museum CRM",
    color: "#44337a",
    initials: "DK",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "dk_xxxxxxxxxxxxxxxx" },
      { key: "site_id", label: "Site ID", placeholder: "e.g. 1042" },
    ],
  },
  // Fundraising
  {
    id: "donorbox",
    name: "Donorbox",
    description: "Online giving and donation campaigns, syncs with HubSpot",
    category: "Fundraising",
    color: "#c53030",
    initials: "DB",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "dbox_xxxxxxxxxxxxxxxx" },
      { key: "campaign_id", label: "Campaign ID (optional)", placeholder: "e.g. 9921" },
    ],
  },
  {
    id: "fundraiseup",
    name: "Fundraise Up",
    description: "AI-optimised donation conversion for cultural institutions",
    category: "Fundraising",
    color: "#9c4221",
    initials: "FU",
    status: "available",
    configFields: [
      { key: "public_key", label: "Public Key", placeholder: "XXXXXXXXXXXXXXXX" },
      { key: "secret_key", label: "Secret Key", placeholder: "sk_xxxxxxxxxxxxxxxx", type: "password" },
    ],
  },
  {
    id: "raisers-edge",
    name: "Raiser's Edge NXT",
    description: "Blackbaud industry-standard donor management for nonprofits",
    category: "Fundraising",
    color: "#2c5282",
    initials: "RE",
    status: "available",
    configFields: [
      { key: "subscription_key", label: "Subscription Key", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "environment_id", label: "Environment ID", placeholder: "p-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
    ],
  },
  // Digital Signage
  {
    id: "intuiface",
    name: "Intuiface",
    description: "No-code interactive displays and kiosks, API with any CMS",
    category: "Digital Signage",
    color: "#0d4880",
    initials: "IF",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "if_xxxxxxxxxxxxxxxx" },
      { key: "channel_id", label: "Channel ID", placeholder: "e.g. ch_0042" },
    ],
  },
  {
    id: "stqry",
    name: "STQRY",
    description: "Unified kiosk + signage with audio guides, videos and quizzes",
    category: "Digital Signage",
    color: "#6b46c1",
    initials: "SQ",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "stq_xxxxxxxxxxxxxxxx" },
      { key: "project_id", label: "Project ID", placeholder: "e.g. proj_8821" },
    ],
  },
  {
    id: "brightsign",
    name: "BrightSign",
    description: "Dynamic storytelling with interactive displays and motion sensors",
    category: "Digital Signage",
    color: "#c05621",
    initials: "BS",
    status: "available",
    configFields: [
      { key: "api_key", label: "BSN.cloud API Key", placeholder: "bsn_xxxxxxxxxxxxxxxx" },
      { key: "network_id", label: "Network ID", placeholder: "e.g. 10042" },
    ],
  },
  // Visitor Analytics
  {
    id: "sensource",
    name: "SenSource",
    description: "People counting sensors with 98%+ accuracy and operational analytics",
    category: "Visitor Analytics",
    color: "#2d3748",
    initials: "SS",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "sens_xxxxxxxxxxxxxxxx" },
      { key: "location_id", label: "Location ID", placeholder: "e.g. loc_4421" },
    ],
  },
  {
    id: "bumbeelabs",
    name: "Bumbee Labs",
    description: "GDPR-compliant visitor analytics — dwell time, paths, heatmaps",
    category: "Visitor Analytics",
    color: "#f6ad55",
    initials: "BL",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "bl_xxxxxxxxxxxxxxxx" },
      { key: "venue_id", label: "Venue ID", placeholder: "e.g. ven_0042" },
    ],
  },
  {
    id: "locatify",
    name: "Locatify",
    description: "Real-time indoor location tracking and visitor movement mapping",
    category: "Visitor Analytics",
    color: "#3182ce",
    initials: "LC",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "loc_xxxxxxxxxxxxxxxx" },
      { key: "project_id", label: "Project ID", placeholder: "e.g. 8812" },
    ],
  },
  // POS & Retail
  {
    id: "korona",
    name: "KORONA POS",
    description: "Museum-specific POS — ticketing, gift shop, concessions in one",
    category: "POS & Retail",
    color: "#2f855a",
    initials: "KP",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "korona_xxxxxxxxxxxxxxxx" },
      { key: "account_id", label: "Account ID", placeholder: "e.g. acc_4421" },
    ],
  },
  {
    id: "roller",
    name: "Roller",
    description: "Ticketing, POS and membership management for visitor attractions",
    category: "POS & Retail",
    color: "#00b5d8",
    initials: "RL",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "roller_xxxxxxxxxxxxxxxx" },
      { key: "venue_id", label: "Venue ID", placeholder: "e.g. ven_9921" },
    ],
  },
  {
    id: "lightspeed",
    name: "Lightspeed",
    description: "Retail POS with inventory management for museum gift shops",
    category: "POS & Retail",
    color: "#e53e3e",
    initials: "LS",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "ls_xxxxxxxxxxxxxxxx" },
      { key: "account_id", label: "Account ID", placeholder: "e.g. 112233" },
    ],
  },
  // Education
  {
    id: "versai",
    name: "Versai",
    description: "School group reservations, field trip management and invoicing",
    category: "Education",
    color: "#2c7a7b",
    initials: "VS",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "versai_xxxxxxxxxxxxxxxx" },
      { key: "institution_id", label: "Institution ID", placeholder: "e.g. inst_0042" },
    ],
  },
  {
    id: "doubleknot-edu",
    name: "Doubleknot Education",
    description: "Scheduling, capacity, billing and check-in for educational programs",
    category: "Education",
    color: "#553c9a",
    initials: "DE",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "dk_xxxxxxxxxxxxxxxx" },
      { key: "site_id", label: "Site ID", placeholder: "e.g. 1042" },
    ],
  },
  // Accessibility
  {
    id: "evelity",
    name: "Evelity",
    description: "Geolocated guide for visitors with disabilities, voice synthesis included",
    category: "Accessibility",
    color: "#2b6cb0",
    initials: "EV",
    status: "available",
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "ev_xxxxxxxxxxxxxxxx" },
      { key: "venue_id", label: "Venue ID", placeholder: "e.g. ven_0042" },
    ],
  },
];

const CATEGORIES = Array.from(new Set(CONNECTORS.map(c => c.category)));

// ── Config Modal ──────────────────────────────────────────────────────────────
function ConfigModal({
  connector,
  onClose,
  onSave,
  onDisconnect,
}: {
  connector: Connector;
  onClose: () => void;
  onSave: () => void;
  onDisconnect: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const isConnected = connector.status === "connected";

  return (
    <div
      className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-100">
          <div
            className="size-9 rounded-xl flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
            style={{ background: connector.color }}
          >
            {connector.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-zinc-900">{connector.name}</p>
            <p className="text-[11px] text-zinc-400">{connector.description}</p>
          </div>
          <button onClick={onClose} className="size-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors">
            <X className="size-3.5 text-zinc-500" />
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 space-y-4">
          {isConnected && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="size-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[12px] text-emerald-700 font-medium">Connected and active</span>
            </div>
          )}
          {connector.configFields.map(field => (
            <div key={field.key}>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type ?? "text"}
                value={values[field.key] ?? ""}
                onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-[13px] font-mono text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center gap-2">
          {isConnected && (
            <button
              onClick={onDisconnect}
              className="px-4 py-2 text-[13px] font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 text-[13px] font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {isConnected ? "Save changes" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Connector Card ────────────────────────────────────────────────────────────
function ConnectorCard({
  connector,
  onConfigure,
}: {
  connector: Connector;
  onConfigure: () => void;
}) {
  const isConnected = connector.status === "connected";
  const isSoon = connector.status === "coming-soon";

  return (
    <div className={`bg-white border rounded-xl p-5 flex flex-col gap-4 transition-all ${
      isSoon ? "opacity-60 cursor-default" : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm cursor-pointer"
    } ${isConnected ? "border-zinc-200 ring-1 ring-emerald-100" : ""}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="size-10 rounded-xl flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
          style={{ background: connector.color }}
        >
          {connector.initials}
        </div>
        {isConnected ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
            Connected
          </span>
        ) : isSoon ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-400 border border-zinc-200 flex-shrink-0">
            Soon
          </span>
        ) : null}
      </div>

      {/* Name + description */}
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-zinc-900 mb-0.5">{connector.name}</p>
        <p className="text-[12px] text-zinc-400 leading-snug">{connector.description}</p>
      </div>

      {/* Action */}
      {!isSoon && (
        <button
          onClick={onConfigure}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-all ${
            isConnected
              ? "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
        >
          {isConnected ? (
            <><Check className="size-3.5" />Configure</>
          ) : (
            <><Zap className="size-3.5" />Connect</>
          )}
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function Connectors() {
  const [statuses, setStatuses] = useState<Record<string, Connector["status"]>>(
    () => Object.fromEntries(CONNECTORS.map(c => [c.id, c.status]))
  );
  const [filter, setFilter] = useState<"all" | "connected" | "available">("all");
  const [configuring, setConfiguring] = useState<Connector | null>(null);

  const connectedCount = Object.values(statuses).filter(s => s === "connected").length;

  const visible = CONNECTORS.filter(c => {
    const s = statuses[c.id];
    if (filter === "connected") return s === "connected";
    if (filter === "available") return s === "available" || s === "coming-soon";
    return true;
  });

  const handleSave = () => {
    if (!configuring) return;
    setStatuses(prev => ({ ...prev, [configuring.id]: "connected" }));
    setConfiguring(null);
  };

  const handleDisconnect = () => {
    if (!configuring) return;
    setStatuses(prev => ({ ...prev, [configuring.id]: "available" }));
    setConfiguring(null);
  };

  const categoriesVisible = Array.from(new Set(visible.map(c => c.category)));

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl flex items-center justify-center bg-zinc-100">
              <Zap className="size-5 text-zinc-600" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Connectors</h1>
              <p className="text-[13px] text-zinc-400 mt-0.5">Integrate your tools and services</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-xl">
            <span className="size-2 rounded-full bg-emerald-400 inline-block" />
            <span className="text-[12px] font-medium text-zinc-700">{connectedCount} connected</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl w-fit mb-8">
          {(["all", "connected", "available"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all capitalize ${
                filter === f ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sections by category */}
        <div className="space-y-10">
          {categoriesVisible.map(category => {
            const items = visible.filter(c => c.category === category);
            return (
              <div key={category}>
                <h2 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(connector => (
                    <ConnectorCard
                      key={connector.id}
                      connector={{ ...connector, status: statuses[connector.id] }}
                      onConfigure={() => setConfiguring({ ...connector, status: statuses[connector.id] })}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Config modal */}
      {configuring && (
        <ConfigModal
          connector={configuring}
          onClose={() => setConfiguring(null)}
          onSave={handleSave}
          onDisconnect={handleDisconnect}
        />
      )}
    </PageShell>
  );
}
