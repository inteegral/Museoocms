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
      content: `Hi! I'm here to help you build the narrative for "${guideName}".\n\nWe can work together to define:\n\n1️⃣ **The narrative concept** — What story do you want to tell?\n2️⃣ **The structure** — Which POIs to include and in what order?\n3️⃣ **The content** — Consistent texts for each stop on the tour\n\nTo get started, tell me: what kind of experience do you want to create for visitors? (e.g. chronological tour, highlights, thematic tour, family tour...)`,
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
        type: "Chronological Tour",
        target: "General public and art enthusiasts",
        narrative: "A journey through centuries of Italian art",
        tone: "Informal yet authoritative, accessible to all",
      };

      return {
        message: `Great idea! Based on your documents, here's a **narrative concept** I'd suggest:\n\n📖 **Type**: ${conceptProposal.type}\n👥 **Target**: ${conceptProposal.target}\n✨ **Thread**: ${conceptProposal.narrative}\n🎭 **Tone**: ${conceptProposal.tone}\n\n---\n\nI analysed these documents:\n${documentsContext.slice(0, 3).map((d) => `• ${d.name}`).join("\n")}\n\nDo you like this concept? I can adjust the tone, target, or narrative thread. Or say "proceed" to move on to the tour structure.`,
        updateProposal: { concept: conceptProposal },
        nextStep: lowerInput.includes("proceed") || lowerInput.includes("ok") ? "structure" : "concept",
      };
    }

    // Step 2: Structure (POI selection and order)
    if (step === "structure") {
      const structureProposal = {
        pois: [
          {
            id: "poi-1",
            title: "Entrance and Main Hall",
            order: 1,
            reason: "Introduction to the museum and historical context",
          },
          {
            id: "poi-2",
            title: "Renaissance Gallery",
            order: 2,
            reason: "First chronological works, foundation of the tour",
          },
          {
            id: "poi-3",
            title: "Baroque Masterpieces",
            order: 3,
            reason: "Stylistic evolution and peak of artistic splendour",
          },
          {
            id: "poi-4",
            title: "Modern Collection",
            order: 4,
            reason: "Connection to the contemporary, closing the journey",
          },
        ],
      };

      return {
        message: `Perfect! Here's the **tour structure** I'd suggest:\n\n${structureProposal.pois
          .map(
            (poi) =>
              `**${poi.order}. ${poi.title}**\n   ↳ ${poi.reason}`
          )
          .join("\n\n")}\n\n---\n\nThis sequence creates a coherent narrative flow from the ${proposal.concept?.type || "chosen concept"}.\n\nI can:\n• Add or remove POIs\n• Change the order\n• Adjust the focus of a stop\n\nOr say "generate content" to proceed with writing the texts.`,
        updateProposal: { structure: structureProposal },
        nextStep: lowerInput.includes("generate") || lowerInput.includes("content") ? "content" : "structure",
      };
    }

    // Step 3: Content Generation
    if (step === "content") {
      const contentProposal = {
        "poi-1": {
          title: "Welcome to the Museum",
          description: "Step across the threshold of a journey through five centuries of Italian art. This palazzo, built in 1650, houses one of the most extraordinary collections in the country.",
          audioScript: "Welcome to our museum. You're standing in the main atrium of Palazzo Rossi, built in the seventeenth century to house the noble family behind this incredible collection. Look around you — the frescoed vaults above already tell the opening chapter of our journey through Italian art. Prepare to discover five centuries of beauty, innovation, and passion.",
        },
      };

      return {
        message: `Here's the **first generated content**:\n\n---\n\n### ${contentProposal["poi-1"].title}\n\n**Short description:**\n${contentProposal["poi-1"].description}\n\n**Audio script (60s):**\n"${contentProposal["poi-1"].audioScript}"\n\n---\n\n📚 *Generated from: Museum_History.pdf, Collection_Guide.pdf*\n\nI can:\n• Make it shorter or more detailed\n• Change the tone (more formal, more engaging, for children...)\n• Add specific references\n• Generate content for the other POIs\n\nWhat would you prefer?`,
        updateProposal: { contents: contentProposal },
        nextStep: lowerInput.includes("other") || lowerInput.includes("all") ? "complete" : "content",
      };
    }

    // Step 4: Complete
    if (step === "complete") {
      return {
        message: `✅ **Complete proposal generated!**\n\nI've created:\n• 1 coherent narrative concept\n• 4 POIs structured in logical sequence\n• Text and audio content for each stop\n\nYou can still ask me to modify any part, or click "Accept and Apply" to use this proposal in your guide.\n\nRemember: you can always manually edit each element after applying it!`,
        nextStep: "complete",
      };
    }

    // Generic refinement response
    return {
      message: `Understood, ${lowerInput.includes("short") ? "I'll make the content more concise" : lowerInput.includes("detail") ? "I'll add more depth and detail" : "I'll update as requested"}.\n\n[Updated version would appear here]\n\nDoes this look better?`,
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
              <p className="text-xs md:text-sm text-slate-600 line-clamp-1">Let's build "{guideName}" together</p>
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
                structure: "Structure",
                content: "Content",
                complete: "Complete",
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
                Context: <strong>{documentsContext.length} documents</strong> loaded
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
                  You
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
                Processing...
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
              placeholder="Type your request or feedback..."
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
                Accept and Apply to Guide
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}