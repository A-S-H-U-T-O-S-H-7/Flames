"use client";
import { db } from "../firebase";
import { 
  collection, 
  doc, 
  query, 
  where, 
  limit, 
  startAfter, 
  onSnapshot,
  getDocs,
  orderBy,
  getCountFromServer 
} from "firebase/firestore";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";

// Helper function to extract seller ID from admin data
const getSellerIdFromAdmin = (adminData) => {
  return adminData?.sellerId || null;
};

export function useProducts({ 
  pageLimit, 
  lastSnapDoc, 
  filters = {}, 
  searchTerm = "", 
  sellerId = null, 
  isAdmin = false 
} = {}) {
  const { data, error } = useSWRSubscription(
    ["products", pageLimit, lastSnapDoc, filters, searchTerm, sellerId, isAdmin],
    ([path, pageLimit, lastSnapDoc, filters, searchTerm, sellerId, isAdmin], { next }) => {
      console.log('useProducts hook called with:', { 
        pageLimit, 
        filters, 
        searchTerm, 
        sellerId, 
        isAdmin 
      });
      
      // 🚨 EARLY RETURN: Don't query if no sellerId for sellers
      if (!isAdmin && !sellerId) {
        console.log('🛑 No sellerId provided for seller query - returning empty');
        next(null, { list: [], lastSnapDoc: null });
        return () => {};
      }
      
      const ref = collection(db, path);
      let q = query(ref);

      // Apply seller filter if user is a seller (not admin)
      if (!isAdmin && sellerId) {
        console.log('🔍 Applying seller filter:', sellerId);
        q = query(q, where('sellerId', '==', sellerId));
      }

      // Apply admin seller filter if admin wants to see specific seller's products
      if (isAdmin && filters.sellerId) {
        q = query(q, where('sellerId', '==', filters.sellerId));
      }

      // Apply database-level filters
      if (filters.categoryId) {
        console.log('Applying category filter:', filters.categoryId);
        q = query(q, where('categoryId', '==', filters.categoryId));
      }
      
      if (filters.brandId) {
        q = query(q, where('brandId', '==', filters.brandId));
      }
      
      if (filters.featured === 'featured') {
        q = query(q, where('isFeatured', '==', true));
      } else if (filters.featured === 'notFeatured') {
        q = query(q, where('isFeatured', '==', false));
      }
      
      if (filters.newArrival === 'newArrival') {
        q = query(q, where('isNewArrival', '==', true));
      } else if (filters.newArrival === 'notNewArrival') {
        q = query(q, where('isNewArrival', '==', false));
      }
      
      if (filters.color) {
        q = query(q, where('color', '==', filters.color));
      }
      
      if (filters.occasion) {
        q = query(q, where('occasion', '==', filters.occasion));
      }

      // 🚨 CRITICAL: Add ORDER BY clause for all queries
      // This is required when using where + limit in Firestore
      q = query(q, orderBy("timestampCreate", "desc"));

      // Add pagination
      q = query(q, limit(pageLimit ?? 10));
      
      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }

      console.log('🔍 Final Firestore query built');

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          console.log('📦 Firestore snapshot received:', snapshot.docs.length, 'documents');
          
          let products = snapshot.docs.length === 0 
            ? [] 
            : snapshot.docs.map((snap) => ({ 
                id: snap.id, 
                ...snap.data(),
                // Ensure timestamp is properly handled
                timestampCreate: snap.data().timestampCreate?.toDate?.() || snap.data().timestampCreate,
                timestampUpdate: snap.data().timestampUpdate?.toDate?.() || snap.data().timestampUpdate
              }));
          
          console.log('📦 Products after mapping:', products.length);

          // Apply client-side filters that can't be done with Firestore
          if (searchTerm?.trim()) {
            const lowercasedSearch = searchTerm.toLowerCase().trim();
            products = products.filter(item => 
              item?.title?.toLowerCase().includes(lowercasedSearch) ||
              item?.sku?.toLowerCase().includes(lowercasedSearch) ||
              item?.sellerSku?.toLowerCase().includes(lowercasedSearch)
            );
            console.log('🔍 After search filter:', products.length);
          }
          
          // Apply status filter (requires calculation)
          if (filters.status) {
            if (filters.status === 'available') {
              products = products.filter(item => (item?.stock - (item?.orders ?? 0)) > 0);
            } else if (filters.status === 'outOfStock') {
              products = products.filter(item => (item?.stock - (item?.orders ?? 0)) <= 0);
            }
            console.log('🔍 After status filter:', products.length);
          }
          
          // Apply price range filter
          if (filters.priceRange?.min && !isNaN(parseFloat(filters.priceRange.min))) {
            products = products.filter(item => 
              (item?.salePrice || item?.price) >= parseFloat(filters.priceRange.min)
            );
          }
          if (filters.priceRange?.max && !isNaN(parseFloat(filters.priceRange.max))) {
            products = products.filter(item => 
              (item?.salePrice || item?.price) <= parseFloat(filters.priceRange.max)
            );
          }
          
          // Apply stock filter
          if (filters.stock?.min && !isNaN(parseInt(filters.stock.min))) {
            products = products.filter(item => (item?.stock || 0) >= parseInt(filters.stock.min));
          }
          if (filters.stock?.max && !isNaN(parseInt(filters.stock.max))) {
            products = products.filter(item => (item?.stock || 0) <= parseInt(filters.stock.max));
          }

          console.log('📦 Final products count:', products.length);
          
          next(null, {
            list: products,
            lastSnapDoc: snapshot.docs.length === 0 
              ? null 
              : snapshot.docs[snapshot.docs.length - 1],
          });
        },
        (err) => {
          console.error('🔥 Firestore error:', err);
          next(err, null);
        }
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list || [],
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: !data && !error,
  };
}

