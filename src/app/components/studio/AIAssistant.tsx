import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, FileText, CheckCircle, RefreshCw } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Step = "concept" | "structure" | "content" | "complete";

type Proposal = {
  concept?: {
    type: string;
    target: string;
    narrative: string;
    tone: string;
  };
  structure?: {
    pois: Array<{
      id: string;
      title: string;
      order: number;
      reason: string;
    }>;
  };
  contents?: {
    [poiId: string]: {
      title: string;
      description: string;
      audioScript: string;
    };
  };
};

interface AIAssistantProps {
  guideName: string;
  onClose: () => void;
  onAccept: (proposal: Proposal) => void;
  availablePOIs?: Array<{ id: string; title: string; category: string }>;
  documentsContext?: Array<{ id: string; name: string; type: string }>;
}

export function AIAssistant({
  guideName,
  onClose,
  onAccept,
  availablePOIs = [],
  documentsContext = [],
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Ciao! Sono qui per aiutarti a costruire la narrazione di "${guideName}".\n\nPossiamo lavorare insieme per definire:\n\n1️⃣ **Il concept narrativo** - Che storia vuoi raccontare?\n2️⃣ **La struttura** - Quali POI includere e in che ordine?\n3️⃣ **I contenuti** - Testi coerenti per ogni punto del percorso\n\nPer iniziare, dimmi: che tipo di esperienza vuoi creare per i visitatori? (es. tour cronologico, highlights, percorso tematico, tour per famiglie...)`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>("concept");
  const [proposal, setProposal] = useState<Proposal>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Simulate AI response based on current step
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, currentStep);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse.message,
          timestamp: new Date(),
        },
      ]);

      if (aiResponse.updateProposal) {
        setProposal((prev) => ({ ...prev, ...aiResponse.updateProposal }));
      }

      if (aiResponse.nextStep) {
        setCurrentStep(aiResponse.nextStep);
      }

      setIsGenerating(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, step: Step) => {
    const lowerInput = userInput.toLowerCase();

    // Step 1: Concept Narrative
    if (step === "concept") {
      const conceptProposal = {
        type: "Tour Cronologico",
        target: "Pubblico generale e appassionati d'arte",
        narrative: "Un viaggio attraverso i secoli dell'arte italiana",
        tone: "Informale ma autorevole, accessibile a tutti",
      };

      return {
        message: `Ottima idea! Basandomi sui tuoi documenti, ti propongo questo **concept narrativo**:\n\n📖 **Tipo**: ${conceptProposal.type}\n👥 **Target**: ${conceptProposal.target}\n✨ **Filo conduttore**: ${conceptProposal.narrative}\n🎭 **Tono**: ${conceptProposal.tone}\n\n---\n\nHo analizzato questi documenti:\n${documentsContext.slice(0, 3).map((d) => `• ${d.name}`).join("\n")}\n\nTi piace questo concept? Posso modificarlo se vuoi cambiare il tono, il target o il filo narrativo. Oppure dimmi "procedi" per passare alla struttura del percorso.`,
        updateProposal: { concept: conceptProposal },
        nextStep: lowerInput.includes("procedi") || lowerInput.includes("ok") ? "structure" : "concept",
      };
    }

    // Step 2: Structure (POI selection and order)
    if (step === "structure") {
      const structureProposal = {
        pois: [
          {
            id: "poi-1",
            title: "Ingresso e Atrio Principale",
            order: 1,
            reason: "Introduzione al museo e contestualizzazione storica",
          },
          {
            id: "poi-2",
            title: "Sala del Rinascimento",
            order: 2,
            reason: "Prime opere cronologiche, fondamenta del percorso",
          },
          {
            id: "poi-3",
            title: "Capolavori del Barocco",
            order: 3,
            reason: "Evoluzione stilistica e momento di massimo splendore",
          },
          {
            id: "poi-4",
            title: "Collezione Moderna",
            order: 4,
            reason: "Connessione con il contemporaneo, chiusura del viaggio",
          },
        ],
      };

      return {
        message: `Perfetto! Ecco la **struttura del percorso** che ti propongo:\n\n${structureProposal.pois
          .map(
            (poi) =>
              `**${poi.order}. ${poi.title}**\n   ↳ ${poi.reason}`
          )
          .join("\n\n")}\n\n---\n\nQuesta sequenza crea un flusso narrativo coerente dal ${proposal.concept?.type || "concept scelto"}.\n\nPosso:\n• Aggiungere o rimuovere POI\n• Cambiare l'ordine\n• Modificare il focus di un punto\n\nOppure dimmi "genera i contenuti" per procedere con la scrittura dei testi.`,
        updateProposal: { structure: structureProposal },
        nextStep: lowerInput.includes("genera") || lowerInput.includes("contenut") ? "content" : "structure",
      };
    }

    // Step 3: Content Generation
    if (step === "content") {
      const contentProposal = {
        "poi-1": {
          title: "Benvenuti al Museo",
          description: "Varchi la soglia di un viaggio attraverso cinque secoli di arte italiana. Questo palazzo, costruito nel 1650, custodisce una delle collezioni più straordinarie del paese.",
          audioScript: "Benvenuto al nostro museo. Ti trovi nell'atrio principale di Palazzo Rossi, costruito nel diciassettesimo secolo per ospitare la famiglia nobiliare che ha dato vita a questa incredibile collezione. Guardati intorno: le volte affrescate sopra di te raccontano già la prima storia del nostro viaggio attraverso l'arte italiana. Preparati a scoprire cinque secoli di bellezza, innovazione e passione.",
        },
      };

      return {
        message: `Ecco il **primo contenuto generato**:\n\n---\n\n### ${contentProposal["poi-1"].title}\n\n**Descrizione breve:**\n${contentProposal["poi-1"].description}\n\n**Script audio (60s):**\n"${contentProposal["poi-1"].audioScript}"\n\n---\n\n📚 *Generato da: Documento_Storia_Museo.pdf, Guida_Collezioni.pdf*\n\nPosso:\n• Renderlo più breve o più dettagliato\n• Cambiare il tono (più formale, più coinvolgente, per bambini...)\n• Aggiungere riferimenti specifici\n• Generare i contenuti per gli altri POI\n\nCosa preferisci?`,
        updateProposal: { contents: contentProposal },
        nextStep: lowerInput.includes("altri") || lowerInput.includes("tutti") ? "complete" : "content",
      };
    }

    // Step 4: Complete
    if (step === "complete") {
      return {
        message: `✅ **Proposta completa generata!**\n\nHo creato:\n• 1 concept narrativo coerente\n• 4 POI strutturati in sequenza logica\n• Contenuti testuali e audio per ogni punto\n\nPuoi ancora chiedermi di modificare qualsiasi parte, oppure clicca su "Accetta e Applica" per usare questa proposta nella tua audioguida.\n\nRicorda: potrai sempre modificare manualmente ogni elemento dopo averlo applicato!`,
        nextStep: "complete",
      };
    }

    // Generic refinement response
    return {
      message: `Capisco, ${lowerInput.includes("breve") ? "renderò il contenuto più conciso" : lowerInput.includes("dettagli") ? "aggiungerò più dettagli e profondità" : "modifico come richiesto"}.\n\n[Qui apparirebbe la versione aggiornata]\n\nVa meglio così?`,
    };
  };

  const handleAcceptProposal = () => {
    onAccept(proposal);
    onClose();
  };

  const canAccept = currentStep === "complete" || (proposal.concept && proposal.structure);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] max-h-[900px] flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="size-8 md:size-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="size-4 md:size-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium text-slate-900 text-sm md:text-base">AI Assistant</h2>
              <p className="text-xs md:text-sm text-slate-600 line-clamp-1">Costruiamo insieme "{guideName}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 bg-slate-50 overflow-x-auto flex-shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {["concept", "structure", "content", "complete"].map((step, index) => {
              const isActive = currentStep === step;
              const isPast = ["concept", "structure", "content", "complete"].indexOf(currentStep) > index;
              const labels = {
                concept: "Concept",
                structure: "Struttura",
                content: "Contenuti",
                complete: "Completo",
              };

              return (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`
                      px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap
                      ${isActive ? "bg-slate-900 text-white" : ""}
                      ${isPast ? "bg-green-100 text-green-700" : ""}
                      ${!isActive && !isPast ? "bg-white text-slate-400 border border-slate-200" : ""}
                    `}
                  >
                    {isPast ? "✓" : index + 1}. {labels[step as Step]}
                  </div>
                  {index < 3 && (
                    <div className={`w-4 md:w-8 h-0.5 ${isPast ? "bg-green-300" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Context Info */}
        {documentsContext.length > 0 && (
          <div className="px-4 md:px-6 py-2 md:py-3 bg-blue-50 border-b border-blue-100 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs md:text-sm text-blue-900">
              <FileText className="size-4 flex-shrink-0" />
              <span>
                Contesto: <strong>{documentsContext.length} documenti</strong> caricati
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3 md:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="size-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-4 text-white" />
                </div>
              )}
              <div
                className={`
                  max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-wrap
                  ${
                    message.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-900"
                  }
                `}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="size-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-600 font-medium text-sm">
                  Tu
                </div>
              )}
            </div>
          ))}
          {isGenerating && (
            <div className="flex gap-3 justify-start">
              <div className="size-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="size-4 text-white animate-spin" />
              </div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl text-slate-600">
                Sto elaborando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 md:px-6 py-4 border-t border-slate-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Scrivi la tua richiesta o modifica..."
              disabled={isGenerating}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isGenerating}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="size-4" />
            </button>
          </div>

          {/* Accept Button */}
          {canAccept && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <button
                onClick={handleAcceptProposal}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="size-5" />
                Accetta e Applica alla Audioguida
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}