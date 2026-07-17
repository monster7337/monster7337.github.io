"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { requestBookingGate } from "@/components/BookingRulesGate";
import type { BookingTicketId } from "@/lib/bookingCatalog";
import { buildBookingHref } from "@/lib/bookingHref";

type BookingGateButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  defaults?: { ticketId?: BookingTicketId; dateId?: string; time?: string };
};

export default function BookingGateButton({ defaults, onClick, ...props }: BookingGateButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      requestBookingGate(buildBookingHref(defaults));
    }
  };

  return <button {...props} type={props.type ?? "button"} onClick={handleClick} />;
}
