import { AtSign, Clock3, MapPin, MessageCircle, Phone, Send } from "lucide-react";

export default function Contacts() {
  return (
    <section
      id="contacts"
      className="forest-section border-b-0 py-10 sm:py-12"
      style={{ backgroundImage: "url('/bg/grass3.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="section-title">Контакты</h2>
            <div className="mt-4 h-px bg-[#efe0bc]/24" />
            <ul className="mt-6 space-y-3 text-[0.98rem] text-[#f2e9d4]/92">
              <li className="flex items-center gap-3">
                <Phone size={17} />
                <a className="hover:text-white" href="tel:+79013294040">
                  +7 (901) 329-40-40
                </a>
              </li>
              <li className="flex items-center gap-3">
                <AtSign size={17} /> @v_elkah
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={17} /> Переулок Гривцова 3, Санкт-Петербург
              </li>
              <li className="flex items-center gap-3">
                <Clock3 size={17} /> Ежедневно с 10:00 до 20:00
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="glass-leaf-card">
              <div className="text-lg font-black text-[#f6efdb]">Ссылки</div>
              <div className="mt-3 space-y-2 text-sm">
                <a
                  className="block rounded-md border border-[#d4c290]/34 bg-[rgba(255,255,255,.07)] px-3 py-2 text-[#efe4c8] hover:border-[#e3d2a4]/58"
                  href="https://t.me/+79013294040"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <Send size={14} /> Telegram: t.me/+79013294040
                  </span>
                </a>
                <a
                  className="block rounded-md border border-[#d4c290]/34 bg-[rgba(255,255,255,.07)] px-3 py-2 text-[#efe4c8] hover:border-[#e3d2a4]/58"
                  href="https://m.vk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle size={14} /> VK: m.vk.com (Антикафе с минипигами)
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-lg border border-[#d8c693]/45 bg-[rgba(12,28,18,.78)] shadow-[0_10px_24px_rgba(0,0,0,.24)] backdrop-blur-md">
              <div className="relative h-[220px]">
                <div className="absolute inset-0 opacity-92">
                  <div className="absolute inset-x-3 top-8 h-3 bg-[#7f9076]/36" />
                  <div className="absolute inset-x-10 top-16 h-3 bg-[#6f8368]/34" />
                  <div className="absolute inset-x-6 top-24 h-3 bg-[#86967d]/32" />
                  <div className="absolute inset-x-12 top-32 h-3 bg-[#74886c]/34" />
                  <div className="absolute inset-x-8 top-40 h-3 bg-[#819177]/30" />
                  <div className="absolute left-20 top-0 bottom-0 w-3 bg-[#7ea1b9]/35" />
                  <div className="absolute left-44 top-0 bottom-0 w-3 bg-[#8aadc4]/35" />
                </div>
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#628a3a] text-[#f3ecd8] shadow-[0_8px_16px_rgba(0,0,0,.22)]">
                  <MapPin size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
