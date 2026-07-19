import BookingGateButton from "@/components/BookingGateButton";

export default function Hero() {
  return (
    <section className="forest-section min-h-[100svh] border-t-0 sm:min-h-[calc(100svh-80px)]">
      <div className="absolute inset-0 overflow-hidden">
        <picture className="block h-full w-full">
          <source media="(min-width: 640px)" srcSet="/bg/hero.avif" type="image/avif" />
          <source media="(min-width: 640px)" srcSet="/bg/hero.webp" type="image/webp" />
          <source srcSet="/bg/heromobile.avif" type="image/avif" />
          <img
            data-site-hero
            src="/bg/heromobile.webp"
            alt='Антикафе "В Ёлках"'
            width={941}
            height={1672}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[50%_12%] sm:-translate-x-[1%] sm:-translate-y-[2%] sm:scale-[1.08] sm:object-[52%_50%]"
          />
        </picture>
      </div>

      <div className="forest-overlay bg-[rgba(7,17,10,.26)] sm:bg-[rgba(7,17,10,.36)]" />

      <div className="container-x section-content flex min-h-[100svh] flex-col justify-end pb-[148px] pt-24 sm:min-h-[calc(100svh-80px)] sm:justify-center sm:pb-10 sm:pt-10">
        <div className="mx-auto w-full max-w-[360px] sm:max-w-[460px]">
          <div className="mx-auto rounded-[22px] border border-[rgba(236,222,187,.18)] bg-[rgba(9,23,14,.12)] px-3 py-3 text-center shadow-[0_18px_42px_rgba(0,0,0,.20)] backdrop-blur-[6px] sm:rounded-[24px] sm:px-5 sm:py-4">
            <p className="text-[8px] font-bold tracking-[0.14em] text-[#e7dbbb]/80 sm:text-[11px] sm:tracking-[0.18em] sm:text-[#e7dbbb]/82">
              ИДЕАЛЬНОЕ МЕСТО ДЛЯ ОТДЫХА С СЕМЬЁЙ И ДРУЗЬЯМИ
            </p>

            <h1 className="mt-2 text-[1.12rem] font-black leading-[1.04] tracking-tight text-[#f6efde] drop-shadow-[0_2px_12px_rgba(0,0,0,.45)] sm:text-[1.88rem] sm:leading-[1.04]">
              <span className="sm:hidden">Антикафе с белками и минипигами «В Ёлках»</span>
              <span className="hidden sm:inline">Антикафе с белками и минипигами «В Ёлках»</span>
            </h1>

            <p className="mx-auto mt-2 max-w-[228px] text-[0.68rem] font-semibold leading-[1.32] text-[#ffefc8]/90 sm:mt-3 sm:max-w-[410px] sm:text-[0.9rem] sm:font-bold sm:text-[#ffefc8]/94">
              <span className="sm:hidden">ВНИМАНИЕ! ПОСЕЩЕНИЕ АНТИКАФЕ СТРОГО ПО ПРЕДВАРИТЕЛЬНОЙ ЗАПИСИ!</span>
              <span className="hidden sm:inline">ВНИМАНИЕ! ПОСЕЩЕНИЕ АНТИКАФЕ СТРОГО ПО ПРЕДВАРИТЕЛЬНОЙ ЗАПИСИ!</span>
            </p>

            <div className="mt-3 grid gap-2 sm:mt-5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
              <BookingGateButton className="btn-forest min-h-9 w-full px-4 text-[0.92rem] sm:min-h-10 sm:min-w-36 sm:w-auto sm:text-sm">
                Онлайн-запись
              </BookingGateButton>
              <a className="btn-cream min-h-9 w-full px-4 text-[0.92rem] sm:min-h-10 sm:min-w-36 sm:w-auto sm:text-sm" href="#about">
                Узнать больше
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
