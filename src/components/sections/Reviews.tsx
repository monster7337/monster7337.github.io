"use client";

import { Award, Star } from "lucide-react";

const reviewPlatforms = [
  {
    id: "yandex",
    label: "Яндекс",
    mark: "Я",
    rating: "5.0",
    proof: "Реальные отзывы гостей на Яндекс Картах и заметная репутация места перед первой записью.",
    award: "Хорошее место",
  },
  {
    id: "2gis",
    label: "2ГИС",
    mark: "2",
    rating: "5.0",
    proof: "Платформа с сильной репутацией заведения и живыми отзывами гостей о визите.",
    award: "Здесь хорошо",
  },
  {
    id: "vk",
    label: "ВК",
    mark: "VK",
    rating: "5.0",
    proof: "Живые отзывы гостей с подробными впечатлениями о животных, атмосфере и команде.",
    award: "Отзывы гостей",
  },
];

const reviews = [
  {
    platformId: "2gis",
    platform: "2ГИС",
    name: "Надежда Ботнева",
    role: "гостья 2ГИС",
    date: "26.05.2026",
    rating: 5,
    title: "Море эмоций для всей семьи",
    text: '26.05.2026 решили семьей отметить завершение учебного года в новом антикафе "В Ёлках". Второе антикафе от Piggy Land. Теперь еще и очаровательные и шустрые белки разных пород. Мы получили море эмоций: поросятки-малыши быстро засыпают на ручках, белочки ползают по вам, сидят на руках. Все животные контактные и милые. В билеты на посещение включены вкусняшки: чай, кофе, соки, конфеты, печенюшки и ваши фото с фотоаппарата.',
    mobileText: "Семья решила отметить завершение учебного года в новом антикафе \"В Ёлках\" и получила море эмоций. В отзыве особенно отмечены контактные белки и поросятки, которые спокойно сидят на руках, а также приятный бонус в билете: чай, кофе, соки, сладости и фотографии.",
    featured: true,
  },
  {
    platformId: "vk",
    platform: "ВК",
    name: "Дмитрий Родькин",
    role: "отзыв ВК",
    date: "23.05.2026",
    rating: 5,
    title: "Уютно, безопасно и очень мило",
    text: "Очень уютное местечко, приветливый и компетентный персонал, доходчиво объясняют правила общения с животными, техника безопасности соблюдается, неприятные запахи отсутствуют. Поросята милашки, белочки очень общительные, облазили меня с ног до головы, а вершина милоты - это, конечно же, поссумы. Спасибо вам за приятные эмоции и впечатления.",
    mobileText: "Очень уютное место с приветливым и компетентным персоналом, который доходчиво объясняет правила общения с животными и следит за безопасностью. Белочки очень общительные, поросята милые, неприятных запахов нет, а после визита остаются действительно очень приятные эмоции и впечатления.",
  },
  {
    platformId: "yandex",
    platform: "Яндекс",
    name: "Константин Черданцев",
    role: "отзыв на Яндекс Картах",
    date: "27.05.2026",
    rating: 5,
    title: "Очень атмосферное место: запах дерева и хвои",
    text: "Недавно побывали в антикафе «В Ёлках» и остались в полном восторге 🌲Очень атмосферное место: запах дерева и хвои, приглушённый свет, спокойная музыка, ощущение будто приехал в маленький лесной домик. Животные ухоженные, активные и совсем не пугливые. Особенно понравились белочки и минипиги — видно, что с ними занимаются и относятся с любовью. Отдельное спасибо сотрудникам: всё спокойно объяснили, рассказали правила общения с животными, помогли наладить контакт. Никто не торопит, можно спокойно наслаждаться атмосферой и общением с пушистыми жителями 🐿️",
    mobileText: "Очень атмосферное место: запах дерева и хвои, приглушённый свет, спокойная музыка, ощущение будто приехал в маленький лесной домик. Животные ухоженные, активные и совсем не пугливые. Особенно понравились белочки и минипиги",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function platformTone(platformId: string) {
  if (platformId === "yandex") {
    return "bg-[rgba(214,185,104,.18)] text-[#f2dd9f] border-[rgba(214,185,104,.42)]";
  }

  if (platformId === "vk") {
    return "bg-[rgba(104,134,255,.16)] text-[#dbe2ff] border-[rgba(104,134,255,.34)]";
  }

  return "bg-[rgba(119,181,232,.16)] text-[#cae8ff] border-[rgba(119,181,232,.36)]";
}

function avatarTone(platformId: string) {
  if (platformId === "yandex") {
    return "from-[#d7b35d] to-[#8d6a2f] text-[#fff7df]";
  }

  if (platformId === "vk") {
    return "from-[#6d83ff] to-[#445ccf] text-[#f6f8ff]";
  }

  return "from-[#68a9d7] to-[#2f5f8d] text-[#f4fbff]";
}

export default function Reviews() {
  return (
    <section className="forest-section lazy-bg-grass-2 py-12 sm:py-14" data-lazy-background>
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Отзывы</h2>
        <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
          Реальные отзывы гостей и заметные отметки на картах помогают понять атмосферу еще до записи.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
          <aside
            className="rounded-[28px] border border-[rgba(236,222,187,.2)] bg-[linear-gradient(180deg,rgba(18,35,22,.9),rgba(28,48,31,.86))] p-4 text-[#f3ecd8] shadow-[0_24px_60px_rgba(0,0,0,.24)] backdrop-blur-[8px] sm:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#d7c18b]/76">Отзывы и награды</div>
                <h3 className="mt-2 text-[1.35rem] font-black leading-[1.05] text-[#fbf4e4] sm:text-[1.65rem]">Гости возвращаются и советуют нас дальше</h3>
              </div>
              <div className="rounded-[20px] border border-[rgba(223,204,150,.25)] bg-[rgba(244,232,197,.08)] px-3 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                <div className="text-[1.65rem] font-black leading-none text-[#f8f0db]">5.0</div>
                <div className="mt-1 flex items-center justify-center gap-0.5 text-[#c69226]" role="img" aria-label="Рейтинг 5.0 из 5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={13} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-[0.88rem] leading-[1.55] text-[#e7dcc0]/82 sm:text-[0.94rem]">
              На картах гости особенно часто отмечают атмосферу, заботу команды, ухоженных животных и то, что сюда особенно приятно
              приходить с детьми, парой или небольшой компанией.
            </p>

            <div className="mt-4 space-y-3">
              {reviewPlatforms.map((platform) => (
                <article
                  key={platform.id}
                  className="rounded-[22px] border border-[rgba(236,222,187,.16)] bg-[rgba(244,237,218,.08)] p-3.5 shadow-[0_14px_30px_rgba(0,0,0,.14)]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[1rem] font-black ${platformTone(platform.id)}`}
                    >
                      {platform.mark}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-[1rem] font-black text-[#fbf4e2]">{platform.label}</h4>
                        <span className="rounded-full border border-[rgba(231,218,177,.15)] bg-[rgba(246,236,206,.08)] px-2.5 py-1 text-[0.72rem] font-bold text-[#e6d7b1]">{platform.rating}</span>
                      </div>
                      <p className="mt-1 text-[0.8rem] leading-[1.45] text-[#e7dcc0]/82 sm:text-[0.86rem]">{platform.proof}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[rgba(215,194,132,.18)] bg-[rgba(215,194,132,.12)] px-2.5 py-1 text-[0.72rem] font-bold text-[#eddca8]">
                        <Award size={13} />
                        <span>{platform.award}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={`${review.name}-${review.title}`}
                className={`rounded-[28px] border border-[rgba(236,222,187,.22)] bg-[rgba(9,23,14,.56)] p-4 text-[#f6efde] shadow-[0_22px_54px_rgba(0,0,0,.22)] backdrop-blur-[8px] sm:p-5 ${
                  review.featured ? "md:col-span-2 xl:col-span-1" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-black uppercase tracking-[0.14em] ${platformTone(review.platformId)}`}
                  >
                    {review.platform}
                  </span>
                  <div className="flex items-center gap-0.5 text-[#f1c860]" role="img" aria-label={`Рейтинг ${review.rating} из 5`}>
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <Star key={starIndex} size={13} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[0.95rem] font-black shadow-[inset_0_1px_0_rgba(255,255,255,.35)] ${avatarTone(review.platformId)}`}
                  >
                    {getInitials(review.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[0.95rem] font-black text-[#f7efdd]">{review.name}</div>
                    <div className="text-[0.74rem] text-[#dfd0ae]/76">
                      {review.role} - {review.date}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-[1.02rem] font-black leading-[1.22] text-[#fff6e5] sm:text-[1.1rem]">{review.title}</h3>
                  <p className="mt-2 text-[0.84rem] leading-[1.55] text-[#efe4c8]/88 sm:text-[0.92rem]">
                    <span className="sm:hidden">{review.mobileText}</span>
                    <span className="hidden sm:inline">{review.text}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
