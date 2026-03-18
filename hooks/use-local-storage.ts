"use client";

import { useEffect, useState } from "react";
import { readFromStorage, writeToStorage } from "../lib/storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = readFromStorage<T>(key, initialValue);
    setValue(stored);
    setIsReady(true);
  }, [key, initialValue]);

  useEffect(() => {
    if (!isReady) return;
    writeToStorage(key, value);
  }, [isReady, key, value]);

  return { value, setValue, isReady };
}