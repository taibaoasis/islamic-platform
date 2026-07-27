"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Save } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

/** SettingsSaveButton — نفس السلوك حرفيًا في السبعة أقسام: Toast محلي فقط، بلا أي حفظ حقيقي. Identical behavior across all seven sections: a local toast only, no real save. */
export function SettingsSaveButton() {
  const t = useTranslations("admin.settings");
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({ description: t("saveNotice"), variant: "success" })}>
      <Save className="size-4" aria-hidden="true" />
      {t("saveChanges")}
    </Button>
  );
}
