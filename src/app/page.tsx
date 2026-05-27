"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Pricing from "@/components/sections/Pricing";
import Animals from "@/components/sections/Animals";
import VisitFlow from "@/components/sections/VisitFlow";
import AnimalRules from "@/components/sections/AnimalRules";
import Gallery from "@/components/sections/Gallery";
import Reviews from "@/components/sections/Reviews";
import Contacts from "@/components/sections/Contacts";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/Footer";
import { BookingTicketId } from "@/lib/bookingCatalog";
import { buildBookingHref } from "@/lib/bookingHref";

export default function Page() {
  const router = useRouter();

  const openBooking = (nextDefaults?: { ticketId?: BookingTicketId; dateId?: string; time?: string }) => {
    router.push(buildBookingHref(nextDefaults));
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
      <Contacts />
      <FAQ />
      <Footer />
    </main>
  );
}