// Hook to get total count of products with filters
export function useProductsCount({ 
  filters = {}, 
  searchTerm = "", 
  sellerId = null, 
  isAdmin = false 
} = {}) {
  const fetcher = async ([path, filters, searchTerm, sellerId, isAdmin]) => {
    const ref = collection(db, path);
    let q = query(ref);

    // Apply seller filter if user is a seller (not admin)
    if (!isAdmin && sellerId) {
      q = query(q, where('sellerId', '==', sellerId));
    }

    // Apply admin seller filter if admin has selected a specific seller
    if (isAdmin && filters.sellerId) {
      q = query(q, where('sellerId', '==', filters.sellerId));
    }

    // Apply category filter
    if (filters.categoryId) {
      q = query(q, where('categoryId', '==', filters.categoryId));
    }

    // Apply brand filter
    if (filters.brandId) {
      q = query(q, where('brandId', '==', filters.brandId));
    }

    // Apply featured filter
    if (filters.featured === 'featured') {
      q = query(q, where('isFeatured', '==', true));
    } else if (filters.featured === 'notFeatured') {
      q = query(q, where('isFeatured', '==', false));
    }

    // Apply new arrival filter
    if (filters.newArrival === 'newArrival') {
      q = query(q, where('isNewArrival', '==', true));
    } else if (filters.newArrival === 'notNewArrival') {
      q = query(q, where('isNewArrival', '==', false));
    }

    // Apply color filter
    if (filters.color) {
      q = query(q, where('color', '==', filters.color));
    }

    // Apply occasion filter
    if (filters.occasion) {
      q = query(q, where('occasion', '==', filters.occasion));
    }

    // For complex filters that can't be done server-side, fetch all and filter
    const hasComplexFilters = searchTerm || 
      filters.status || 
      filters.priceRange?.min || 
      filters.priceRange?.max || 
      filters.stock?.min || 
      filters.stock?.max;

    if (hasComplexFilters) {
      const snapshot = await getDocs(q);
      let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Apply client-side filters
      if (searchTerm?.trim()) {
        const lowercasedSearch = searchTerm.toLowerCase().trim();
        products = products.filter(item => 
          item?.title?.toLowerCase().includes(lowercasedSearch)
        );
      }
      
      if (filters.status === 'available') {
        products = products.filter(item => (item?.stock - (item?.orders ?? 0)) > 0);
      } else if (filters.status === 'outOfStock') {
        products = products.filter(item => (item?.stock - (item?.orders ?? 0)) <= 0);
      }
      
      if (filters.priceRange?.min && !isNaN(parseFloat(filters.priceRange.min))) {
        products = products.filter(item => 
          (item?.salePrice || item?.price) >= parseFloat(filters.priceRange.min)
        );
      }
      if (filters.priceRange?.max && !isNaN(parseFloat(filters.priceRange.max))) {
        products = products.filter(item => 
          (item?.salePrice || item?.price) <= parseFloat(filters.priceRange.max)
        );
      }
      
      if (filters.stock?.min && !isNaN(parseInt(filters.stock.min))) {
        products = products.filter(item => (item?.stock || 0) >= parseInt(filters.stock.min));
      }
      if (filters.stock?.max && !isNaN(parseInt(filters.stock.max))) {
        products = products.filter(item => (item?.stock || 0) <= parseInt(filters.stock.max));
      }
      
      return products.length;
    } else {
      // Use Firestore count aggregation for better performance
      const countSnapshot = await getCountFromServer(q);
      return countSnapshot.data().count;
    }
  };

  const { data, error, isLoading } = useSWR(
    ["products", filters, searchTerm, sellerId, isAdmin],
    fetcher
  );

  return {
    count: data || 0,
    error: error?.message,
    isLoading,
  };
}

