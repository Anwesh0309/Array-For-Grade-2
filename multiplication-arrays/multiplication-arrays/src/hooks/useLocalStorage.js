import { useState, useEffect } from 'react';

const SESSION_KEY = 'intellia_g2_mult_arrays_v1';

export function useLocalStorage() {
  const save = (data) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
    } catch {}
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > 86400000) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const clear = () => {
    try { localStorage.removeItem(SESSION_KEY); } catch {}
  };

  return { save, load, clear };
}
