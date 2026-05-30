"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { firebaseDb } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  orderBy 
} from "firebase/firestore";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [digitalAccesses, setDigitalAccesses] = useState([]);
  const [services, setServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [referralPoints, setReferralPoints] = useState(150);
  const [referralCode, setReferralCode] = useState("AA-DANISH-99");
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  // Fetch digital access from API
  const fetchDigitalAccess = async () => {
    try {
      const res = await fetch("/api/digital-access");
      if (res.ok) {
        const data = await res.json();
        setDigitalAccesses(data.digitalAccesses || []);
      }
    } catch (err) {
      console.error("Fetch digital access error:", err);
    }
  };

  // Fetch services directly from Firestore
  const fetchServices = async (uid, isAdmin) => {
    try {
      let q = query(collection(firebaseDb, "services"), orderBy("updatedAt", "desc"));
      if (!isAdmin) {
        q = query(collection(firebaseDb, "services"), where("userId", "==", uid), orderBy("updatedAt", "desc"));
      }
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setServices(list);
    } catch (err) {
      console.error("Fetch services error:", err);
    }
  };

  // Fetch tickets directly from Firestore
  const fetchTickets = async (uid, isAdmin) => {
    try {
      const q = collection(firebaseDb, "tickets");
      const snap = await getDocs(q);
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!isAdmin) {
        list = list.filter(t => t.userId === uid);
      }
      setTickets(list);
    } catch (err) {
      console.error("Fetch tickets error:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const q = collection(firebaseDb, "users");
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllUsers(list);
    } catch (err) {
      console.error("Fetch all users error:", err);
    }
  };

  const fetchPayouts = async (uid, isAdmin) => {
    try {
      const q = collection(firebaseDb, "payouts");
      const snap = await getDocs(q);
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!isAdmin) {
        list = list.filter(p => p.userId === uid);
      }
      setPayouts(list);
    } catch (err) {
      console.error("Fetch payouts error:", err);
    }
  };

  // Fetch notifications directly from Firestore
  const fetchNotifications = async (uid) => {
    try {
      const q = query(collection(firebaseDb, "notifications"), where("userId", "==", uid));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(list);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  };

  // Unified data reload helper
  const reloadUserData = async (user) => {
    if (!user) return;
    const isAdmin = user.role === "admin" || user.role === "superadmin";
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchDigitalAccess(),
      fetchServices(user.id, isAdmin),
      fetchTickets(user.id, isAdmin),
      fetchNotifications(user.id),
      fetchPayouts(user.id, isAdmin),
      isAdmin ? fetchAllUsers() : Promise.resolve()
    ]);
  };

  // Load user session on mount and subscribe to Firebase Auth
  useEffect(() => {
    let unsubscribe = () => {};
    const initAuth = async () => {
      try {
        const { onAuthChange } = await import("@/lib/auth-client");
        unsubscribe = onAuthChange(async (firebaseUser) => {
          if (firebaseUser) {
            // Fetch role and details
            const userDoc = await getDoc(doc(firebaseDb, "users", firebaseUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            const userState = {
              id: firebaseUser.uid,
              name: userData.fullName || firebaseUser.displayName || "Pelanggan",
              email: firebaseUser.email,
              role: userData.role || "customer",
              membershipTier: userData.membershipTier || "free",
              membershipExpiresAt: userData.membershipExpiresAt || null,
              specialDiscount: userData.specialDiscount || 0,
              referralCode: userData.referralCode || `AA-${(userData.fullName || firebaseUser.displayName || "USER").split(" ")[0].toUpperCase()}-${firebaseUser.uid.slice(0, 4).toUpperCase()}`,
              referralBalance: userData.referralBalance || 0,
            };
            setCurrentUser(userState);
            await reloadUserData(userState);
          } else {
            setCurrentUser(null);
            setOrders([]);
            setDigitalAccesses([]);
            setServices([]);
            setTickets([]);
            setNotifications([]);
          }
          setIsLoaded(true);
        });
      } catch (err) {
        console.error("Auth subscription error:", err);
        setIsLoaded(true);
      }
    };

    initAuth();
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth Functions
  const login = async (email, password) => {
    const { signIn } = await import("@/lib/auth-client");
    const result = await signIn(email, password);
    const userDoc = await getDoc(doc(firebaseDb, "users", result.user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    const userState = {
      id: result.user.uid,
      name: userData.fullName || result.user.displayName || "Pelanggan",
      email: result.user.email,
      role: result.role,
      membershipTier: userData.membershipTier || "free",
      membershipExpiresAt: userData.membershipExpiresAt || null,
      specialDiscount: userData.specialDiscount || 0,
      referralCode: userData.referralCode || `AA-${(userData.fullName || result.user.displayName || "USER").split(" ")[0].toUpperCase()}-${result.user.uid.slice(0, 4).toUpperCase()}`,
      referralBalance: userData.referralBalance || 0,
    };
    setCurrentUser(userState);
    await reloadUserData(userState);
    addNotification("Log Masuk Berjaya", `Selamat kembali, ${userState.name}!`, "success");
    return userState;
  };

  const logout = async () => {
    const { signOut } = await import("@/lib/auth-client");
    await signOut();
    setCurrentUser(null);
  };

  // Notification helper
  const addNotification = async (title, message, type = "info") => {
    if (!currentUser) return;
    try {
      const newNotif = {
        userId: currentUser.id,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(firebaseDb, "notifications"), newNotif);
      await fetchNotifications(currentUser.id);
    } catch (err) {
      console.error("Add notification error:", err);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    try {
      const snap = await getDocs(
        query(collection(firebaseDb, "notifications"), where("userId", "==", currentUser.id))
      );
      const updates = snap.docs.map(d => updateDoc(doc(firebaseDb, "notifications", d.id), { read: true }));
      await Promise.all(updates);
      await fetchNotifications(currentUser.id);
    } catch (err) {
      console.error("Mark notifications read error:", err);
    }
  };

  // Product CRUD (Admin)
  const addProduct = async (product) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          type: product.category === "course" ? "video_course" : product.category === "service" ? "digital_service" : product.category,
          price: Number(product.price),
          coverImageUrl: product.coverImageUrl || null,
          features: product.features || [],
          downloadUrl: product.downloadUrl || null,
          isPublished: product.published !== false,
        }),
      });
      if (res.ok) {
        await fetchProducts();
        addNotification("Produk Baru Ditambah", `Produk "${product.name}" kini tersedia di katalog.`, "info");
      }
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  const updateProduct = async (updatedProd) => {
    try {
      const res = await fetch(`/api/products/${updatedProd.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedProd.name,
          description: updatedProd.description,
          price: Number(updatedProd.price),
          features: updatedProd.features,
          downloadUrl: updatedProd.downloadUrl,
          isPublished: updatedProd.published !== false,
          type: updatedProd.category === "course" ? "video_course" : updatedProd.category === "service" ? "digital_service" : updatedProd.category,
        }),
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error("Update product error:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  // Checkout / Order placement
  const placeOrder = async (productId, paymentMethod, clientDetails) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          paymentMethod,
          clientDetails,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        await fetchOrders();
        await fetchDigitalAccess();
        if (currentUser) {
          const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
          await fetchServices(currentUser.id, isAdmin);
        }
        return data.order;
      }
    } catch (err) {
      console.error("Place order error:", err);
    }
    return null;
  };

  // Submit manual payment receipt
  const submitPaymentReceipt = async (orderId, receiptUrl, notes) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptUrl, notes }),
      });
      if (res.ok) {
        await fetchOrders();
        return true;
      }
    } catch (err) {
      console.error("Submit payment receipt error:", err);
    }
    return false;
  };

  // Order Approval (Admin)
  const approveOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchOrders();
        await fetchDigitalAccess();
        if (currentUser) {
          const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
          await fetchServices(currentUser.id, isAdmin);
        }
      }
    } catch (err) {
      console.error("Approve order error:", err);
    }
  };

  const rejectOrder = async (orderId, reason) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "Resit tidak sah." }),
      });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.error("Reject order error:", err);
    }
  };

  // Service Progress Update (Admin)
  const updateServiceStatus = async (serviceId, status, progressNotes) => {
    try {
      const docRef = doc(firebaseDb, "services", serviceId);
      await updateDoc(docRef, {
        status,
        progressNotes,
        updatedAt: new Date().toISOString(),
      });
      if (currentUser) {
        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        await fetchServices(currentUser.id, isAdmin);
      }
    } catch (err) {
      console.error("Update service status error:", err);
    }
  };

  // Support Ticket Actions
  const createTicket = async (title, message, orderId) => {
    if (!currentUser) return null;
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: title,
          description: message,
          orderId: orderId || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        await fetchTickets(currentUser.id, isAdmin);
        return data.ticket;
      }
    } catch (err) {
      console.error("Create ticket error:", err);
    }
    return null;
  };

  const replyToTicket = async (ticketId, message) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        if (currentUser) {
          const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
          await fetchTickets(currentUser.id, isAdmin);
        }
      }
    } catch (err) {
      console.error("Reply ticket error:", err);
    }
  };

  const closeTicket = async (ticketId) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      if (res.ok) {
        if (currentUser) {
          const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
          await fetchTickets(currentUser.id, isAdmin);
        }
      }
    } catch (err) {
      console.error("Close ticket error:", err);
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        if (currentUser) {
          const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
          await fetchTickets(currentUser.id, isAdmin);
        }
        return true;
      }
    } catch (err) {
      console.error("Update ticket status error:", err);
    }
    return false;
  };

  const updateUserMembership = async (userId, tier, expiresAt = null, specialDiscount = 0) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const userRef = doc(firebaseDb, "users", userId);
      await updateDoc(userRef, {
        membershipTier: tier,
        membershipExpiresAt: expiresAt,
        specialDiscount: Number(specialDiscount),
        updatedAt: new Date().toISOString()
      });
      await fetchAllUsers();
      if (currentUser && currentUser.id === userId) {
        // reload own session fields
        const uDoc = await getDoc(userRef);
        const uData = uDoc.exists() ? uDoc.data() : {};
        setCurrentUser(prev => prev ? {
          ...prev,
          membershipTier: uData.membershipTier,
          membershipExpiresAt: uData.membershipExpiresAt,
          specialDiscount: uData.specialDiscount
        } : null);
      }
      return true;
    } catch (err) {
      console.error("Update user membership error:", err);
    }
    return false;
  };

  const requestPayout = async (bankDetails, amount) => {
    if (!currentUser) return false;
    try {
      const { addDoc, collection, doc, updateDoc } = await import("firebase/firestore");
      const userDocRef = doc(firebaseDb, "users", currentUser.id);
      const userDoc = await getDoc(userDocRef);
      const currentBalance = userDoc.exists() ? (userDoc.data().referralBalance || 0) : 0;
      if (currentBalance < amount) {
        alert("Baki komisen anda tidak mencukupi untuk membuat pengeluaran ini.");
        return false;
      }

      const newPayout = {
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        amount: Number(amount),
        status: "pending",
        paymentDetails: bankDetails,
        createdAt: new Date().toISOString(),
        processedAt: null
      };

      // Deduct balance from user doc
      await updateDoc(userDocRef, {
        referralBalance: currentBalance - Number(amount),
        updatedAt: new Date().toISOString()
      });

      // Add payout request
      await addDoc(collection(firebaseDb, "payouts"), newPayout);

      // Refresh
      const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
      await fetchPayouts(currentUser.id, isAdmin);
      await reloadUserData(currentUser);
      return true;
    } catch (err) {
      console.error("Request payout error:", err);
    }
    return false;
  };

  const processPayout = async (payoutId, status) => {
    try {
      const { doc, getDoc, updateDoc } = await import("firebase/firestore");
      const payoutRef = doc(firebaseDb, "payouts", payoutId);
      const payoutDoc = await getDoc(payoutRef);
      if (!payoutDoc.exists) return false;

      const payoutData = payoutDoc.data();
      if (payoutData.status !== "pending") return false;

      await updateDoc(payoutRef, {
        status,
        processedAt: new Date().toISOString()
      });

      // If rejected, refund the balance to the user
      if (status === "rejected") {
        const userRef = doc(firebaseDb, "users", payoutData.userId);
        const uDoc = await getDoc(userRef);
        const currentBalance = uDoc.exists() ? (uDoc.data().referralBalance || 0) : 0;
        await updateDoc(userRef, {
          referralBalance: currentBalance + payoutData.amount,
          updatedAt: new Date().toISOString()
        });
      }

      if (currentUser) {
        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        await fetchPayouts(currentUser.id, isAdmin);
        await reloadUserData(currentUser);
      }
      return true;
    } catch (err) {
      console.error("Process payout error:", err);
    }
    return false;
  };

  // Referral point claims
  const claimReferralPoints = (code) => {
    if (code.trim().toUpperCase() === "AA-AI-VIP") {
      setReferralPoints(prev => prev + 100);
      addNotification("Kod Referral Dituntut", "Anda mendapat 100 mata bonus!", "success");
      return true;
    }
    addNotification("Ralat Kod", "Kod referral tidak sah.", "danger");
    return false;
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      digitalAccesses,
      services,
      tickets,
      currentUser,
      notifications,
      referralPoints,
      referralCode,
      isLoaded,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      placeOrder,
      submitPaymentReceipt,
      approveOrder,
      rejectOrder,
      updateServiceStatus,
      createTicket,
      replyToTicket,
      closeTicket,
      updateTicketStatus,
      allUsers,
      payouts,
      updateUserMembership,
      requestPayout,
      processPayout,
      claimReferralPoints,
      markAllNotificationsRead,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