// Hook to get a single product by ID
export function useProduct({ productId, sellerId = null, isAdmin = false } = {}) {
  const { data, error } = useSWRSubscription(
    ["product", productId, sellerId, isAdmin],
    ([path, productId, sellerId, isAdmin], { next }) => {
      console.log('📖 Firestore Read Debug:')
      console.log('Seller ID in query:', sellerId)
      console.log('Is Admin:', isAdmin)
      if (!productId) {
        next(null, null);
        return () => {};
      }

      const ref = doc(db, `products/${productId}`);

      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          if (!snapshot.exists()) {
            next(new Error("Product not found"), null);
            return;
          }

          const productData = { id: snapshot.id, ...snapshot.data() };
          
          // Verify ownership if sellerId is provided and user is not admin
          if (!isAdmin && sellerId && productData.sellerId !== sellerId) {
            next(new Error("Access denied"), null);
            return;
          }
          
          next(null, productData);
        },
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data,
    error: error?.message,
    isLoading: data === undefined && !error,
  };
}

// Hook to get products by multiple IDs
export function useProductsByIds({ idsList = [] } = {}) {
  const { data, error } = useSWRSubscription(
    ["productsByIds", idsList],
    ([path, idsList], { next }) => {
      if (!idsList || idsList.length === 0) {
        next(null, []);
        return () => {};
      }

      const ref = collection(db, "products");
      const q = query(ref, where("__name__", "in", idsList));

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? []
              : snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }))
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data || [],
    error: error?.message,
    isLoading: data === undefined,
  };
}

// Hook to get featured products
export function useFeaturedProducts() {
  const { data, error } = useSWRSubscription(
    ["featuredProducts"],
    ([path], { next }) => {
      const q = query(
        collection(db, "products"), 
        where("isFeatured", "==", true)
      );

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0 
              ? [] 
              : snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }))
          ),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data: data || [],
    error: error?.message,
    isLoading: data === undefined,
  };
}

// Hook to get new arrival products
export function useNewArrivalProducts() {
  const { data, error } = useSWRSubscription(
    ["newArrivalProducts"],
    ([path], { next }) => {
      const q = query(
        collection(db, "products"), 
        where("isNewArrival", "==", true)
      );

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0 
              ? [] 
              : snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }))
          ),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data: data || [],
    error: error?.message,
    isLoading: data === undefined,
  };
}

// In lib/firestore/products/read.js - ADD THIS HOOK IF MISSING:
export function useSellerProducts({ sellerId, pageLimit, lastSnapDoc, filters = {}, searchTerm = "" } = {}) {
  console.log('🎯 useSellerProducts called with sellerId:', sellerId)
  
  const result = useProducts({ 
    pageLimit, 
    lastSnapDoc, 
    filters, 
    searchTerm, 
    sellerId, 
    isAdmin: false 
  })
  
  console.log('🎯 useSellerProducts result:', result)
  
  return result
}

// Convenience hook for admin products
export function useAdminProducts({ 
  pageLimit, 
  lastSnapDoc, 
  filters = {}, 
  searchTerm = "" 
} = {}) {
  return useProducts({ 
    pageLimit, 
    lastSnapDoc, 
    filters, 
    searchTerm, 
    sellerId: null, 
    isAdmin: true 
  });
}

// Hook to get products by category
export function useProductsByCategory({ categoryId } = {}) {
  const { data, error } = useSWRSubscription(
    ["productsByCategory", categoryId],
    ([path, categoryId], { next }) => {
      if (!categoryId) {
        next(null, []);
        return () => {};
      }

      const q = query(
        collection(db, "products"),
        where("categoryId", "==", categoryId),
        orderBy("timestampCreate", "desc")
      );

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? []
              : snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }))
          ),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data: data || [],
    error: error?.message,
    isLoading: data === undefined,
  };
}
