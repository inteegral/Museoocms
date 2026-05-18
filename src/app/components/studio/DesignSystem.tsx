import { useState } from "react";
import {
  Plus, ArrowRight, Trash2, Download, Upload, Check,
  Bell, Star, Lock, Eye, Edit2, X, ChevronDown, Info,
  AlertTriangle, CheckCircle, XCircle, Loader2, User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Toggle } from "./Toggle";

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="pb-3 border-b border-zinc-100">
        <h2 className="text-[16px] font-semibold text-zinc-900">{title}</h2>
        {description && <p className="text-[13px] text-zinc-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────────────────
function Swatch({ bg, label, hex }: { bg: string; label: string; hex: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`size-12 rounded-xl border border-zinc-200 ${bg}`} />
      <div className="text-center">
        <p className="text-[11px] font-medium text-zinc-700">{label}</p>
        <p className="text-[10px] text-zinc-400">{hex}</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function DesignSystem() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(true);

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="border-b border-zinc-100 px-10 py-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Design System</h1>
          <span className="text-[12px] font-medium text-zinc-400 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-md">v1.0</span>
        </div>
        <p className="text-[14px] text-zinc-400 mt-1">Atoms, molecules and design tokens for Museoo Studio.</p>
      </div>

      <div className="px-10 py-8 space-y-14 max-w-4xl">

        {/* ── FOUNDATION ────────────────────────────────────────────────────── */}

        <Section title="Colors" description="Brand palette and semantic colors.">
          <div className="space-y-5">
            <Row label="Brand">
              <Swatch bg="bg-[#D33333]" label="Brand" hex="#D33333" />
              <Swatch bg="bg-[#b82c2c]" label="Brand Dark" hex="#b82c2c" />
              <Swatch bg="bg-[#f5e5e5]" label="Brand Tint" hex="#f5e5e5" />
            </Row>
            <Row label="Zinc scale">
              {[
                ["bg-zinc-50", "50", "#FAFAFA"], ["bg-zinc-100", "100", "#F4F4F5"],
                ["bg-zinc-200", "200", "#E4E4E7"], ["bg-zinc-300", "300", "#D4D4D8"],
                ["bg-zinc-400", "400", "#A1A1AA"], ["bg-zinc-500", "500", "#71717A"],
                ["bg-zinc-600", "600", "#52525B"], ["bg-zinc-700", "700", "#3F3F46"],
                ["bg-zinc-800", "800", "#27272A"], ["bg-zinc-900", "900", "#18181B"],
                ["bg-zinc-950", "950", "#09090B"],
              ].map(([bg, label, hex]) => (
                <Swatch key={label} bg={bg} label={label} hex={hex} />
              ))}
            </Row>
            <Row label="Semantic">
              <Swatch bg="bg-emerald-500" label="Success" hex="#10B981" />
              <Swatch bg="bg-amber-500" label="Warning" hex="#F59E0B" />
              <Swatch bg="bg-red-500" label="Error" hex="#EF4444" />
            </Row>
          </div>
        </Section>

        <Section title="Typography" description="Fraunces variable font. Display and body share the same family.">
          <div className="space-y-3">
            {[
              ["Display XL", "text-[32px] font-light tracking-tight", "Storytelling for evolving Museums"],
              ["Display L", "text-[24px] font-light tracking-tight", "Create your first audio guide"],
              ["Heading 1", "text-[20px] font-semibold tracking-tight", "Museum Name"],
              ["Heading 2", "text-[16px] font-semibold", "Audio Guides"],
              ["Heading 3", "text-[14px] font-semibold", "Section title"],
              ["Body", "text-[14px] font-normal text-zinc-700", "The primary content language will be used for your scripts."],
              ["Body SM", "text-[13px] font-normal text-zinc-600", "Add collaborators now, or skip and do it later from Settings."],
              ["Caption", "text-[11px] font-medium text-zinc-400 uppercase tracking-wide", "Last updated · 2 days ago"],
              ["Mono", "text-[12px] font-mono text-zinc-600", "museo_abc123"],
            ].map(([label, cls, text]) => (
              <div key={label} className="flex items-baseline gap-4">
                <span className="text-[11px] font-medium text-zinc-400 w-24 flex-shrink-0">{label}</span>
                <span className={cls as string}>{text as string}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── ATOMS ─────────────────────────────────────────────────────────── */}

        <Section title="Buttons" description="Use the Button component. variant= controls style, size= controls dimensions.">
          <div className="space-y-6">
            <Row label="Variants">
              <Button variant="default">Save changes</Button>
              <Button variant="outline">Cancel</Button>
              <Button variant="ghost">Skip for now</Button>
              <Button variant="dark">Create guide</Button>
              <Button variant="destructive">Delete</Button>
              <Button variant="link">Learn more</Button>
            </Row>
            <Row label="With icons">
              <Button variant="default"><Plus className="size-4" /> New guide</Button>
              <Button variant="outline"><Download className="size-4" /> Export</Button>
              <Button variant="dark"><Upload className="size-4" /> Publish</Button>
              <Button variant="destructive"><Trash2 className="size-4" /> Remove</Button>
            </Row>
            <Row label="Sizes">
              <Button variant="default" size="sm">Small</Button>
              <Button variant="default" size="default">Default</Button>
              <Button variant="default" size="lg">Large</Button>
              <Button variant="outline" size="icon"><ArrowRight className="size-4" /></Button>
              <Button variant="ghost" size="icon"><Bell className="size-4" /></Button>
            </Row>
            <Row label="States">
              <Button variant="default" disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled</Button>
              <Button variant="default"><Loader2 className="size-4 animate-spin" /> Loading…</Button>
            </Row>
          </div>
        </Section>

        <Section title="Badges" description="Use inline or as status indicators. Pair with icons when needed.">
          <div className="space-y-4">
            <Row label="Filled">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#D33333] text-white">Brand</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-900 text-white">Dark</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500 text-white">Published</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-400 text-white">Draft</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-violet-500 text-white">Paid</span>
            </Row>
            <Row label="Subtle (bordered)">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f5e5e5] text-[#D33333] border border-[#D33333]/20">Brand</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">Neutral</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><Check className="size-3" />Active</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Draft</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">Archived</span>
            </Row>
            <Row label="Uppercase pill">
              {["Owner", "Curator", "Translator", "Reviewer"].map(r => (
                <span key={r} className="px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-zinc-100 text-zinc-600">{r}</span>
              ))}
            </Row>
          </div>
        </Section>

        <Section title="Toggle" description="Use the Toggle component. Pass checked and onChange.">
          <Row label="States">
            <div className="flex items-center gap-3">
              <Toggle checked={toggle1} onChange={() => setToggle1(v => !v)} />
              <span className="text-[13px] text-zinc-600">{toggle1 ? "On" : "Off"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Toggle checked={toggle2} onChange={() => setToggle2(v => !v)} />
              <span className="text-[13px] text-zinc-600">{toggle2 ? "On" : "Off"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Toggle checked={toggle3} onChange={() => setToggle3(v => !v)} />
              <span className="text-[13px] text-zinc-600">{toggle3 ? "On" : "Off"}</span>
            </div>
          </Row>
        </Section>

        <Section title="Form Elements" description="Inputs, selects and textareas follow the same style.">
          <div className="space-y-4 max-w-sm">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-700">Museum name</label>
              <input
                type="text"
                defaultValue="Museo Nazionale Romano"
                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-[13px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#D33333]/30 focus:border-[#D33333]/50 transition-all"
              />
              <p className="text-[12px] text-zinc-400">This appears throughout your workspace.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-700">Role</label>
              <select className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#D33333]/30 focus:border-[#D33333]/50 bg-white transition-all">
                <option>Curator</option>
                <option>Translator</option>
                <option>Reviewer</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-700">Description</label>
              <textarea
                rows={3}
                defaultValue="This is a note about the artwork."
                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-[13px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#D33333]/30 focus:border-[#D33333]/50 resize-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-700">Disabled</label>
              <input
                type="text"
                disabled
                defaultValue="Read only value"
                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-[13px] text-zinc-400 bg-zinc-50 cursor-not-allowed"
              />
            </div>
          </div>
        </Section>

        <Section title="Avatars" description="Size variants for user, team, and ownership contexts.">
          <Row label="Sizes">
            {[["size-6 text-[8px]", "XS"], ["size-8 text-[10px]", "SM"], ["size-10 text-[12px]", "MD"], ["size-12 text-[14px]", "LG"]].map(([cls, label]) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className={`${cls} rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-semibold text-zinc-600`}>AB</div>
                <span className="text-[10px] text-zinc-400">{label}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-10 rounded-full bg-[#D33333] flex items-center justify-center text-white text-[12px] font-semibold">MN</div>
              <span className="text-[10px] text-zinc-400">Brand</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-10 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[12px] font-semibold"><User className="size-4" /></div>
              <span className="text-[10px] text-zinc-400">Icon</span>
            </div>
          </Row>
        </Section>

        {/* ── MOLECULES ─────────────────────────────────────────────────────── */}

        <Section title="Alerts" description="Contextual messages. Use the semantic color matching the intent.">
          <div className="space-y-3">
            {[
              { icon: Info, bg: "bg-blue-50 border-blue-200", text: "text-blue-800", label: "Info", msg: "Your workspace is set up and ready to use." },
              { icon: CheckCircle, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", label: "Success", msg: "Audio guide published successfully." },
              { icon: AlertTriangle, bg: "bg-amber-50 border-amber-200", text: "text-amber-800", label: "Warning", msg: "You have 3 unsaved changes. Publish before leaving." },
              { icon: XCircle, bg: "bg-red-50 border-red-200", text: "text-red-800", label: "Error", msg: "Failed to upload audio file. Max size is 50MB." },
            ].map(({ icon: Icon, bg, text, label, msg }) => (
              <div key={label} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${bg}`}>
                <Icon className={`size-4 mt-0.5 flex-shrink-0 ${text}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium ${text}`}>{label}</p>
                  <p className={`text-[12px] mt-0.5 ${text} opacity-80`}>{msg}</p>
                </div>
                <button className={`${text} opacity-50 hover:opacity-100 transition-opacity`}><X className="size-3.5" /></button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Cards" description="Use for content groupings. border + rounded-2xl + white bg.">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-zinc-200 rounded-2xl p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-zinc-900">Roma Antica</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><Check className="size-2.5" />Published</span>
              </div>
              <p className="text-[12px] text-zinc-400">4 languages · 12 POIs · 38 min</p>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm"><Edit2 className="size-3" /> Edit</Button>
                <Button variant="ghost" size="sm"><Eye className="size-3" /> Preview</Button>
              </div>
            </div>
            <div className="border border-zinc-200 rounded-2xl p-5 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-zinc-900">Medioevo</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Draft</span>
              </div>
              <p className="text-[12px] text-zinc-400">2 languages · 7 POIs · 22 min</p>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="default" size="sm">Publish</Button>
                <Button variant="ghost" size="sm"><Eye className="size-3" /> Preview</Button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Empty States" description="Use when a list or section has no content yet.">
          <div className="border border-zinc-200 rounded-2xl p-10 flex flex-col items-center text-center space-y-4">
            <div className="size-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <Star className="size-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-zinc-900">No audio guides yet</p>
              <p className="text-[13px] text-zinc-400 mt-1 max-w-xs">Create your first audio guide to start building immersive museum experiences.</p>
            </div>
            <Button variant="default"><Plus className="size-4" /> Create audio guide</Button>
          </div>
        </Section>

        <Section title="Table Row" description="Consistent padding, zebra hover, action column on the right.">
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Languages</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Roma Antica", status: "Published", langs: "IT EN FR", statusCls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { name: "Medioevo", status: "Draft", langs: "IT EN", statusCls: "bg-amber-50 text-amber-700 border-amber-200" },
                  { name: "Arte Moderna", status: "Archived", langs: "IT", statusCls: "bg-zinc-100 text-zinc-500 border-zinc-200" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-[13px] font-medium text-zinc-900">{row.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${row.statusCls}`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-zinc-500">{row.langs}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="size-7"><Edit2 className="size-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="size-7 text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="size-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Icon Buttons" description="Ghost icon buttons for toolbar actions. Use size='icon' on Button.">
          <Row label="Default">
            {[Bell, Star, Lock, Eye, Edit2, Download, Upload, X, ChevronDown].map((Icon, i) => (
              <Button key={i} variant="ghost" size="icon"><Icon className="size-4" /></Button>
            ))}
          </Row>
          <Row label="Dark">
            {[Bell, Star, Edit2, Download].map((Icon, i) => (
              <Button key={i} variant="dark" size="icon"><Icon className="size-4" /></Button>
            ))}
          </Row>
        </Section>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}
