import { useState } from "react";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { mockDocuments } from "../../data/mockData";

export function DocumentsManager() {
  const [documents] = useState(mockDocuments);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-900 mb-2">Knowledge Base</h1>
        <p className="text-slate-600">
          Carica documenti per alimentare la knowledge base AI
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
          <Upload className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Carica documenti
          </h3>
          <p className="text-slate-600 mb-4">
            Trascina qui i file oppure clicca per selezionarli
          </p>
          <p className="text-sm text-slate-500">
            PDF, Word, TXT fino a 10MB ciascuno
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-slate-50 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="size-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            💡
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-1">Come funziona</h3>
            <p className="text-sm text-slate-600">
              I documenti caricati vengono analizzati e indicizzati. 
              Quando generi contenuti per un POI con l'AI, il sistema cercherà 
              informazioni rilevanti nei tuoi documenti per creare descrizioni accurate e contestualizzate.
            </p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">
            Documenti caricati ({documents.length})
          </h2>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="size-12 mx-auto mb-3 text-slate-300" />
            <p>Nessun documento caricato</p>
            <p className="text-sm mt-1">Carica il primo documento per iniziare</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="size-6 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate mb-1">
                      {doc.filename}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Caricato il {doc.uploadedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                      <Download className="size-5" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-red-600 transition-colors">
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supported Formats */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-slate-900 mb-3">Formati supportati</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["PDF", "Word (.docx)", "Text (.txt)", "Markdown (.md)"].map((format) => (
            <div
              key={format}
              className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 text-center"
            >
              {format}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}