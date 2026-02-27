import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const { immediate = true, params = {} } = options;

  const fetchData = useCallback(
    async (overrideParams = {}) => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get(url, {
          params: { ...params, ...overrideParams },
        });
        setData(res.data.data);
        if (res.data.pagination) setPagination(res.data.pagination);
        return res.data;
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    if (immediate) fetchData();
  }, [url]);

  return { data, loading, error, pagination, refetch: fetchData };
}

export function useMutation() {
  const [loading, setLoading] = useState(false);

  const mutate = async (method, url, data = null, config = {}) => {
    try {
      setLoading(true);
      const res = await API[method](url, data, config);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading };
}