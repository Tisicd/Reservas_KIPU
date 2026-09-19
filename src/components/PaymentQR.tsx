"use client";

import { useState, useEffect, useRef } from "react";

interface PichinchaQRData {
  qrImage: string;
  accountName: string;
  accountId: string;
  phone: string;
  amount: number;
}

interface Props {
  eventoTitle: string;
  onConfirm: (comprobanteUrl: string) => void;
  onBack: () => void;
  loading: boolean;
}

export default function PaymentQR({ eventoTitle, onConfirm, onBack, loading }: Props) {
  const [qrData, setQrData] = useState<PichinchaQRData | null>(null);
  const [qrError, setQrError] = useState("");
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/payment/qr-config")
      .then((r) => {
        if (!r.ok) throw new Error("Error de configuración");
        return r.json();
      })
      .then(setQrData)
      .catch(() => setQrError("No se pudo cargar el código QR"));
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Formato no permitido. Usa JPG, PNG, WEBP o PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("El archivo no debe superar 5 MB.");
      return;
    }

    setComprobanteFile(file);
    if (file.type !== "application/pdf") {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  async function handleConfirm() {
    if (!comprobanteFile) {
      setUploadError("Debes subir el comprobante de pago.");
      return;
    }
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("comprobante", comprobanteFile);
      const res = await fetch("/api/upload/comprobante", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir comprobante");
      onConfirm(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Error al subir el comprobante");
    } finally {
      setUploading(false);
    }
  }

  if (qrError) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600 text-sm mb-4">{qrError}</p>
        <button onClick={onBack} className="btn-ghost">Volver</button>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="text-center py-10">
        <div className="animate-pulse-subtle text-warm-400 text-sm">Cargando código QR...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary-50 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><rect x="7" y="7" width="10" height="10" /><line x1="12" y1="3" x2="12" y2="7" /><line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-warm-900 mb-1">
          De Una! — Banco Pichincha
        </h3>
        <p className="text-sm text-warm-500">
          Escanea el QR y sube tu comprobante para completar la reserva
        </p>
      </div>

      <div className="bg-white rounded-xl border border-warm-200 p-6 flex flex-col items-center">
        <div className="bg-warm-50 p-4 rounded-xl border border-warm-200 mb-4">
          <img
            src={qrData.qrImage}
            alt="Código QR De Una!"
            className="w-52 h-52 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML =
                  '<div class="w-52 h-52 flex items-center justify-center bg-warm-100 rounded-lg text-center text-warm-400 text-sm p-4">QR no disponible<br/><br/>Coloca tu imagen en<br/><code>/public/qr-deuna.svg</code></div>';
              }
            }}
          />
        </div>

        <div className="text-center space-y-1 w-full">
          <p className="font-semibold text-warm-800">{qrData.accountName}</p>
          {qrData.accountId && <p className="text-sm text-warm-500">Cuenta: {qrData.accountId}</p>}
          {qrData.phone && <p className="text-sm text-warm-500">Tel: {qrData.phone}</p>}
          {qrData.amount > 0 && (
            <p className="text-xl font-bold text-primary-600 font-display mt-2">
              ${qrData.amount.toFixed(2)}
            </p>
          )}
        </div>

        <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mt-5 w-full">
          <p className="text-sm text-gold-700 font-semibold mb-2">Instrucciones</p>
          <ol className="text-sm text-gold-700 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Abre tu app de Banco Pichincha</li>
            <li>Selecciona &quot;De Una!&quot; o &quot;Pagos QR&quot;</li>
            <li>Escanea el código QR mostrado</li>
            <li>Confirma el monto y realiza el pago</li>
            <li>Toma una captura del comprobante</li>
            <li>Súbela aquí abajo y confirma tu reserva</li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="label-field">Comprobante de pago <span className="text-primary-500">*</span></p>
          <p className="text-xs text-warm-400 mb-2">Sube una captura de pantalla del comprobante.</p>

          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleFileChange} className="hidden" />

          {!comprobanteFile ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full p-8 border-2 border-dashed border-warm-200 rounded-xl hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 text-center group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-warm-50 group-hover:bg-primary-50 flex items-center justify-center transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17,8 12,3 7,8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <span className="text-sm text-warm-600 font-medium">Haz clic para subir tu comprobante</span>
              <span className="text-xs text-warm-400 block mt-1">JPG, PNG, WEBP o PDF (máx. 5 MB)</span>
            </button>
          ) : (
            <div className="border border-primary-200 bg-primary-50/30 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-warm-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-warm-100 flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-warm-800 truncate max-w-[160px]">{comprobanteFile.name}</p>
                    <p className="text-xs text-warm-400">{(comprobanteFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setComprobanteFile(null); setPreviewUrl(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                  disabled={uploading || loading}
                >
                  Quitar
                </button>
              </div>
            </div>
          )}
        </div>

        {uploadError && (
          <div className="bg-error-50 border border-red-200 text-error-500 px-4 py-3 rounded-xl text-sm">
            {uploadError}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onBack} className="btn-ghost" disabled={loading || uploading}>Volver</button>
          <button onClick={handleConfirm} className="btn-primary flex-1" disabled={!comprobanteFile || loading || uploading}>
            {uploading ? "Subiendo comprobante..." : loading ? "Creando reserva..." : "Confirmar reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}
