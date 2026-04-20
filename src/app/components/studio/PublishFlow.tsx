import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Check, Loader2, Download, Copy, ExternalLink } from "lucide-react";
import { mockGuides, mockPacks } from "../../data/mockData";
import QRCode from "qrcode";

type Step = "review" | "packs" | "payment" | "generating" | "live";

export function PublishFlow() {
  const { id } = useParams();
  const guide = mockGuides.find((g) => g.id === id);
  const [currentStep, setCurrentStep] = useState<Step>("review");
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const guideUrl = `https://audioguide.app/museo-archeologico/${id}`;

  useEffect(() => {
    if (currentStep === "live" && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, guideUrl, {
        width: 256,
        margin: 2,
      });
    }
  }, [currentStep, guideUrl]);

  if (!guide) {
    return <div className="p-8">Audioguida non trovata</div>;
  }

  const recommendedPack = guide.poiCount <= 10 ? "voice_10" : "voice_20";

  const steps = [
    { key: "review", label: "Revisione" },
    { key: "packs", label: "Pacchetti" },
    { key: "payment", label: "Pagamento" },
    { key: "generating", label: "Generazione" },
    { key: "live", label: "Pubblicata" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleSelectPack = (packType: string) => {
    setSelectedPack(packType);
  };

  const handleContinue = () => {
    const stepOrder: Step[] = ["review", "packs", "payment", "generating", "live"];
    const nextIndex = stepOrder.indexOf(currentStep) + 1;
    if (nextIndex < stepOrder.length) {
      const nextStep = stepOrder[nextIndex];
      setCurrentStep(nextStep);

      // Simulate generating step
      if (nextStep === "generating") {
        setTimeout(() => {
          setCurrentStep("live");
        }, 3000);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(guideUrl);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/studio/guides/${id}`}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="size-4" />
          Torna all'editor
        </Link>
        <h1 className="text-3xl font-light text-slate-900 mb-2">Pubblica Audioguida</h1>
        <p className="text-slate-600">{guide.title}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    size-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${
                      index <= currentStepIndex
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                    }
                  `}
                >
                  {index < currentStepIndex ? (
                    <Check className="size-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`
                    text-xs mt-2
                    ${index <= currentStepIndex ? "text-slate-900" : "text-slate-400"}
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-0.5 flex-1 -mt-8 transition-colors
                    ${index < currentStepIndex ? "bg-slate-900" : "bg-slate-300"}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        {currentStep === "review" && (
          <div>
            <h2 className="text-2xl font-light text-slate-900 mb-6">Revisione</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Titolo</label>
                <div className="text-slate-900">{guide.title}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Descrizione</label>
                <div className="text-slate-900">{guide.description}</div>
              </div>
              <div className="flex gap-8">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Punti di Interesse</label>
                  <div className="text-2xl font-light text-slate-900">{guide.poiCount}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Lingue</label>
                  <div className="text-2xl font-light text-slate-900">{guide.languages.length}</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-slate-600">
                  ✓ La tua audioguida è pronta per essere pubblicata. 
                  Dovrai acquistare un pacchetto di generazione vocale per renderla accessibile ai visitatori.
                </p>
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="w-full mt-8 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Continua
            </button>
          </div>
        )}

        {currentStep === "packs" && (
          <div>
            <h2 className="text-2xl font-light text-slate-900 mb-2">Seleziona Pacchetto</h2>
            <p className="text-slate-600 mb-6">
              Scegli il pacchetto adatto per la tua audioguida con {guide.poiCount} POI
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {mockPacks.slice(0, 2).map((pack) => (
                <button
                  key={pack.type}
                  onClick={() => handleSelectPack(pack.type)}
                  className={`
                    p-6 rounded-xl border-2 text-left transition-all
                    ${
                      selectedPack === pack.type
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }
                    ${pack.type === recommendedPack ? "ring-2 ring-slate-900/10" : ""}
                  `}
                >
                  {pack.type === recommendedPack && (
                    <div className="inline-block px-2 py-0.5 bg-slate-900 text-white text-xs rounded mb-3">
                      Consigliato
                    </div>
                  )}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-light text-slate-900">{pack.price}</span>
                    <span className="text-sm text-slate-500">una tantum</span>
                  </div>
                  <div className="font-medium text-slate-900 mb-1">{pack.name}</div>
                  <div className="text-sm text-slate-600">{pack.description}</div>
                </button>
              ))}
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-slate-900 mb-2">Cosa include:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>✓ Generazione vocale professionale con AI</li>
                <li>✓ Audio di alta qualità in italiano</li>
                <li>✓ QR code per accesso visitatori</li>
                <li>✓ Aggiornamenti illimitati dei contenuti</li>
              </ul>
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedPack}
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Procedi al pagamento
            </button>
          </div>
        )}

        {currentStep === "payment" && (
          <div>
            <h2 className="text-2xl font-light text-slate-900 mb-6">Pagamento</h2>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600">Pacchetto selezionato</span>
                <span className="font-medium text-slate-900">
                  {mockPacks.find((p) => p.type === selectedPack)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <span className="text-slate-900">Totale</span>
                <span className="font-medium text-slate-900">
                  {mockPacks.find((p) => p.type === selectedPack)?.price}
                </span>
              </div>
            </div>

            {/* Mock Stripe Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="museo@example.com"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Numero carta</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Scadenza</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Paga {mockPacks.find((p) => p.type === selectedPack)?.price}
            </button>

            <p className="text-xs text-center text-slate-500 mt-4">
              Modalità test Stripe - nessun addebito reale
            </p>
          </div>
        )}

        {currentStep === "generating" && (
          <div className="text-center py-12">
            <Loader2 className="size-16 text-slate-900 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-light text-slate-900 mb-2">Generazione in corso...</h2>
            <p className="text-slate-600">
              Stiamo creando le tracce audio per la tua audioguida.
              Questo può richiedere alcuni minuti.
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Progresso</span>
                <span>75%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-900 rounded-full transition-all duration-1000"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === "live" && (
          <div className="text-center">
            <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="size-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-light text-slate-900 mb-2">Audioguida Pubblicata!</h2>
            <p className="text-slate-600 mb-8">
              La tua audioguida è ora accessibile ai visitatori
            </p>

            {/* QR Code */}
            <div className="bg-slate-50 rounded-xl p-8 inline-block mb-6">
              <canvas ref={canvasRef} className="mx-auto" />
              <p className="text-sm text-slate-600 mt-4">Scansiona per accedere</p>
            </div>

            {/* URL */}
            <div className="max-w-md mx-auto mb-6">
              <label className="block text-sm text-slate-600 mb-2 text-left">Link pubblico</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guideUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-2">
                <Download className="size-5" />
                Scarica QR Code
              </button>
              <Link
                to={`/museo-archeologico/${id}`}
                className="px-6 py-3 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <ExternalLink className="size-5" />
                Visualizza come visitatore
              </Link>
            </div>

            <Link
              to="/studio/guides"
              className="inline-block mt-8 text-slate-600 hover:text-slate-900"
            >
              Torna alle audioguide
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
