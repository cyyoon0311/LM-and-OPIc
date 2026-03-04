import { useState, useEffect } from "react";
import { fetchSentences, type OPIcSentence } from "../services/notionApi";

interface UseNotionSentencesOptions {
  topic?: string;
  level?: string;
}

export function useNotionSentences(options?: UseNotionSentencesOptions) {
  const [sentences, setSentences] = useState<OPIcSentence[]>([]);
  const [rawSample, setRawSample] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSentences({ topic: options?.topic, level: options?.level })
      .then((res) => {
        if (cancelled) return;
        setSentences(res.data);
        setRawSample(res._raw_sample);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [options?.topic, options?.level]);

  return { sentences, rawSample, loading, error };
}
