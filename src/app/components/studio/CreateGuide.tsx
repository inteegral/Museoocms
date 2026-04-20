import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { AIAssistant } from "./AIAssistant";

export function CreateGuide() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: redirect to editor with new guide
    navigate("/studio/guides/guide-new");
  };

  const handleAIProposal = (proposal: any) => {
    // Apply AI proposal to form
    if (proposal.concept) {
      setFormData({
        title: formData.title || proposal.concept.narrative,
        description: proposal.concept.type + " - " + proposal.concept.narrative,
      });
    }
    // Navigate to editor with full proposal
    navigate("/studio/guides/guide-new", { state: { aiProposal: proposal } });
  };

  const suggestions = [
    "Tour Completo del Museo",
    "Highlights - Le Opere Principali",
    "Percorso per Famiglie",
    "Arte Antica - Collezione Permanente",
    "Mostra Temporanea",
  ];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Link
          to="/studio/guides"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 text-sm"
        >
          <ArrowLeft className="size-4" />
          Torna alle audioguide
        </Link>
        <h1 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
          Crea nuova audioguida
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          Inizia definendo titolo e descrizione della tua audioguida
        </p>
      </div>

      {/* AI Creation Option */}
      <div className="mb-6">
        <button
          onClick={() => setShowAIAssistant(true)}
          className="w-full p-4 md:p-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="size-10 md:size-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="size-5 md:size-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium mb-1 text-sm md:text-base">Crea con AI Assistant</h3>
              <p className="text-xs md:text-sm text-white/90">
                Lascia che l'AI ti aiuti a costruire l'intera narrazione basandosi sui tuoi documenti
              </p>
            </div>
            <div className="text-white/80 group-hover:translate-x-1 transition-transform text-xl hidden sm:block">→</div>
          </div>
        </button>
      </div>

      <div className="relative mb-6 md:mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs md:text-sm">
          <span className="px-4 bg-white text-slate-500">oppure crea manualmente</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Title */}
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <label className="block mb-3">
            <span className="text-sm font-medium text-slate-900 mb-1 block">
              Titolo audioguida *
            </span>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="es. Tour Completo della Collezione"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
            />
            <span className="text-xs text-slate-500 mt-2 block">
              Scegli un titolo chiaro e descrittivo per i visitatori
            </span>
          </label>

          {/* Suggestions */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Suggerimenti
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, title: suggestion })
                  }
                  className="px-3 py-1.5 text-sm bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <label className="block">
            <span className="text-sm font-medium text-slate-900 mb-1 block">
              Descrizione breve
            </span>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descrivi brevemente il contenuto e il percorso dell'audioguida..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none text-slate-900"
            />
            <span className="text-xs text-slate-500 mt-2 block">
              Questa descrizione aiuterà i visitatori a scegliere il percorso giusto
            </span>
          </label>
        </div>

        {/* Info Box */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="font-medium text-slate-900 mb-3">Prossimi passi</h3>
          <ol className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="size-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-slate-900 font-medium text-xs">
                1
              </span>
              <span>Aggiungi i Punti di Interesse (POI) dall'editor</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="size-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-slate-900 font-medium text-xs">
                2
              </span>
              <span>Riordina i POI per creare il percorso ideale</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="size-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-slate-900 font-medium text-xs">
                3
              </span>
              <span>Pubblica l'audioguida acquistando un pacchetto vocale</span>
            </li>
          </ol>
        </div>

        {/* Piano Limits */}
        <div className="bg-slate-900 text-white rounded-xl p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="font-medium mb-2">Piano Gratuito</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>✓ Fino a 3 audioguide in bozza</li>
                <li>✓ Fino a 10 POI per guida</li>
                <li>✓ Modifica e aggiorna quando vuoi</li>
              </ul>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light mb-1">2/3</div>
              <div className="text-xs text-slate-400">bozze create</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/studio/guides"
            className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-center"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={!formData.title.trim()}
            className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crea audioguida
          </button>
        </div>
      </form>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant
          guideName={formData.title || "Nuova Audioguida"}
          onClose={() => setShowAIAssistant(false)}
          onAccept={handleAIProposal}
          documentsContext={[
            { id: "1", name: "Storia_Museo.pdf", type: "pdf" },
            { id: "2", name: "Catalogo_Opere.pdf", type: "pdf" },
            { id: "3", name: "Guida_Collezione.docx", type: "document" },
          ]}
        />
      )}
    </div>
  );
}