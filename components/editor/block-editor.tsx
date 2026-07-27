"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Trash2, Plus } from "@/components/icons";
import { BlockFieldEditor } from "@/components/editor/block-field-editor";
import { createEmptyBlock, blockTypeOrder } from "@/lib/mock/editor";
import type { ContentBlock } from "@/lib/mock/content";
import { useState } from "react";

/**
 * BlockEditor — Phase 11, Module 3 §"Block Editor". يدير مصفوفة
 * `ContentBlock` نفسها (Phase 9.5، مُوسَّعة) — لا تحويل بيانات بين
 * التحرير والعرض؛ الحالة هنا **هي نفسها** ما تعرضه `ContentBody` مباشرة
 * في وضع Preview.
 *
 * BlockEditor — Phase 11, Module 3, "Block Editor" section. Manages the
 * `ContentBlock` array itself (Phase 9.5, extended) — no data
 * transformation between editing and display; the state here **is**
 * exactly what `ContentBody` renders directly in Preview mode.
 */
export function BlockEditor({ blocks, onChange }: { blocks: ContentBlock[]; onChange: (blocks: ContentBlock[]) => void }) {
  const t = useTranslations("admin.editor");
  const tTypes = useTranslations("admin.editor.blockTypes");
  const [pendingType, setPendingType] = useState<ContentBlock["type"]>("paragraph");

  function updateBlock(index: number, block: ContentBlock) {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const next = [...blocks];
    const temp = next[index]!;
    next[index] = next[targetIndex]!;
    next[targetIndex] = temp;
    onChange(next);
  }

  function deleteBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function addBlock() {
    onChange([...blocks, createEmptyBlock(pendingType)]);
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-foreground">{t("blocksTitle")}</p>

      {blocks.length === 0 && <p className="mb-4 text-sm text-muted-foreground">{t("emptyBlocks")}</p>}

      <div className="flex flex-col gap-3">
        {blocks.map((block, index) => (
          <Card key={index} className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{tTypes(block.type)}</span>
              <div className="flex items-center gap-1">
                <IconButton aria-label={t("moveUp")} variant="ghost" size="sm" disabled={index === 0} onClick={() => moveBlock(index, -1)}>
                  <ChevronUp className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton aria-label={t("moveDown")} variant="ghost" size="sm" disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)}>
                  <ChevronDown className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton aria-label={t("deleteBlock")} variant="ghost" size="sm" onClick={() => deleteBlock(index)}>
                  <Trash2 className="size-4" aria-hidden="true" />
                </IconButton>
              </div>
            </div>
            <BlockFieldEditor block={block} onChange={(updated) => updateBlock(index, updated)} />
          </Card>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Select value={pendingType} onValueChange={(v) => setPendingType(v as ContentBlock["type"])}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {blockTypeOrder.map((type) => (
              <SelectItem key={type} value={type}>
                {tTypes(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={addBlock}>
          <Plus className="size-4" aria-hidden="true" />
          {t("addBlock")}
        </Button>
      </div>
    </div>
  );
}
