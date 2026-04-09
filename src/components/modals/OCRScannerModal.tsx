import { useState, useCallback, useRef, useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useMissionStore } from '@/stores/missionStore';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { processImageFile } from '@/utils/ocr-processor';
import type { OCRResult } from '@/types';

export function OCRScannerModal() {
  const isOpen = useUIStore((s) => s.ocrModalOpen);
  const closeModal = useUIStore((s) => s.closeOCRModal);
  const importOCRMissions = useMissionStore((s) => s.importOCRMissions);

  const ocrOptions = useUIStore((s) => s.ocrOptions);
  const setOCROptions = useUIStore((s) => s.setOCROptions);
  const pendingOCRResult = useUIStore((s) => s.pendingOCRResult);
  const setPendingOCRResult = useUIStore((s) => s.setPendingOCRResult);
  const ocrProcessing = useUIStore((s) => s.ocrProcessing);

  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<OCRResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When opened via clipboard paste, pendingOCRResult arrives after the modal
  // opens (OCR runs async). Watch for it and move it into results.
  useEffect(() => {
    if (pendingOCRResult && isOpen) {
      setResults([pendingOCRResult]);
      setPendingOCRResult(null);
    }
  }, [pendingOCRResult, isOpen, setPendingOCRResult]);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? []);
      setFiles((prev) => [...prev, ...selected]);
    },
    []
  );

  const processImages = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(0);
    setResults([]);

    const newResults: OCRResult[] = [];

    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round((i / files.length) * 100));
      try {
        const result = await processImageFile(files[i], ocrOptions);
        newResults.push(result);
      } catch (err) {
        console.error(`OCR failed for ${files[i].name}:`, err);
        newResults.push({
          filename: files[i].name,
          text: '',
          confidence: 0,
          parsedData: null,
        });
      }
    }

    setResults(newResults);
    setProcessing(false);
    setProgress(100);
  }, [files, ocrOptions]);

  const handleImportAll = useCallback(() => {
    const missions = results
      .filter((r) => r.parsedData && r.parsedData.segments.length > 0)
      .map((r) => ({
        payout: r.parsedData!.payout,
        commodities: r.parsedData!.segments.map((s) => ({
          commodity: s.commodity,
          pickup: s.pickup,
          destination: s.delivery,
          quantity: s.quantity,
        })),
      }));

    if (missions.length > 0) {
      importOCRMissions(missions);
      handleClose();
    }
  }, [results, importOCRMissions]);

  const handleImportSingle = useCallback(
    (result: OCRResult) => {
      if (!result.parsedData || result.parsedData.segments.length === 0) return;
      importOCRMissions([
        {
          payout: result.parsedData.payout,
          commodities: result.parsedData.segments.map((s) => ({
            commodity: s.commodity,
            pickup: s.pickup,
            destination: s.delivery,
            quantity: s.quantity,
          })),
        },
      ]);
    },
    [importOCRMissions]
  );

  const handleClose = useCallback(() => {
    setFiles([]);
    setResults([]);
    setProcessing(false);
    setProgress(0);
    setPendingOCRResult(null);
    closeModal();
  }, [closeModal, setPendingOCRResult]);

  // True when opened via clipboard and still waiting for OCR to finish
  const isClipboardProcessing = ocrProcessing && results.length === 0 && files.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Mission Scanner" size="full">
      <ModalBody>
        <div className="space-y-4">

          {/* Clipboard processing state */}
          {isClipboardProcessing && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-[var(--text-secondary)]">
              <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-primary)] animate-pulse w-full" />
              </div>
              <p className="text-sm">Scanning clipboard image...</p>
            </div>
          )}

          {/* Manual upload area — hidden while processing clipboard paste */}
          {!isClipboardProcessing && results.length === 0 && (
            <>
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors"
              >
                <p className="text-[var(--text-secondary)]">
                  Drag & drop screenshots here, or click to select
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Tip: Press <kbd className="px-1 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs font-mono">Win+Shift+S</kbd> in-game, then <kbd className="px-1 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs font-mono">Ctrl+V</kbd> anywhere to scan instantly
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-60">
                  Supports PNG, JPG, WebP
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[var(--bg-tertiary)] text-xs rounded text-[var(--text-secondary)]"
                    >
                      {f.name}
                    </span>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
                    Clear
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Processing options — always visible so users can adjust before processing */}
          {!isClipboardProcessing && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={ocrOptions.autoCrop}
                  onChange={(e) =>
                    setOCROptions({ ...ocrOptions, autoCrop: e.target.checked })
                  }
                  className="accent-[var(--color-primary)]"
                />
                Auto-crop
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={ocrOptions.enhanceImage}
                  onChange={(e) =>
                    setOCROptions({ ...ocrOptions, enhanceImage: e.target.checked })
                  }
                  className="accent-[var(--color-primary)]"
                />
                Enhance image
              </label>
              <Select
                label="Display Ratio"
                value={ocrOptions.displayRatio}
                onChange={(e) =>
                  setOCROptions({ ...ocrOptions, displayRatio: e.target.value })
                }
              >
                <option value="16:9">16:9</option>
                <option value="16:10">16:10</option>
                <option value="21:9">21:9</option>
                <option value="32:9">32:9</option>
                <option value="4:3">4:3</option>
              </Select>
              <Select
                label="OCR Mode"
                value={String(ocrOptions.ocrMode)}
                onChange={(e) =>
                  setOCROptions({ ...ocrOptions, ocrMode: parseInt(e.target.value, 10) })
                }
              >
                <option value="3">Auto OSD</option>
                <option value="6">Single Block</option>
                <option value="11">Sparse Text</option>
                <option value="4">Single Column</option>
              </Select>
            </div>
          )}

          {/* Process button and progress — manual flow only */}
          {!isClipboardProcessing && results.length === 0 && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={processImages}
                disabled={files.length === 0 || processing}
              >
                {processing ? `Processing... ${progress}%` : 'Process Images'}
              </Button>
            </div>
          )}

          {processing && (
            <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase">
                  Results ({results.length})
                </h3>
                <div className="flex gap-2">
                  {results.length > 1 && (
                    <Button variant="success" onClick={handleImportAll}>
                      Import All ({results.filter((r) => r.parsedData?.segments.length).length})
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setResults([]); setFiles([]); }}
                  >
                    Scan Another
                  </Button>
                </div>
              </div>
              {results.map((result, i) => (
                <ResultCard
                  key={i}
                  result={result}
                  onImport={() => handleImportSingle(result)}
                />
              ))}
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={handleClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function ResultCard({
  result,
  onImport,
}: {
  result: OCRResult;
  onImport: () => void;
}) {
  const [showRaw, setShowRaw] = useState(false);
  const parsed = result.parsedData;

  return (
    <div className="border border-[var(--border-color)] rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {result.filename}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {Math.round(result.confidence)}% confidence
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowRaw(!showRaw)}>
            {showRaw ? 'Hide Raw' : 'Show Raw'}
          </Button>
          {parsed && parsed.segments.length > 0 && (
            <Button variant="success" size="sm" onClick={onImport}>
              Import
            </Button>
          )}
        </div>
      </div>

      {parsed && (
        <div className="text-sm">
          {parsed.payout && (
            <div className="text-[var(--text-highlight)] font-semibold mb-1">
              Payout: {(parsed.payout / 1000).toFixed(2).replace(/\.?0+$/, '')}k
            </div>
          )}
          {parsed.segments.length > 0 ? (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[var(--text-secondary)]">
                  <th className="text-left py-1">Commodity</th>
                  <th className="text-left py-1">Pickup</th>
                  <th className="text-left py-1">Delivery</th>
                  <th className="text-right py-1">SCU</th>
                </tr>
              </thead>
              <tbody>
                {parsed.segments.map((seg, j) => (
                  <tr key={j} className="text-[var(--text-primary)]">
                    <td className="py-0.5">{seg.commodity}</td>
                    <td className="py-0.5">{seg.pickup}</td>
                    <td className="py-0.5">{seg.delivery}</td>
                    <td className="py-0.5 text-right">{seg.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[var(--text-secondary)]">
              No mission data parsed from this image.
            </p>
          )}
        </div>
      )}

      {showRaw && (
        <>
          <pre className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] p-2 rounded overflow-x-auto max-h-40">
            {result.text}
          </pre>
          {result.preprocessedImageUrl && (
            <details className="text-xs text-[var(--text-secondary)]">
              <summary className="cursor-pointer hover:text-[var(--text-primary)]">
                Preprocessed image (what OCR sees)
              </summary>
              <img
                src={result.preprocessedImageUrl}
                alt="Preprocessed"
                className="mt-1 max-h-48 rounded border border-[var(--border-color)]"
              />
            </details>
          )}
        </>
      )}
    </div>
  );
}
