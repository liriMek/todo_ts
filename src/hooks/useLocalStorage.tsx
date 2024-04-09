import { Dispatch, SetStateAction, useEffect, useState } from "react";

function getStorageValue<TData>(key: string, defaultValue: TData) {
  const saved = localStorage.getItem(key);
  const parsedInitialValue = saved && JSON.parse(saved);
  return parsedInitialValue || defaultValue;
}

export function useLocalStorage<TData>(key: string, defaultValue: TData): [TData, Dispatch<SetStateAction<TData>>] {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
