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

      const res = await fetch("/api/upload/comprobante", {
        method: "POST",
        body: formData,
      });

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
        <button onClick={onBack} className="btn-secondary">
          Volver
        </button>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="text-center py-6">
        <p className="text-stone-500">Cargando código QR...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-stone-900 mb-1">
          Pago con De Una! — Banco Pichincha
        </h3>
        <p className="text-sm text-stone-500">
          Escanea el código QR con tu app de Banco Pichincha para completar el pago
        </p>
      </div>

      <div className="card p-6 flex flex-col items-center">
        <div className="bg-white p-4 rounded-xl border-2 border-stone-200 mb-4">
          <img
            src={qrData.qrImage}
            alt="Código QR De Una! - Banco Pichincha"
            className="w-56 h-56 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML =
                  '<div class="w-56 h-56 flex items-center justify-center bg-stone-100 rounded-lg text-center text-stone-500 text-sm p-4">Código QR no disponible<br/><br/>Coloca la imagen en:<br/><code>/public/qr-deuna.svg</code></div>';
              }
            }}
          />
        </div>

        <div className="text-center space-y-2 w-full">
          <p className="font-semibold text-stone-900">{qrData.accountName}</p>
          {qrData.accountId && (
            <p className="text-sm text-stone-600">
              Cuenta: {qrData.accountId}
            </p>
          )}
          {qrData.phone && (
            <p className="text-sm text-stone-600">
              Teléfono: {qrData.phone}
            </p>
          )}
          {qrData.amount > 0 && (
            <p className="text-lg font-bold text-violet-700">
              ${qrData.amount.toFixed(2)}
            </p>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 w-full">
          <p className="text-sm text-amber-800 font-medium mb-2">
            Instrucciones:
          </p>
          <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
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
          <p className="label-field">Comprobante de pago *</p>
          <p className="text-xs text-stone-500 mb-2">
            Sube una captura de pantalla del comprobante de pago de De Una!
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {!comprobanteFile ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full p-6 border-2 border-dashed border-stone-300 rounded-xl hover:border-violet-400 hover:bg-violet-50/50 transition-colors text-center"
            >
              <span className="text-3xl block mb-2">📎</span>
              <span className="text-sm text-stone-600 font-medium">
                Haz clic para subir tu comprobante
              </span>
              <span className="text-xs text-stone-400 block mt-1">
                JPG, PNG, WEBP o PDF (máx. 5 MB)
              </span>
            </button>
          ) : (
            <div className="border border-stone-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Vista previa del comprobante"
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  ) : (
                    <span className="text-2xl">📄</span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-stone-900 truncate max-w-[180px]">
                      {comprobanteFile.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {(comprobanteFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setComprobanteFile(null);
                    setPreviewUrl(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {uploadError}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onBack} className="btn-secondary" disabled={loading || uploading}>
            Volver
          </button>
          <button
            onClick={handleConfirm}
            className="btn-primary flex-1"
            disabled={!comprobanteFile || loading || uploading}
          >
            {uploading
              ? "Subiendo comprobante..."
              : loading
                ? "Creando reserva..."
                : "Confirmar reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}
