"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import VisitFlow from "@/components/sections/VisitFlow";
import AnimalRules from "@/components/sections/AnimalRules";
import Animals from "@/components/sections/Animals";
import Pricing from "@/components/sections/Pricing";
import Gallery from "@/components/sections/Gallery";
import Reviews from "@/components/sections/Reviews";
import FAQ from "@/components/sections/FAQ";
import BookingPlanner from "@/components/sections/BookingPlanner";
import Contacts from "@/components/sections/Contacts";
import BookingModal from "@/components/BookingModal";
import Footer from "@/components/Footer";
import { DEFAULT_BOOKING_DATE, DEFAULT_BOOKING_TIME } from "@/lib/bookingOptions";

export default function Page() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<string>(DEFAULT_BOOKING_DATE);
  const [bookingTime, setBookingTime] = useState<string>(DEFAULT_BOOKING_TIME);

  const openBooking = (nextDefaults?: { date?: string; time?: string }) => {
    if (nextDefaults?.date) setBookingDate(nextDefaults.date);
    if (nextDefaults?.time) setBookingTime(nextDefaults.time);
    setBookingOpen(true);
  };

  return (
    <main>
      <Navbar onOpenBooking={() => openBooking()} />
      <Hero onOpenBooking={() => openBooking()} />
      <About />
      <VisitFlow />
      <AnimalRules />
      <Animals />
      <Pricing onOpenBooking={() => openBooking()} />
      <Gallery onOpenBooking={() => openBooking()} />
      <Reviews />
      <FAQ />
      <BookingPlanner onOpenBooking={openBooking} />
      <Contacts />
      <Footer />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        date={bookingDate}
        time={bookingTime}
        onDateChange={setBookingDate}
        onTimeChange={setBookingTime}
      />
    </main>
  );
}
