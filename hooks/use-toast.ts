"use client";

// نمط إدارة حالة قياسي (متجر خارج React، مبسَّط) لاستدعاء Toast
// برمجيًا من أي مكان (toast({ title, description })) دون Context إضافي.
// A standard state-management pattern (simplified external store) for
// calling Toast programmatically from anywhere (toast({ title,
// description })) without extra Context wiring.

import { useEffect, useState } from "react";

import type { ToastActionElement } from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

export interface ToasterToast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error";
  action?: ToastActionElement;
}

type Listener = (toasts: ToasterToast[]) => void;

let memoryState: ToasterToast[] = [];
const listeners: Listener[] = [];

function emit() {
  listeners.forEach((listener) => listener(memoryState));
}

function dismiss(id: string) {
  memoryState = memoryState.filter((t) => t.id !== id);
  emit();
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = crypto.randomUUID();
  memoryState = [{ id, ...props }, ...memoryState].slice(0, TOAST_LIMIT);
  emit();
  setTimeout(() => dismiss(id), TOAST_REMOVE_DELAY);
  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>(memoryState);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { toasts, toast, dismiss };
}
