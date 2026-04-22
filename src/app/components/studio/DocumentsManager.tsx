import { useState } from "react";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { mockDocuments } from "../../data/mockData";
import { PageShell } from "./PageShell";

export function DocumentsManager() {
  const [documents] = useState(mockDocuments);

  return (
    <PageShell><div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-900 mb-2">Knowledge Base</h1>
        <p className="text-slate-600">
          Upload documents to power the AI knowledge base
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
          <Upload className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Upload documents
          </h3>
          <p className="text-slate-600 mb-4">
            Drag and drop files here or click to select
          </p>
          <p className="text-sm text-slate-500">
            PDF, Word, TXT up to 10MB each
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
            <h3 className="font-medium text-slate-900 mb-1">How it works</h3>
            <p className="text-sm text-slate-600">
              Uploaded documents are analyzed and indexed.
              When you generate content for a POI with AI, the system will search
              for relevant information in your documents to create accurate, contextualised descriptions.
            </p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">
            Uploaded documents ({documents.length})
          </h2>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="size-12 mx-auto mb-3 text-slate-300" />
            <p>No documents uploaded</p>
            <p className="text-sm mt-1">Upload your first document to get started</p>
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
                      <span>Uploaded on {doc.uploadedAt}</span>
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
        <h3 className="text-sm font-medium text-slate-900 mb-3">Supported formats</h3>
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
    </div></PageShell>
  );
}