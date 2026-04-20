Build a Next.js 14 web application prototype for an AI-powered audio guide platform targeting small Italian cultural sites. Use the App Router, Supabase for database and auth, and Tailwind CSS for styling.

## Core concept
Cultural sites (museums, churches, historic sites) upload their own documents into a RAG knowledge base, create Points of Interest (POI), assemble audio guides from those POIs, then publish them for visitors to access via QR code in a browser — no app download required.

## Business model
Two separate layers:

**Production (one-time packs)**
- Free tier: up to 3 audio guides in draft, up to 10 POIs per guide, 1 language, no voice generation
- To publish: museum must purchase a pack
  - Pack "Voice 10": TTS voice generation for 1 language, up to 10 POIs — €19
  - Pack "Voice 20": TTS voice generation for 1 language, up to 20 POIs — €29
  - Pack "+ Language 10": translation + TTS for 1 additional language, up to 10 POIs — €15
  - Pack "+ Language 20": translation + TTS for 1 additional language, up to 20 POIs — €22
- Packs are per audio guide, not a wallet

**Distribution (monthly, usage-based)**
- Free: up to 100 visitor accesses/month
- Small: €29/month up to 1,000 accesses
- Medium: €79/month up to 5,000 accesses
- Large: €199/month up to 20,000 accesses
- Access counter resets monthly. Alert at 80% of limit.

## Database schema (Supabase / Postgres)
```sql
-- Museums (tenants)
museums (
  id uuid PK,
  name text,
  slug text UNIQUE,
  logo_url text,
  owner_id uuid FK → auth.users,
  plan text DEFAULT 'free', -- free | small | medium | large
  monthly_accesses int DEFAULT 0,
  accesses_reset_at timestamptz,
  created_at timestamptz
)

-- Documents uploaded to RAG
documents (
  id uuid PK,
  museum_id uuid FK → museums,
  filename text,
  storage_path text,
  extracted_text text,
  created_at timestamptz
)

-- Points of Interest
pois (
  id uuid PK,
  museum_id uuid FK → museums,
  title text,
  body text, -- curator-written or AI-assisted from RAG
  image_url text,
  order_index int,
  created_at timestamptz
)

-- Audio Guides
audio_guides (
  id uuid PK,
  museum_id uuid FK → museums,
  title text,
  description text,
  status text DEFAULT 'draft', -- draft | published
  created_at timestamptz
)

-- Junction: which POIs are in which guide and in what order
audio_guide_pois (
  id uuid PK,
  audio_guide_id uuid FK → audio_guides,
  poi_id uuid FK → pois,
  order_index int
)

-- Languages per published guide
audio_guide_languages (
  id uuid PK,
  audio_guide_id uuid FK → audio_guides,
  language_code text, -- it, en, de, fr, es...
  status text DEFAULT 'pending', -- pending | generating | ready
  pack_id uuid FK → packs
)

-- Audio tracks (one per POI per language)
audio_tracks (
  id uuid PK,
  audio_guide_id uuid FK → audio_guides,
  poi_id uuid FK → pois,
  language_code text,
  script text, -- AI-generated script
  audio_url text, -- Supabase Storage URL
  duration_seconds int,
  created_at timestamptz
)

-- Packs purchased
packs (
  id uuid PK,
  museum_id uuid FK → museums,
  audio_guide_id uuid FK → audio_guides,
  pack_type text, -- voice_10 | voice_20 | lang_10 | lang_20
  language_code text,
  max_pois int,
  status text DEFAULT 'active', -- active | consumed
  purchased_at timestamptz
)

-- Visitor accesses (for usage tracking)
visitor_accesses (
  id uuid PK,
  audio_guide_id uuid FK → audio_guides,
  museum_id uuid FK → museums,
  language_code text,
  accessed_at timestamptz
)
```

## Application structure
/app
/[museum-slug]              → Public visitor player (SSR, no auth)
/[museum-slug]/[guide-id]   → Specific guide player
/studio                     → Museum dashboard (authenticated)
/documents                → Upload & manage RAG documents
/pois                     → Create & edit POIs
/guides                   → List of audio guides
/guides/[id]              → Guide editor (add POIs, reorder)
/guides/[id]/publish      → Publish flow (select languages, buy packs)
/analytics                → Access stats
/settings                 → Museum profile
/api
/ai/generate-script       → POST: generate script for a POI from RAG
/ai/generate-audio        → POST: call ElevenLabs TTS for a track
/ai/translate             → POST: translate script to target language
/accesses/track           → POST: increment visitor access counter
/packs/purchase           → POST: Stripe checkout for a pack
/webhooks/stripe          → POST: Stripe webhook handler

