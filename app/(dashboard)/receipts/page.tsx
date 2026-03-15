"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, Sparkles, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import TransactionModal from "@/components/transactions/TransactionModal";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ExtractedData {
  amount: number | null;
  date: string | null;
  description: string | null;
  category: string | null;
  merchant: string | null;
}

export default function ReceiptsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setExtracted(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleScan = async () => {
    if (!file || !preview) return;
    setScanning(true);
    try {
      const base64 = preview.split(",")[1];
      const mimeType = file.type;
      const res = await fetch("/api/ai/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image: base64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      
      setExtracted(data.data);
      toast({ title: "Receipt scanned!", description: "AI extracted the data successfully.", variant: "success" as const });
    } catch (error) {
      toast({ 
        title: "Scan failed", 
        description: error instanceof Error ? error.message : "Could not extract data. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setScanning(false);
    }
  };

  const prefillTransaction = () => {
    if (!extracted) return;
    setShowModal(true);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Upload area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" /> AI Receipt Scanner
          </CardTitle>
          <CardDescription>
            Upload a receipt image and let Gemini AI extract the amount, date, category and description automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
              isDragActive
                ? "border-violet-500 bg-violet-500/10"
                : "border-border hover:border-violet-400 hover:bg-accent/30"
            )}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Receipt preview" className="max-h-48 rounded-lg object-contain shadow-md" />
                <p className="text-sm text-muted-foreground">{file?.name}</p>
                <p className="text-xs text-violet-400">Click or drop to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                  {isDragActive ? (
                    <Upload className="w-8 h-8 text-violet-400 animate-bounce" />
                  ) : (
                    <FileImage className="w-8 h-8 text-violet-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {isDragActive ? "Drop the receipt here" : "Drag & drop receipt image"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse · JPG, PNG, WebP up to 5MB</p>
                </div>
              </div>
            )}
          </div>

          {file && (
            <Button
              onClick={handleScan}
              disabled={scanning}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              {scanning ? (
                <><span className="animate-pulse">🔍</span> Scanning with AI...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Scan Receipt</>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Extracted Results */}
      {extracted && (
        <Card className="border-emerald-500/30 bg-emerald-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" /> Extraction Successful
            </CardTitle>
            <CardDescription>Review the extracted data below and save as a transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  {extracted.amount != null ? formatCurrency(extracted.amount) : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                <p className="text-lg font-semibold text-foreground">
                  {extracted.date ? formatDate(extracted.date) : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Category</p>
                {extracted.category ? (
                  <Badge variant="secondary" className="text-sm">{extracted.category}</Badge>
                ) : <span className="text-sm">—</span>}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Merchant</p>
                <p className="text-sm font-medium">{extracted.merchant || "—"}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Description</p>
                <p className="text-sm">{extracted.description || "—"}</p>
              </div>
            </div>
            <Button onClick={prefillTransaction} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Save as Transaction
            </Button>
          </CardContent>
        </Card>
      )}

      {showModal && extracted && (
        <TransactionModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setFile(null);
            setPreview(null);
            setExtracted(null);
          }}
          editTransaction={{
            _id: "",
            type: "expense",
            amount: extracted.amount || 0,
            category: extracted.category || "Other",
            description: extracted.description || extracted.merchant || "Receipt scan",
            date: extracted.date || new Date().toISOString(),
          }}
        />
      )}
    </div>
  );
}
