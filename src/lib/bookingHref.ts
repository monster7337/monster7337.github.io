import { BookingTicketId } from "@/lib/bookingCatalog";

type BookingHrefOptions = {
  ticketId?: BookingTicketId;
  dateId?: string;
  time?: string;
};

export function buildBookingHref(options?: BookingHrefOptions) {
  const params = new URLSearchParams();

  if (options?.ticketId) params.set("ticketId", options.ticketId);
  if (options?.dateId) params.set("dateId", options.dateId);
  if (options?.time) params.set("time", options.time);

  const query = params.toString();
  return query ? `/booking?${query}` : "/booking";
}
