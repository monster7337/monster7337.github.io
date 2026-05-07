"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Pricing from "@/components/sections/Pricing";
import Animals from "@/components/sections/Animals";
import VisitFlow from "@/components/sections/VisitFlow";
import AnimalRules from "@/components/sections/AnimalRules";
import Gallery from "@/components/sections/Gallery";
import Reviews from "@/components/sections/Reviews";
import BookingPlanner from "@/components/sections/BookingPlanner";
import Contacts from "@/components/sections/Contacts";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/Footer";
import { BookingTicketId } from "@/lib/bookingCatalog";

type BookingPreset = {
  ticketId?: BookingTicketId;
  dateId?: string;
  time?: string;
  nonce: number;
};

export default function Page() {
  const [bookingPreset, setBookingPreset] = useState<BookingPreset>({ nonce: 0 });

  const scrollToBooking = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openBooking = (nextDefaults?: { ticketId?: BookingTicketId; dateId?: string; time?: string }) => {
    if (nextDefaults?.ticketId || nextDefaults?.dateId || nextDefaults?.time) {
      setBookingPreset((current) => ({
        ticketId: nextDefaults.ticketId,
        dateId: nextDefaults.dateId,
        time: nextDefaults.time,
        nonce: current.nonce + 1,
      }));
    }

    scrollToBooking();
  };

  return (
    <main>
      <Navbar onOpenBooking={() => openBooking()} />
      <Hero onOpenBooking={() => openBooking()} />
      <About />
      <Pricing onOpenBooking={openBooking} />
      <Animals onOpenBooking={() => openBooking()} />
      <VisitFlow />
      <AnimalRules />
      <Gallery onOpenBooking={() => openBooking()} />
      <Reviews />
      <BookingPlanner
        key={bookingPreset.nonce}
        initialTicketId={bookingPreset.ticketId}
        initialDateId={bookingPreset.dateId}
        initialTime={bookingPreset.time}
      />
      <Contacts />
      <FAQ />
      <Footer />
    </main>
  );
}
