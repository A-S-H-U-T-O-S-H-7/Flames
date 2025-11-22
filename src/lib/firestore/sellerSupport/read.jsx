// lib/firestore/support/read.js
import { db } from "../../firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc, 
  doc,
  onSnapshot,
  limit,
  startAfter
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import useSWR from "swr";

const SUPPORT_COLLECTION = "supportTickets";

/**
 * Hook to get all support tickets for a specific user/seller (real-time)
 */
export function useUserSupportTickets(userId) {
  const { data, error } = useSWRSubscription(
    ["supportTickets", userId],
    ([path, userId], { next }) => {
      if (!userId) {
        next(null, []);
        return () => {};
      }

      const ref = collection(db, SUPPORT_COLLECTION);
      const q = query(
        ref,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const tickets = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
            closedAt: doc.data().closedAt?.toDate?.() || doc.data().closedAt,
          }));
          next(null, tickets);
        },
        (err) => {
          console.error("Error fetching support tickets:", err);
          next(err, null);
        }
      );

      return () => unsub();
    }
  );

  return {
    data: data || [],
    error: error?.message,
    isLoading: !data && !error,
  };
}

/**
 * Hook to get a single support ticket by ID (real-time)
 */
export function useSupportTicket(ticketId) {
  const { data, error } = useSWRSubscription(
    ["supportTicket", ticketId],
    ([path, ticketId], { next }) => {
      if (!ticketId) {
        next(null, null);
        return () => {};
      }

      const ref = doc(db, SUPPORT_COLLECTION, ticketId);

      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          if (!snapshot.exists()) {
            next(new Error("Ticket not found"), null);
            return;
          }

          const ticket = {
            id: snapshot.id,
            ...snapshot.data(),
            // Convert Firestore timestamps
            createdAt: snapshot.data().createdAt?.toDate?.() || snapshot.data().createdAt,
            updatedAt: snapshot.data().updatedAt?.toDate?.() || snapshot.data().updatedAt,
            closedAt: snapshot.data().closedAt?.toDate?.() || snapshot.data().closedAt,
            replies: snapshot.data().replies?.map(reply => ({
              ...reply,
              repliedAt: reply.repliedAt?.toDate?.() || reply.repliedAt
            })) || []
          };

          next(null, ticket);
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

/**
 * Hook to get all support tickets for admin (real-time)
 */
export function useAllSupportTickets({ status = null, pageLimit = 20 } = {}) {
  const { data, error } = useSWRSubscription(
    ["allSupportTickets", status, pageLimit],
    ([path, status, pageLimit], { next }) => {
      const ref = collection(db, SUPPORT_COLLECTION);
      let constraints = [orderBy("createdAt", "desc"), limit(pageLimit)];

      if (status && status !== 'all') {
        constraints.unshift(where("status", "==", status));
      }

      const q = query(ref, ...constraints);

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const tickets = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
            closedAt: doc.data().closedAt?.toDate?.() || doc.data().closedAt,
          }));
          next(null, tickets);
        },
        (err) => {
          console.error("Error fetching all support tickets:", err);
          next(err, null);
        }
      );

      return () => unsub();
    }
  );

  return {
    data: data || [],
    error: error?.message,
    isLoading: !data && !error,
  };
}

/**
 * Get support ticket statistics for a user
 */
export async function getUserSupportStats(userId) {
  try {
    const ref = collection(db, SUPPORT_COLLECTION);
    const q = query(ref, where("userId", "==", userId));
    
    const snapshot = await getDocs(q);
    
    const stats = {
      total: 0,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    };

    snapshot.forEach((doc) => {
      const ticket = doc.data();
      stats.total++;
      
      if (stats.hasOwnProperty(ticket.status)) {
        stats[ticket.status]++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting support stats:", error);
    throw error;
  }
}

/**
 * Search support tickets by ticket number or subject
 */
export async function searchSupportTickets(searchTerm, userId = null) {
  try {
    const ref = collection(db, SUPPORT_COLLECTION);
    let constraints = [orderBy("createdAt", "desc")];
    
    if (userId) {
      constraints.unshift(where("userId", "==", userId));
    }

    const q = query(ref, ...constraints);
    const snapshot = await getDocs(q);
    
    // Client-side filtering since Firestore doesn't support OR queries easily
    const results = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      }))
      .filter(ticket => 
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return results;
  } catch (error) {
    console.error("Error searching support tickets:", error);
    throw error;
  }
}