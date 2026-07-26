"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ADMIN_ACTIVITY_KEY,
  ADMIN_APPOINTMENTS_KEY,
  ADMIN_FINANCE_RECORDS_KEY,
  ADMIN_GIFT_CERTIFICATES_KEY,
  ADMIN_SETTINGS_KEY,
  createActivityEntry,
  createAppointmentTemplate,
  defaultSettings,
  formatDateKey,
  formatCurrency,
  getSlotReserveKey,
  groupClients,
  normalizeActivityEntry,
  normalizeAppointment,
  normalizeFinanceRecord,
  normalizeGiftCertificateOrder,
  normalizeSettings,
  readStoredActivityLog,
  readStoredAppointments,
  readStoredFinanceRecords,
  readStoredGiftOrders,
  readStoredSettings,
  sortFinanceRecords,
  sortAppointments,
  writeAdminJson
} from "@/components/admin/admin-data";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [giftOrders, setGiftOrders] = useState([]);
  const [financeRecords, setFinanceRecords] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const settingsRef = useRef(defaultSettings);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [editorState, setEditorState] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const syncedAlfabankOrdersRef = useRef(new Set());
  const appointmentsRef = useRef([]);
  const giftOrdersRef = useRef([]);

  useEffect(() => {
    setAppointments(readStoredAppointments());
    setGiftOrders(readStoredGiftOrders());
    setFinanceRecords(readStoredFinanceRecords());
    setActivityLog(readStoredActivityLog());
    setSettings(readStoredSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeAdminJson(ADMIN_APPOINTMENTS_KEY, appointments);
  }, [appointments, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeAdminJson(ADMIN_GIFT_CERTIFICATES_KEY, giftOrders);
  }, [giftOrders, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeAdminJson(ADMIN_FINANCE_RECORDS_KEY, financeRecords);
  }, [financeRecords, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeAdminJson(ADMIN_ACTIVITY_KEY, activityLog);
  }, [activityLog, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeAdminJson(ADMIN_SETTINGS_KEY, settings);
  }, [settings, hydrated]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  useEffect(() => {
    giftOrdersRef.current = giftOrders;
  }, [giftOrders]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    function handleStorage(event) {
      if (!event.key) {
        return;
      }

      if (event.key === ADMIN_APPOINTMENTS_KEY) {
        setAppointments(readStoredAppointments());
      }

      if (event.key === ADMIN_GIFT_CERTIFICATES_KEY) {
        setGiftOrders(readStoredGiftOrders());
      }

      if (event.key === ADMIN_FINANCE_RECORDS_KEY) {
        setFinanceRecords(readStoredFinanceRecords());
      }

      if (event.key === ADMIN_ACTIVITY_KEY) {
        setActivityLog(readStoredActivityLog());
      }

      if (event.key === ADMIN_SETTINGS_KEY) {
        setSettings(readStoredSettings());
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return undefined;
    }

    let disposed = false;

    function getOrderDateParts(createdAt) {
      const date = new Date(createdAt);
      const fallback = new Date();
      const safeDate = Number.isNaN(date.getTime()) ? fallback : date;

      return {
        date: formatDateKey(safeDate),
        time: `${`${safeDate.getHours()}`.padStart(2, "0")}:${`${safeDate.getMinutes()}`.padStart(2, "0")}`
      };
    }

    function getRemoteStatus(order) {
      if (["cancelled", "declined", "refunded", "registration_failed", "amount_mismatch"].includes(order.status)) {
        return "canceled";
      }

      return order.status === "paid" && order.mode === "production" ? "confirmed" : "pending";
    }

    function mapBookingOrder(order) {
      const details = order.details;
      const isRealPayment = order.mode === "production" && order.status === "paid";
      const guestTickets = (details.tickets || []).flatMap((ticket) =>
        Array.from({ length: ticket.quantity }, (_, index) => ({
          id: `${order.orderNumber}-${ticket.id}-${index + 1}`,
          tariff: ticket.title
        }))
      );
      const modeLabel = order.mode === "test" ? "ТЕСТОВЫЙ ПЛАТЁЖ" : "АЛЬФА-БАНК";

      return normalizeAppointment({
        id: order.orderNumber,
        clientName: details.customer.name,
        phone: details.customer.phone,
        email: details.customer.email,
        date: details.date,
        time: details.time,
        guestCount: details.guestCount,
        guestTickets,
        service: guestTickets[0]?.tariff,
        selectedExtras: [],
        comment: `[${modeLabel}] ${details.customer.comment || "Заказ с сайта"} · статус: ${order.status}`,
        status: getRemoteStatus(order),
        source: "Сайт",
        prepaymentAmount: isRealPayment ? details.paymentAmount : 0,
        paymentMethod: isRealPayment ? "online" : "",
        onSitePaymentAmount: 0,
        onSitePaymentMethod: "",
        alfabankMode: order.mode,
        alfabankStatus: order.status,
        alfabankOrderId: order.bankOrderId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      });
    }

    function mapGiftOrder(order) {
      const details = order.details;
      const created = getOrderDateParts(order.createdAt);
      const isRealPayment = order.mode === "production" && order.status === "paid";
      const modeLabel = order.mode === "test" ? "ТЕСТОВЫЙ ПЛАТЁЖ" : "АЛЬФА-БАНК";

      return normalizeGiftCertificateOrder({
        id: order.orderNumber,
        certificateId: "gift-visit",
        certificateTitle: details.title,
        amount: details.paymentAmount,
        guestCount: details.guestCount,
        pricePerGuest: details.pricePerGuest,
        purchaserName: details.customer.name,
        purchaserPhone: details.customer.phone,
        purchaserEmail: details.customer.email,
        recipientName: details.recipient.name,
        recipientPhone: details.recipient.phone,
        recipientEmail: details.recipient.email,
        deliveryContact: details.deliveryContact,
        message: details.message,
        deliveryMethod: details.deliveryMethod,
        comment: `[${modeLabel}] ${details.customer.comment || "Заказ с сайта"} · статус: ${order.status}`,
        source: "Сайт",
        status: isRealPayment ? "paid" : order.status,
        paymentMethod: isRealPayment ? "online" : "",
        alfabankMode: order.mode,
        alfabankStatus: order.status,
        alfabankOrderId: order.bankOrderId,
        purchaseDate: created.date,
        purchaseTime: created.time,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      });
    }

    async function syncAlfabankOrders() {
      try {
        const response = await fetch("/api/alfabank/admin/orders", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const orders = Array.isArray(payload.orders) ? payload.orders : [];
        const bookingOrders = orders.filter((order) => order?.details?.kind === "booking").map(mapBookingOrder);
        const certificateOrders = orders.filter((order) => order?.details?.kind === "gift").map(mapGiftOrder);
        const activityEntries = [];

        bookingOrders.forEach((appointment) => {
          const key = `${appointment.id}:${appointment.alfabankStatus}`;
          if (!syncedAlfabankOrdersRef.current.has(key)) {
            activityEntries.push(
              createActivityEntry({
                entityId: appointment.id,
                entityType: "appointment",
                kind: appointment.alfabankStatus === "paid" ? "payment" : "created",
                relatedDate: appointment.date,
                relatedTime: appointment.time,
                tone: appointment.alfabankStatus === "paid" ? "success" : "info",
                message: `Альфа-Банк: ${appointment.alfabankMode === "test" ? "тестовая " : ""}бронь ${appointment.clientName} · ${appointment.alfabankStatus}.`
              })
            );
            syncedAlfabankOrdersRef.current.add(key);
          }
        });

        certificateOrders.forEach((order) => {
          const key = `${order.id}:${order.alfabankStatus}`;
          if (!syncedAlfabankOrdersRef.current.has(key)) {
            activityEntries.push(
              createActivityEntry({
                entityId: order.id,
                entityType: "gift-certificate",
                kind: order.alfabankStatus === "paid" ? "paid" : "created",
                relatedDate: order.purchaseDate,
                relatedTime: order.purchaseTime,
                tone: order.alfabankStatus === "paid" ? "success" : "info",
                message: `Альфа-Банк: ${order.alfabankMode === "test" ? "тестовый " : ""}сертификат ${order.purchaserName} · ${order.alfabankStatus}.`
              })
            );
            syncedAlfabankOrdersRef.current.add(key);
          }
        });

        setAppointments((current) => {
          const remoteIds = new Set(bookingOrders.map((order) => order.id));
          const localOrders = current.filter((appointment) => !remoteIds.has(appointment.id));
          const mergedRemoteOrders = bookingOrders.map((remoteOrder) => {
            const existing = current.find((appointment) => appointment.id === remoteOrder.id);
            if (!existing || !["completed", "canceled"].includes(existing.status)) {
              return remoteOrder;
            }
            return { ...remoteOrder, status: existing.status, onSitePaymentAmount: existing.onSitePaymentAmount, onSitePaymentMethod: existing.onSitePaymentMethod };
          });
          return sortAppointments([...localOrders, ...mergedRemoteOrders]);
        });

        setGiftOrders((current) => {
          const remoteIds = new Set(certificateOrders.map((order) => order.id));
          return [...current.filter((order) => !remoteIds.has(order.id)), ...certificateOrders];
        });

        if (!disposed && activityEntries.length) {
          activityEntries.forEach((entry) => appendActivity(entry));
          pushToast(`Заказы Альфа-Банка обновлены: ${activityEntries.length}`);
        }
      } catch {
        // Keep locally entered records available if the payment service is temporarily unreachable.
      }
    }

    syncAlfabankOrders();
    const intervalId = window.setInterval(syncAlfabankOrders, 20000);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
    };
  }, [hydrated]);

  function pushToast(message, tone = "success") {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setToasts((current) => [...current, { id, message, tone }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }

  function appendActivity(entry) {
    const normalizedEntry = normalizeActivityEntry(entry);
    setActivityLog((current) => [normalizedEntry, ...current].slice(0, 300));
  }

  function openCreateModal(seed = {}) {
    setEditorState({
      mode: "create",
      appointment: {
        ...createAppointmentTemplate(selectedDate),
        ...seed
      }
    });
  }

  function openEditModal(appointment) {
    setEditorState({
      mode: "edit",
      appointment: {
        ...appointment
      }
    });
  }

  function closeEditor() {
    setEditorState(null);
  }

  function openDetails(id) {
    setDetailId(id);
  }

  function closeDetails() {
    setDetailId(null);
  }

  function saveAppointment(values) {
    const normalizedAppointment = {
      ...normalizeAppointment(values),
      updatedAt: new Date().toISOString()
    };
    const existingAppointment = normalizedAppointment.id
      ? appointments.find((appointment) => appointment.id === normalizedAppointment.id) ?? null
      : null;

    if (normalizedAppointment.id) {
      setAppointments((current) =>
        sortAppointments(
          current.map((appointment) =>
            appointment.id === normalizedAppointment.id
              ? { ...appointment, ...normalizedAppointment }
              : appointment
          )
        )
      );
      appendActivity(
        createActivityEntry({
          entityId: normalizedAppointment.id,
          entityType: "appointment",
          kind: existingAppointment?.onSitePaymentAmount !== normalizedAppointment.onSitePaymentAmount ? "payment" : "updated",
          relatedDate: normalizedAppointment.date,
          relatedTime: normalizedAppointment.time,
          tone: existingAppointment?.onSitePaymentAmount !== normalizedAppointment.onSitePaymentAmount ? "success" : "info",
          message:
            existingAppointment?.onSitePaymentAmount !== normalizedAppointment.onSitePaymentAmount
              ? `Оплата на месте обновлена: ${normalizedAppointment.clientName} · ${normalizedAppointment.onSitePaymentAmount} ₽`
              : `Запись обновлена: ${normalizedAppointment.clientName} · ${normalizedAppointment.time} · ${normalizedAppointment.guestCount} чел.`
        })
      );
      pushToast("Запись обновлена");
    } else {
      const appointment = {
        ...normalizedAppointment,
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `appointment-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      setAppointments((current) => sortAppointments([...current, appointment]));
      appendActivity(
        createActivityEntry({
          entityId: appointment.id,
          entityType: "appointment",
          kind: "created",
          relatedDate: appointment.date,
          relatedTime: appointment.time,
          tone: "success",
          message: `Новая запись: ${appointment.clientName} · ${appointment.time} · ${appointment.guestCount} чел.`
        })
      );
      pushToast("Запись создана");
    }

    setSelectedDate(normalizedAppointment.date);
    closeEditor();
  }

  function updateAppointmentStatus(id, status, successMessage) {
    const appointment = appointments.find((item) => item.id === id);
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status,
              updatedAt: new Date().toISOString()
            }
          : appointment
      )
    );

    if (detailId === id && status === "canceled") {
      setDetailId(id);
    }

    if (appointment) {
      appendActivity(
        createActivityEntry({
          entityId: appointment.id,
          entityType: "appointment",
          kind: status,
          relatedDate: appointment.date,
          relatedTime: appointment.time,
          tone: status === "canceled" ? "danger" : "success",
          message: `${appointment.clientName}: статус изменён на «${successMessage.replace(/^Запись /, "").toLowerCase()}».`
        })
      );
    }

    pushToast(successMessage);
  }

  function deleteAppointment(id) {
    const appointment = appointments.find((item) => item.id === id);
    setAppointments((current) => current.filter((appointment) => appointment.id !== id));
    setDetailId(null);
    if (appointment) {
      appendActivity(
        createActivityEntry({
          entityId: appointment.id,
          entityType: "appointment",
          kind: "deleted",
          relatedDate: appointment.date,
          relatedTime: appointment.time,
          tone: "danger",
          message: `Запись удалена: ${appointment.clientName} · ${appointment.time}.`
        })
      );
    }
    pushToast("Запись удалена", "neutral");
  }

  function saveSettings(nextSettings) {
    setSettings((current) => normalizeSettings({ ...current, ...nextSettings, slotDuration: Number(nextSettings.slotDuration) }));
    pushToast("Настройки сохранены");
  }

  function saveFinanceRecord(values) {
    const normalizedRecord = {
      ...normalizeFinanceRecord(values),
      updatedAt: new Date().toISOString()
    };
    const existingRecord = normalizedRecord.id ? financeRecords.find((record) => record.id === normalizedRecord.id) ?? null : null;

    setFinanceRecords((current) => {
      if (existingRecord) {
        return sortFinanceRecords(
          current.map((record) => (record.id === normalizedRecord.id ? { ...record, ...normalizedRecord } : record))
        );
      }

      return sortFinanceRecords([...current, normalizedRecord]);
    });

    appendActivity(
      createActivityEntry({
        entityId: normalizedRecord.id,
        entityType: "finance",
        kind: normalizedRecord.type,
        relatedDate: normalizedRecord.date,
        relatedTime: normalizedRecord.time,
        tone: normalizedRecord.type === "expense" ? "danger" : "success",
        message: `${normalizedRecord.type === "expense" ? "Расход" : "Доход"}: ${normalizedRecord.title} · ${formatCurrency(
          normalizedRecord.amount
        )}`
      })
    );
    setSelectedDate(normalizedRecord.date);
    pushToast(
      existingRecord ? "Операция обновлена" : normalizedRecord.type === "expense" ? "Расход добавлен" : "Доход добавлен",
      normalizedRecord.type === "expense" ? "neutral" : "success"
    );
  }

  function deleteFinanceRecord(id) {
    const record = financeRecords.find((item) => item.id === id);

    if (!record) {
      return;
    }

    setFinanceRecords((current) => current.filter((item) => item.id !== id));
    appendActivity(
      createActivityEntry({
        entityId: record.id,
        entityType: "finance",
        kind: "deleted",
        relatedDate: record.date,
        relatedTime: record.time,
        tone: "danger",
        message: `Операция удалена: ${record.title} · ${formatCurrency(record.amount)}`
      })
    );
    pushToast("Операция удалена", "neutral");
  }

  function updateSlotReserve(dateKey, time, delta) {
    const reserveKey = getSlotReserveKey(dateKey, time);
    const currentSettings = settingsRef.current;
    const currentValue = currentSettings.slotReserveMap?.[reserveKey] ?? 0;
    const nextValue = Math.max(0, Math.min(2, currentValue + delta));

    if (nextValue === currentValue) {
      return;
    }

    const nextMap = { ...(currentSettings.slotReserveMap ?? {}) };

    if (nextValue > 0) {
      nextMap[reserveKey] = nextValue;
    } else {
      delete nextMap[reserveKey];
    }

    const nextSettings = normalizeSettings({
      ...currentSettings,
      slotReserveMap: nextMap
    });

    settingsRef.current = nextSettings;
    setSettings(nextSettings);

    appendActivity(
      createActivityEntry({
        entityId: reserveKey,
        entityType: "slot",
        kind: "reserve-updated",
        relatedDate: dateKey,
        relatedTime: time,
        tone: "info",
        message: `Резервные места ${time}: активировано ${nextValue} из 2.`
      })
    );
    pushToast(nextValue > currentValue ? "Добавлено резервное место" : "Резервное место скрыто", "neutral");
  }

  function updateHappyHourDate(dateKey, enabled) {
    const currentSettings = settingsRef.current;
    const nextMap = { ...(currentSettings.happyHourDisabledDates ?? {}) };

    if (enabled) {
      delete nextMap[dateKey];
    } else {
      nextMap[dateKey] = true;
    }

    const nextSettings = normalizeSettings({
      ...currentSettings,
      happyHourDisabledDates: nextMap
    });

    settingsRef.current = nextSettings;
    setSettings(nextSettings);

    appendActivity(
      createActivityEntry({
        entityId: `happy-hour-${dateKey}`,
        entityType: "settings",
        kind: enabled ? "happy-hour-enabled" : "happy-hour-disabled",
        relatedDate: dateKey,
        relatedTime: "",
        tone: enabled ? "success" : "warning",
        message: enabled ? `Счастливый час включён на ${dateKey}.` : `Счастливый час отключён на ${dateKey}.`
      })
    );
    pushToast(enabled ? "Счастливый час включён на дату" : "Счастливый час отключён на дату", enabled ? "success" : "neutral");
  }

  function resetDemoData() {
    setAppointments([]);
    setGiftOrders([]);
    setFinanceRecords([]);
    setActivityLog([]);
    setSelectedDate(formatDateKey(new Date()));
    pushToast("Записи и статистика очищены", "neutral");
  }

  const selectedAppointment = useMemo(
    () => appointments.find((appointment) => appointment.id === detailId) ?? null,
    [appointments, detailId]
  );

  const clients = useMemo(() => groupClients(appointments), [appointments]);

  const value = {
    appointments,
    activityLog,
    clients,
    closeDetails,
    closeEditor,
    deleteFinanceRecord,
    deleteAppointment,
    detailId,
    editorState,
    financeRecords,
    giftOrders,
    hydrated,
    openCreateModal,
    openDetails,
    openEditModal,
    pushToast,
    resetDemoData,
    saveAppointment,
    saveFinanceRecord,
    saveSettings,
    searchQuery,
    selectedAppointment,
    selectedDate,
    setSearchQuery,
    setSelectedDate,
    settings,
    updateHappyHourDate,
    updateSlotReserve,
    toasts,
    updateAppointmentStatus
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }

  return context;
}