## Pages to build (in priority order)

### 1. Studio — Guide editor (/studio/guides/[id])
The most important screen. Shows:
- Guide title (editable inline)
- List of POIs added to this guide (drag to reorder)
- Button to add POIs from the museum's POI library
- For each POI: title, first 80 chars of body, remove button
- Status bar: X/10 POIs used (or X/20 if pack purchased)
- Language badges: IT (always shown), + Add language button
- Bottom CTA: "Publish guide" button — disabled if status is draft and no pack purchased, enabled after pack purchase

### 2. Studio — Publish flow (/studio/guides/[id]/publish)
Step-by-step:
- Step 1: Review — show guide summary (title, POI count, languages)
- Step 2: Select packs — show available packs with prices, highlight recommended based on POI count. If guide has 8 POIs suggest Voice 10, if 15 POIs suggest Voice 20.
- Step 3: Payment — Stripe checkout (test mode)
- Step 4: Generating — progress screen while TTS runs
- Step 5: Live — show QR code, copy link button, download QR button

### 3. Visitor player (/[museum-slug]/[guide-id])
Mobile-first, no auth required:
- Museum name + logo at top
- Guide title
- Language selector (only shows languages with status=ready)
- List of stops with number, title, duration
- Tap a stop → full-screen player: artwork image, title, play/pause, progress bar, transcript toggle (for accessibility)
- Offline: on first load, cache all audio files for this guide using the Cache API
- Access tracked on first load (calls /api/accesses/track)

### 4. Studio — POI editor (/studio/pois)
- List of all POIs for this museum
- Create new POI: title + body text editor
- "Generate with AI" button: takes the POI title, searches the museum's RAG documents, returns a suggested 90-second script. Museum can accept, edit, or discard.
- Image upload per POI

### 5. Studio — Documents (/studio/documents)
- Upload PDF, Word, or plain text files
- On upload: extract text, store in documents table
- Show list of uploaded documents with filename and upload date
- These feed the RAG for AI script generation

### 6. Studio — Analytics (/studio/analytics)
- Total accesses this month vs limit
- Progress bar showing usage vs plan limit
- Alert banner when above 80%
- Accesses by guide (bar chart)
- Accesses by language (pie or donut)
- Upgrade CTA when approaching limit

## AI integrations

**Script generation (OpenAI GPT-4o)**
- Input: POI title + POI body + retrieved chunks from museum's RAG documents
- System prompt: "You are an expert museum audio guide writer. Write a 90-second audio guide script (approximately 180 words) for the following exhibit. Write in second person singular, conversational spoken language (not written text), engaging tone. Use only information from the provided source documents. If information is insufficient, say so rather than inventing details. Output only the script, no preamble."
- RAG retrieval: use simple cosine similarity on document chunks stored in Supabase with pgvector extension

**TTS (ElevenLabs)**
- Model: eleven_multilingual_v2
- Voice: configurable per museum (default: a neutral professional voice)
- Cache: store generated audio in Supabase Storage. Only regenerate if script changes.
- Cost note: ~€0.24 per stop per language — cache aggressively

**Translation (OpenAI GPT-4o)**
- Translate the Italian script to target language
- Preserve spoken language register and second-person address
- Then run TTS on the translated script

## Key technical details

- All studio routes require Supabase auth (use middleware)
- Museum slug must be unique — validate on creation
- Visitor player is fully public (no auth, no cookies required for GDPR)
- Access tracking is anonymous — store only audio_guide_id, language, timestamp (no IP, no fingerprint)
- Audio files served via Supabase Storage with public URLs
- QR codes generated client-side using the `qrcode` npm package
- Monthly access counter: reset using a Supabase cron job or on first access after reset_at date
- Alert at 80% usage: check on every access track call, send email via Supabase Edge Functions if threshold crossed

## UI/UX requirements
- Studio: clean, minimal, desktop-first. Think Notion meets a simple CMS.
- Visitor player: mobile-first, full-screen audio experience, large tap targets, works on low-end Android
- Language: Italian for studio UI, visitor player auto-detects browser language and defaults to it if available
- No dark mode required for prototype

## What to build first
Focus on these flows in order:
1. Auth + museum onboarding (create museum, set slug)
2. Document upload + POI creation with AI script generation
3. Guide editor (add POIs, reorder)
4. Publish flow with mock payment (Stripe test mode)
5. Visitor player with audio playback
6. Access tracking + analytics dashboard

Use mock/placeholder for ElevenLabs in early development (return a placeholder MP3 URL) to avoid API costs during prototyping.