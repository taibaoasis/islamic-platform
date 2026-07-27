"use client";

import { useState, type DragEvent } from "react";
import { useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, CheckCircle2, FileX, RotateCcw } from "@/components/icons";
import { cn } from "@/lib/utils";

type UploadPhase = "idle" | "uploading" | "success" | "failed";
const MOCK_UPLOAD_STEP_MS = 220;

/**
 * MediaUploadDialog — Phase 11, Module 4 §"Upload Area". **بلا رفع
 * فعلي إطلاقًا** — "المحاكاة" تُقدِّم شريط تقدُّم عبر `setInterval`
 * محلي بحت، بلا أي `fetch`/`FormData`/خدمة تخزين. حالة "فشل" تُحاكى
 * عشوائيًا (٪20 من المحاولات) لإثبات واجهة الفشل/إعادة المحاولة
 * فعليًا، لا فقط تصميمها نظريًا.
 *
 * MediaUploadDialog — Phase 11, Module 4, "Upload Area" section. **No
 * real upload whatsoever** — the "simulation" drives a progress bar via
 * a purely local `setInterval`, with no `fetch`/`FormData`/storage
 * service involved. The "failed" state is randomly simulated (~20% of
 * attempts) to actually exercise the failure/retry UI, not just design
 * it theoretically.
 */
export function MediaUploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations("admin.media.upload");
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  function startSimulatedUpload(name: string) {
    setFileName(name);
    setPhase("uploading");
    setProgress(0);
    const id = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(id);
          const willFail = Math.random() < 0.2;
          setTimeout(() => setPhase(willFail ? "failed" : "success"), 0);
          return 100;
        }
        return next;
      });
    }, MOCK_UPLOAD_STEP_MS);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    startSimulatedUpload(file?.name ?? "ملف-تجريبي.jpg");
  }

  function reset() {
    setPhase("idle");
    setProgress(0);
    setFileName(null);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {phase === "idle" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center gap-2 rounded-[var(--radius)] border-2 border-dashed p-10 text-center transition-colors",
              isDragOver ? "border-primary bg-primary/5" : "border-border"
            )}
          >
            <UploadCloud className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">{t("dragDrop")}</p>
            <p className="text-xs text-muted-foreground">{t("browseFiles")}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => startSimulatedUpload("ملف-تجريبي.jpg")}>
              {t("simulateUpload")}
            </Button>
          </div>
        )}

        {phase === "uploading" && (
          <div className="space-y-3 p-4">
            <p className="truncate text-sm text-foreground">{fileName}</p>
            <Progress value={progress} aria-label={t("uploading")} />
            <p className="text-xs text-muted-foreground">{t("uploading")} — {progress}%</p>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
            <p className="text-sm text-foreground">{t("success")}</p>
          </div>
        )}

        {phase === "failed" && (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <FileX className="size-8 text-destructive" aria-hidden="true" />
            <p className="text-sm text-foreground">{t("failed")}</p>
          </div>
        )}

        <DialogFooter>
          {phase === "uploading" && (
            <Button variant="outline" size="sm" onClick={reset}>
              {t("cancel")}
            </Button>
          )}
          {phase === "failed" && (
            <Button variant="outline" size="sm" onClick={() => startSimulatedUpload(fileName ?? "ملف-تجريبي.jpg")}>
              <RotateCcw className="size-4" aria-hidden="true" />
              {t("retry")}
            </Button>
          )}
          {(phase === "success" || phase === "failed") && (
            <Button size="sm" onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
