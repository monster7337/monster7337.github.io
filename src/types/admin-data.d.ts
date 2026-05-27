declare module "@/components/admin/admin-data" {
  export const FIXED_SLOT_TIMES: string[];
  export const defaultSettings: Record<string, unknown>;
  export function readStoredAppointments(): Array<Record<string, unknown>>;
  export function readStoredSettings(): Record<string, unknown> | null;
  export function isHappyHourEnabled(settings: Record<string, unknown>, dateKey: string, time: string): boolean;
  export function getSlotCapacityState(
    appointments: Array<Record<string, unknown>>,
    settings: Record<string, unknown>,
    dateKey: string,
    time: string,
    excludeId?: string
  ): {
    remainingGuests: number;
    totalCapacity: number;
    bookedGuests: number;
    enabledReserveSeats: number;
    time: string;
  };
  export function savePublicBooking(values: {
    clientName: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    guestTickets: Array<{ tariff: string }>;
    selectedExtras?: Array<{ id: string; quantity?: number }> | string[];
    comment?: string;
  }): {
    id: string;
    prepaymentAmount: number;
    remainingAmount: number;
  };
}
