"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { X } from "@/components/icons";
import { AutosaveIndicator, type AutosaveState } from "@/components/editor/autosave-indicator";
import { WorkflowBar } from "@/components/editor/workflow-bar";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { BlockEditor } from "@/components/editor/block-editor";
import { ContentPreview } from "@/components/editor/content-preview";
import { useToast } from "@/hooks/use-toast";
import { loadEditableDraft, draftToPreviewItem, type EditableDraft } from "@/lib/mock/editor";
import type { ContentItem } from "@/lib/mock/content";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";

const AUTOSAVE_SIMULATION_DELAY_MS = 700;

/**
 * EditorShell — Phase 11, Module 3. **مُعامَل بعنصر `ContentItem` واحد
 * فقط** — لا فرع شرطي على `item.kind` في أي مكان داخل هذا الملف. نفس
 * هذا المكوّن يحرِّر مقالة أو فتوى أو كتابًا أو درسًا أو خبرًا بلا أي
 * تمييز، محقِّقًا معيار نجاح هذه الوحدة حرفيًا.
 *
 * EditorShell — Phase 11, Module 3. **Parameterized by a single
 * `ContentItem` only** — no conditional branching on `item.kind`
 * anywhere in this file. The exact same component edits an article,
 * fatwa, book, lesson, or news item with no distinction, fulfilling
 * this module's success criterion literally.
 */
export function EditorShell({ item }: { item: ContentItem }) {
  const t = useTranslations("admin.editor");
  const tStatus = useTranslations("admin.status");
  const tActions = useTranslations("admin.dataTable.actions");
  const { toast } = useToast();

  const [draft, setDraft] = useState<EditableDraft>(() => loadEditableDraft(item));
  const [tagInput, setTagInput] = useState("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [autosaveState, setAutosaveState] = useState<AutosaveState>("saved");
  const isFirstRender = useRef(true);

  function patchDraft(patch: Partial<EditableDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  // مؤشر Auto Save شكلي بحت — Phase 11 §"Auto Save". يتفاعل مع أي تغيّر
  // في حالة المحرر محليًا، بلا أي طلب شبكة أو حفظ فعلي.
  // Purely cosmetic Auto Save indicator — Phase 11, "Auto Save" section.
  // Reacts to any local editor state change, with no network request or
  // real save.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const unsavedId = setTimeout(() => setAutosaveState("unsaved"), 0);
    const savingId = setTimeout(() => setAutosaveState("saving"), 400);
    const savedId = setTimeout(() => setAutosaveState("saved"), AUTOSAVE_SIMULATION_DELAY_MS);
    return () => {
      clearTimeout(unsavedId);
      clearTimeout(savingId);
      clearTimeout(savedId);
    };
  }, [draft]);

  function addTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !tagInput.trim()) return;
    e.preventDefault();
    if (!draft.tags.includes(tagInput.trim())) patchDraft({ tags: [...draft.tags, tagInput.trim()] });
    setTagInput("");
  }

  function removeTag(tag: string) {
    patchDraft({ tags: draft.tags.filter((t2) => t2 !== tag) });
  }

  function handleWorkflowChange(status: ContentLifecycleStatus) {
    patchDraft({ status });
    toast({ description: tActions("statusChanged", { status: tStatus(status) }), variant: "success" });
  }

  const previewItem = draftToPreviewItem(item, draft);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <Link href="/admin/content/articles" className="text-sm text-muted-foreground hover:text-foreground">
          ← {t("backToList")}
        </Link>
        <div className="flex items-center gap-3">
          <AutosaveIndicator state={autosaveState} />
          <Tabs value={mode} onValueChange={(v) => setMode(v as "edit" | "preview")}>
            <TabsList>
              <TabsTrigger value="edit">{t("mode.edit")}</TabsTrigger>
              <TabsTrigger value="preview">{t("mode.preview")}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast({ description: t("saveDraftNotice") })}
          >
            {t("saveDraft")}
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <WorkflowBar status={draft.status} onChange={handleWorkflowChange} />
      </div>

      {mode === "preview" ? (
        <ContentPreview item={previewItem} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div>
              <Input
                aria-label={t("titlePlaceholder")}
                placeholder={t("titlePlaceholder")}
                value={draft.title}
                onChange={(e) => patchDraft({ title: e.target.value })}
                className="h-auto border-none px-0 text-2xl font-bold shadow-none focus-visible:ring-0"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">{t("excerptLabel")}</Label>
              <Textarea id="excerpt" placeholder={t("excerptPlaceholder")} value={draft.excerpt} onChange={(e) => patchDraft({ excerpt: e.target.value })} className="mt-1.5" rows={2} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="category">{t("categoryLabel")}</Label>
                <Input id="category" value={draft.category} onChange={(e) => patchDraft({ category: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="author">{t("authorLabel")}</Label>
                <Input id="author" value={draft.authorName} onChange={(e) => patchDraft({ authorName: e.target.value })} className="mt-1.5" />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">{t("tagsLabel")}</Label>
              <Input id="tags" placeholder={t("tagsPlaceholder")} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} className="mt-1.5" />
              {draft.tags.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {draft.tags.map((tag) => (
                    <li key={tag}>
                      <Badge variant="neutral" className="inline-flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} aria-label={tag} className="hover:text-destructive">
                          <X className="size-3" aria-hidden="true" />
                        </button>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <BlockEditor blocks={draft.blocks} onChange={(blocks) => patchDraft({ blocks })} />
          </div>

          <EditorSidebar draft={draft} onChange={patchDraft} />
        </div>
      )}
    </div>
  );
}
