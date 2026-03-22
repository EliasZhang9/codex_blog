import { useEffect, useState, useCallback } from "react";
import api from "../api/client";

export default function useWeightEntries(enabled = true) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEntries = useCallback(async () => {
    setError(null);
    const { data } = await api.get("/weights/me");
    setEntries(data);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    async function fetchData() {
      try {
        await loadEntries();
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [enabled, loadEntries]);

  return { entries, setEntries, loading, error, reload: loadEntries };
}
