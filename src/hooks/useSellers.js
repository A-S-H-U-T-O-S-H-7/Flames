"use client";

import { useState, useEffect } from 'react';
import { getSellers, searchSellers } from '@/lib/firestore/sellers/adminWrite';

export function useSellers({ pageLimit = 10, status = '', searchTerm = '' } = {}) {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [paginationStack, setPaginationStack] = useState([]);

  const fetchSellers = async (resetPagination = false) => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (searchTerm.trim()) {
        result = await searchSellers(searchTerm);
      } else {
        result = await getSellers({
          pageLimit,
          lastDoc: resetPagination ? null : lastDoc,
          status: status || null
        });
      }

      if (result.success) {
        setSellers(result.data);
        if (!searchTerm.trim() && result.lastDoc) {
          setLastDoc(result.lastDoc);
        }
        if (resetPagination) {
          setPaginationStack([]);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers(true);
  }, [pageLimit, status, searchTerm]);

  const nextPage = () => {
    if (lastDoc) {
      setPaginationStack(prev => [...prev, lastDoc]);
      fetchSellers(false);
    }
  };

  const prevPage = () => {
    if (paginationStack.length > 0) {
      const newStack = paginationStack.slice(0, -1);
      const prevLastDoc = newStack[newStack.length - 1] || null;
      setPaginationStack(newStack);
      setLastDoc(prevLastDoc);
      fetchSellers(false);
    }
  };

  const refresh = () => {
    fetchSellers(true);
  };

  return {
    sellers,
    loading,
    error,
    currentPage: paginationStack.length + 1,
    hasNextPage: sellers.length === pageLimit && !searchTerm.trim(),
    hasPrevPage: paginationStack.length > 0,
    nextPage,
    prevPage,
    refresh,
    setPageLimit: (newLimit) => {
      // This would trigger the useEffect
    }
  };
}