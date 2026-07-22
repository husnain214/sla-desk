"use client";

import { useState, useEffect } from "react";

type SavedFilter = {
  id: string;
  name: string;
  query: string;
};

const STORAGE_KEY = "sla-desk:saved-filters";

export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setSavedFilters(JSON.parse(raw));
  }, []);

  function saveFilter(name: string, query: string) {
    const next = [...savedFilters, { id: crypto.randomUUID(), name, query }];
    setSavedFilters(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function deleteFilter(id: string) {
    const next = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return { savedFilters, saveFilter, deleteFilter };
}
