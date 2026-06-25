"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Heart, LayoutGrid, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";
import { useModalImagePreload } from "@/lib/useModalImagePreload";
import { useModalViewportLock } from "@/lib/useModalViewportLock";

type AnimalsProps = {
  onOpenBooking?: () => void;
};

type SpeciesId = "minipigs" | "squirrels";

type AnimalProfile = {
  slug: string;
  name: string;
  species: SpeciesId;
  kind: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  badge: string;
  summary: string;
  description: string;
  likes: string[];
  facts: string[];
};

type SpeciesGroup = {
  id: SpeciesId;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  stats: string;
};

const speciesGroups: SpeciesGroup[] = [
  {
    id: "minipigs",
    title: "Пятачковая команда",
    subtitle: "Микро пиги",
    description: "Мягкие, смешные и очень разные по характеру. Кто-то любит объятия, кто-то пледы, а кто-то бодро собирает вокруг себя всю компанию.",
    coverImage: "/bg/ворчун.webp",
    coverAlt: "Микро пиги антикафе В Ёлках",
    stats: "8 микро пигов",
  },
  {
    id: "squirrels",
    title: "Хвостатая банда",
    subtitle: "Белки и бурундук",
    description: "Ласковые верхолазы, ловкие искатели орешков и настоящие звезды живых кадров. У каждого свой темп общения и свое настроение.",
    coverImage: "/bg/малыш.webp",
    coverAlt: "Белки антикафе В Ёлках",
    stats: "14 хвостатых жителей",
  },
];

const animals: AnimalProfile[] = [
  {
    slug: "vorchun",
    name: "Ворчун",
    species: "minipigs",
    kind: "Микро пиг",
    image: "/bg/ворчун.webp",
    imageAlt: "Микро пиг Ворчун в антикафе В Ёлках",
    imagePosition: "center 0%",
    badge: "Король пятачков",
    summary: "Крупный, смелый и очень уверенный в себе поросенок.",
    description: "Ворчун любит быть в центре внимания и быстро превращает знакомство в веселое шоу. Особенно охотно выходит к тем, у кого в руках вкусняшки, и легко показывает свой фирменный характер.",
    likes: ["ходить на задних лапах за угощение", "целоваться с гостями", "собирать вокруг себя внимание"],
    facts: ["самый крупный поросенок в компании", "самый наглый и уверенный", "быстро понимает, где его угощают"],
  },
  {
    slug: "chunya",
    name: "Чуня",
    species: "minipigs",
    kind: "Микро пиг",
    image: "/bg/чуня.webp",
    imageAlt: "Микро пиг Чуня в антикафе В Ёлках",
    imagePosition: "center 34%",
    badge: "Та еще модница",
    summary: "Нежная девчонка с любовью к украшениям и вечным приключениям.",
    description: "Чуня похожа на настоящую маленькую леди: любит все блестящее, подвески и браслетики. При этом умудряется постоянно испачкать моську в чем-нибудь интересном, из-за чего становится еще очаровательнее.",
    likes: ["украшения и подвески", "браслетики и блестящие детали", "нежное внимание гостей"],
    facts: ["настоящая девчонка по характеру", "часто пачкает моську", "одна из самых запоминающихся микро пигов"],
  },
  {
    slug: "tigra",
    name: "Тигра",
    species: "minipigs",
    kind: "Микро пиг",
    image: "/bg/тигра.webp",
    imageAlt: "Микро пиг Тигра в антикафе В Ёлках",
    imagePosition: "center 60%",
    badge: "Заботливая душа",
    summary: "Теплая и спокойная девочка, которая любит быть рядом.",
    description: "Тигра нежно относится к малышам и часто сама приходит на руки, если чувствует спокойную атмосферу. С ней особенно легко ловить ощущение уюта и доверия.",
    likes: ["ухаживать за маленькими поросятами", "приходить на руки самой", "тихое и ласковое общение"],
    facts: ["очень заботливая", "сама выбирает контакт с гостями", "хорошо чувствует мягкое настроение вокруг"],
  },
  {
    slug: "motamota",
    name: "Мота Мота",
    species: "minipigs",
    kind: "Микро пиг",
    image: "/bg/мотамота.webp",
    imageAlt: "Микро пиг Мота Мота в антикафе В Ёлках",
    badge: "Самый скромный",
    summary: "Тихий поросенок, который любит мягкость и спокойствие.",
    description: "Мота Мота не спешит сразу в центр событий и чаще выбирает уютное знакомство без шума. Особенно любит зарываться в пледик и устраивать себе маленькое безопасное гнездышко.",
    likes: ["зарываться в пледик", "тихие уголки", "спокойное знакомство без спешки"],
    facts: ["самый скромный поросенок", "любит мягкие ткани", "раскрывается в тихой обстановке"],
  },
  {
    slug: "persik",
    name: "Персик",
    species: "minipigs",
    kind: "Микро пиг",
    image: "/bg/персик.webp",
    imageAlt: "Микро пиг Персик в антикафе В Ёлках",
    imagePosition: "center 70%",
    badge: "Нежная звездочка",
    summary: "Очень милая и деликатная девочка с мягким характером.",
    description: "Персик быстро очаровывает гостей спокойным взглядом и нежным темпераментом. С ней хочется замедлиться, погладить пятачок и просто побыть рядом чуть дольше.",
    likes: ["ласковые руки", "спокойное внимание", "уютные теплые кадры"],
    facts: ["самая нежная девочка", "очень обаятельная", "отлично подходит для теплых семейных фото"],
  },
  {
    slug: "marti",
    name: "Марти",
    species: "minipigs",
    kind: "Микро пиг",
    image: "/bg/марти.webp",
    imageAlt: "Микро пиг Марти в антикафе В Ёлках",
    badge: "Сильный пятачок",
    summary: "Подвижный, веселый и очень азартный участник любой игры.",
    description: "Марти любит бегать и играть с другими поросятами, а еще обожает бодаться в шутку и показывать силу. С ним визит становится еще живее и смешнее.",
    likes: ["играть с другими поросятами", "бегать по залу", "бодаться и шумно веселиться"],
    facts: ["самый сильный пятачок", "очень любит движение", "заряжает весь визит энергией"],
  },
  {
    slug: "pirat",
    name: "Пират",
    species: "minipigs",
    kind: "Микро пиг",
    image: "/bg/пират.webp",
    imageAlt: "Микро пиг Пират в антикафе В Ёлках",
    imagePosition: "center 25%",
    badge: "Малыш-сплюшка",
    summary: "Молодой и очень спокойный поросенок, которому нравятся руки и тепло.",
    description: "Пират самый младший в своей компании и один из самых расслабленных. Он любит спать на ручках, поэтому с ним особенно легко поймать очень нежный и трогательный момент.",
    likes: ["спать на ручках", "спокойное тепло", "мягкие укрытия и пледы"],
    facts: ["самый младший поросенок", "самый спокойный", "быстро засыпает в уюте"],
  },
  {
    slug: "pumba",
    name: "Пумба",
    species: "minipigs",
    kind: "Микро пиг",
    image: "/bg/пумба.webp",
    imageAlt: "Микро пиг Пумба в антикафе В Ёлках",
    imagePosition: "center 70%",
    badge: "Вечный исследователь",
    summary: "Любознательный поросенок, который не умеет сидеть на месте.",
    description: "Пумба постоянно что-то проверяет, обнюхивает и изучает, поэтому рядом с ним всегда есть движение. Он особенно нравится тем, кто любит наблюдать за живым, активным характером.",
    likes: ["исследовать все вокруг", "быстро менять маршруты", "быть в движении весь визит"],
    facts: ["самый любознательный поросенок", "никогда не сидит на месте", "часто первым идет проверять новое"],
  },
  {
    slug: "malysh",
    name: "Малыш",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/малыш.webp",
    imageAlt: "Белка Малыш в антикафе В Ёлках",
    badge: "Самый молодой",
    summary: "Ласковый, аккуратный и очень трогательный бельчонок.",
    description: "Малыш самый молодой во всей хвостатой банде. Он бережно берет угощение и часто будто благодарит гостя лапкой, легко вызывая улыбку даже у самых серьезных посетителей.",
    likes: ["аккуратно брать угощение", "ласковый контакт", "спокойные руки и мягкое знакомство"],
    facts: ["самый молодой бельчонок", "очень аккуратный", "может гладить руку лапкой в знак благодарности"],
  },
  {
    slug: "barni",
    name: "Барни",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/барни.webp",
    imageAlt: "Белка Барни в антикафе В Ёлках",
    badge: "Крепыш леса",
    summary: "Сильный, плотный и очень заметный парень в своей банде.",
    description: "Барни называют белкой-качком не просто так: он крепкий, собранный и сразу выделяется в компании. Смотрится очень эффектно и часто привлекает внимание уже с первого взгляда.",
    likes: ["уверенно держаться на высоте", "быть ближе к угощению", "активно осматривать гостей"],
    facts: ["самый крепкий парень", "узнаваем по мощной грудке", "очень заметный в кадре"],
  },
  {
    slug: "kira",
    name: "Кира",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/кира.webp",
    imageAlt: "Белка Кира в антикафе В Ёлках",
    imagePosition: "center 38%",
    badge: "Хитрая красотка",
    summary: "Осторожная, умная и очень контактная, если доверилась.",
    description: "Кира не бросается знакомиться сразу, но если вы ей понравились, то слезать с вас уже не захочет. Особенно если у вас еще остались семечки и орешки.",
    likes: ["осторожно присматриваться", "семечки и орехи", "оставаться рядом после доверия"],
    facts: ["не сразу идет на контакт", "может надолго остаться на госте", "очень сообразительная и наблюдательная"],
  },
  {
    slug: "rita",
    name: "Рита",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/рита.webp",
    imageAlt: "Белка Рита в антикафе В Ёлках",
    badge: "Тихая наблюдательница",
    summary: "Скромная девочка, которая любит знакомиться мягко и без спешки.",
    description: "Рита чаще сначала наблюдает со стороны и ждет, когда гость сам подойдет ближе с орешком или семечкой. Для многих именно это делает общение с ней особенно трепетным.",
    likes: ["тихо наблюдать", "подходить после приглашения", "получать вкусный орешек без суеты"],
    facts: ["самая скромная девочка", "не любит спешку", "раскрывается через деликатное внимание"],
  },
  {
    slug: "milli",
    name: "Милли",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/милли.webp",
    imageAlt: "Белка Милли в антикафе В Ёлках",
    badge: "Найдет везде",
    summary: "Активная и ласковая дальневосточная белка с очень живым характером.",
    description: "Если вы понравились Милли, спрятаться от общения уже не получится. В какой бы уголок леса вы ни отошли, она найдет вас и обязательно заберется повыше, чтобы познакомиться ближе.",
    likes: ["активно искать любимых гостей", "забираться на человека", "долгое живое общение"],
    facts: ["очень активная", "при этом очень ласковая", "легко находит гостей по всему залу"],
  },
  {
    slug: "dendi",
    name: "Денди",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/денди.webp",
    imageAlt: "Белка Денди в антикафе В Ёлках",
    badge: "Самый шустрый",
    summary: "Стремительный бельчонок, который обожает движение и скорость.",
    description: "Денди любит бегать в колесе и носиться по кронам, поэтому смотреть на него всегда очень интересно. Он добавляет в пространство ощущение настоящего живого леса.",
    likes: ["бегать в колесе", "носиться по кронам", "быть в постоянном движении"],
    facts: ["самый шустрый бельчонок", "очень стремительный", "отлично оживляет любой визит"],
  },
  {
    slug: "lavkot",
    name: "Лавкот",
    species: "squirrels",
    kind: "Маньчжурская белка",
    image: "/bg/лавкот.webp",
    imageAlt: "Маньчжурская белка Лавкот в антикафе В Ёлках",
    imagePosition: "center 50%",
    badge: "Курносый осторожка",
    summary: "Общительный, но очень внимательный парень с быстрыми реакциями.",
    description: "Лавкот сам охотно забирается на гостей за вкусняшками, но стоит сделать резкое движение, и он тут же исчезает. Такой характер делает знакомство с ним особенно азартным и живым.",
    likes: ["забираться на гостей", "искать вкусняшки", "контролировать безопасность вокруг"],
    facts: ["маньчжурская белка", "общительный, но осторожный", "моментально реагирует на резкие движения"],
  },
  {
    slug: "lyutyy",
    name: "Лютый",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/лютый.webp",
    imageAlt: "Белка Лютый в антикафе В Ёлках",
    badge: "Парень с характером",
    summary: "Независимый, яркий и очень смешной в своих манерах.",
    description: "Лютый не стремится на руки, но с удовольствием берет вкусняшки, зависая вниз головой с домика или ветки. Наблюдать за ним всегда отдельное удовольствие.",
    likes: ["угоститься эффектно и с высоты", "висеть вниз головой", "оставаться независимым"],
    facts: ["не любит сидеть на руках", "очень характерный", "один из самых забавных по позам"],
  },
  {
    slug: "fibi",
    name: "Фиби",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/фиби.webp",
    imageAlt: "Белка Фиби в антикафе В Ёлках",
    imagePosition: "10% 80%",
    badge: "Своенравная дама",
    summary: "Крупная девочка с переменчивым, но очень живым характером.",
    description: "Фиби то сама лезет почти в руки за вкусняшкой, то сидит и ждет, когда к ней подойдут как положено. В этом и есть ее шарм: она всегда остается собой.",
    likes: ["решать все по настроению", "орешки и угощения", "когда к ней подходят деликатно"],
    facts: ["крупная девочка", "очень своенравная", "умеет удивлять сменой настроения"],
  },
  {
    slug: "ataman",
    name: "Атаман",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/атаман.webp",
    imageAlt: "Белка Атаман в антикафе В Ёлках",
    imagePosition: "center 10%",
    badge: "Главный за порядок",
    summary: "Энергичный задира, который держит хвостатую банду в тонусе.",
    description: "Атаман внимательно следит за обстановкой и любит показывать, кто здесь главный среди парней и девочек. Очень яркий герой для тех, кто любит характерных животных.",
    likes: ["контролировать пространство", "быть главным", "держать всех в тонусе"],
    facts: ["настоящий задира", "очень уверенный", "сильный лидерский характер"],
  },
  {
    slug: "smok",
    name: "Смок",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/смок.webp",
    imageAlt: "Белка Смок в антикафе В Ёлках",
    badge: "Фотогеничный джентльмен",
    summary: "Контактный, воспитанный и один из лучших спутников для красивых кадров.",
    description: "Смок с удовольствием забирается на голову, плечо или ладонь, пока гости делают фото на память. Он очень спокойно ведет себя рядом с человеком и легко идет на контакт.",
    likes: ["сидеть на голове и плече", "красивые фотографии", "долгое общение на руках"],
    facts: ["один из самых контактных", "очень воспитанный", "идеален для памятных кадров"],
  },
  {
    slug: "richi",
    name: "Ричи",
    species: "squirrels",
    kind: "Белка",
    image: "/card-photo-drops/ричи.webp",
    imageAlt: "Белка Ричи в антикафе В Ёлках",
    imagePosition: "center 30%",
    badge: "Любитель прокатиться",
    summary: "Очень ручной парень, который любит сидеть на гостях и общаться без пауз.",
    description: "Ричи один из самых ручных белок в команде. Он обожает кататься верхом на гостях, зависать на плече и оставаться рядом столько, сколько можно.",
    likes: ["сидеть на гостях верхом", "долго не слезать с рук", "плотное общение почти без пауз"],
    facts: ["один из трех самых ручных", "очень любит контакт", "почти не хочет заканчивать общение"],
  },
  {
    slug: "lesobelka",
    name: "Лесобелка",
    species: "squirrels",
    kind: "Белка",
    image: "/bg/лесобелка.webp",
    imageAlt: "Белка Лесобелка в антикафе В Ёлках",
    imagePosition: "center 20%",
    badge: "Искатель тайников",
    summary: "Ласковая и очень общительная белка с настоящим талантом искать орешки.",
    description: "Лесобелка любит кататься на гостях, проверять карманы и искать там что-нибудь вкусное. С ней всегда много движения, смеха и неожиданных маленьких находок.",
    likes: ["обыскивать карманы", "кататься верхом на гостях", "искать припрятанные орехи"],
    facts: ["очень ласковая", "очень общительная", "обожает искать вкусное у гостей"],
  },
  {
    slug: "vasilisa",
    name: "Василиса",
    species: "squirrels",
    kind: "Бурундук",
    image: "/bg/василиса.webp",
    imageAlt: "Бурундук Василиса в антикафе В Ёлках",
    imagePosition: "center 30%",
    badge: "Хозяйка кладовой",
    summary: "Любопытная и ручная девочка, которая любит делать запасы.",
    description: "Василиса с интересом исследует гостей и пространство вокруг, а потом деловито тащит добычу в свою дуплянку. В ее поведении всегда много очаровательной суеты.",
    likes: ["таскать запасы в дуплянку", "исследовать новые запахи", "быть рядом с угощениями"],
    facts: ["любит внимание", "очень ручная", "невероятно любопытная"],
  },
];

const allAnimalImageUrls = animals.map((animal) => animal.image);

function SpeciesCard({
  group,
  count,
  onOpen,
}: {
  group: SpeciesGroup;
  count: number;
  onOpen: (speciesId: SpeciesId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(group.id)}
      className="group relative overflow-hidden rounded-[28px] border border-[rgba(236,222,187,.3)] bg-[rgba(255,255,255,.08)] text-left shadow-[0_20px_44px_rgba(0,0,0,.24)]"
    >
      <div className="absolute inset-0">
        <Image
          src={group.coverImage}
          alt={group.coverAlt}
          fill
          unoptimized
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,11,.08),rgba(8,18,11,.78)_68%,rgba(8,18,11,.94))]" />
      </div>

      <div className="relative z-10 flex min-h-[280px] flex-col justify-between p-5 sm:min-h-[360px] sm:justify-end sm:p-7">
        <div className="sm:hidden" />
        <div>
        <div className="inline-flex w-fit rounded-full border border-[#dcc892]/22 bg-[rgba(255,255,255,.08)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#f6edd7]">
          {group.subtitle}
        </div>
        <h3 className="mt-3 text-[1.55rem] font-black leading-[1.02] text-[#f8f0dd] sm:text-[2.35rem]">{group.title}</h3>
        <p className="mt-3 max-w-none text-[0.92rem] leading-[1.58] text-[#efe4c8]/86 sm:max-w-[32rem] sm:text-[1rem]">{group.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#dcc892]/18 bg-[rgba(255,255,255,.06)] px-3 py-1 text-[0.74rem] font-semibold text-[#f6edd7]">
              {group.stats}
            </span>
            <span className="rounded-full border border-[#a7c873]/28 bg-[rgba(122,166,74,.16)] px-3 py-1 text-[0.74rem] font-semibold text-[#dbe8be]">
              {count} карточек
            </span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dcc892]/18 bg-[rgba(255,255,255,.06)] px-3 py-1.5 text-[0.78rem] font-bold text-[#f6edd7]">
            Открыть
            <ArrowRight size={16} />
          </span>
        </div>
        </div>
      </div>
    </button>
  );
}

export default function Animals({ onOpenBooking }: AnimalsProps) {
  const [activeSpecies, setActiveSpecies] = useState<SpeciesId | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const reveal = useScrollRevealMotion({ amount: 0.18, desktopDelayStep: 0.06, desktopDistance: 10 });

  const animalsBySpecies = useMemo(
    () => ({
      minipigs: animals.filter((animal) => animal.species === "minipigs"),
      squirrels: animals.filter((animal) => animal.species === "squirrels"),
    }),
    []
  );

  const activeGroup = activeSpecies ? speciesGroups.find((group) => group.id === activeSpecies) ?? null : null;
  const activeAnimals = activeSpecies ? animalsBySpecies[activeSpecies] : [];
  const activeIndex = activeSlug ? activeAnimals.findIndex((animal) => animal.slug === activeSlug) : -1;
  const activeAnimal = activeIndex >= 0 ? activeAnimals[activeIndex] : null;

  function openSpecies(speciesId: SpeciesId) {
    setActiveSpecies(speciesId);
    setActiveSlug(null);
  }

  function closeModal() {
    setActiveSlug(null);
    setActiveSpecies(null);
  }

  function closeDetailToGrid() {
    setActiveSlug(null);
  }

  function openAnimal(slug: string) {
    setActiveSlug(slug);
  }

  function showPrevious() {
    if (!activeAnimals.length) return;

    setActiveSlug((currentSlug) => {
      const currentIndex = activeAnimals.findIndex((animal) => animal.slug === currentSlug);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex - 1 + activeAnimals.length) % activeAnimals.length;
      return activeAnimals[nextIndex]?.slug ?? null;
    });
  }

  function showNext() {
    if (!activeAnimals.length) return;

    setActiveSlug((currentSlug) => {
      const currentIndex = activeAnimals.findIndex((animal) => animal.slug === currentSlug);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % activeAnimals.length;
      return activeAnimals[nextIndex]?.slug ?? null;
    });
  }

  function openBookingFromModal() {
    closeModal();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        onOpenBooking?.();
      });
    });
  }

  useModalViewportLock({
    isOpen: activeSpecies !== null,
    onClose: activeAnimal ? closeDetailToGrid : closeModal,
    onPrevious: activeAnimal ? showPrevious : undefined,
    onNext: activeAnimal ? showNext : undefined,
  });

  useModalImagePreload({
    urls: allAnimalImageUrls,
    isOpen: activeSpecies !== null,
    activeIndex: activeAnimal ? animals.findIndex((animal) => animal.slug === activeAnimal.slug) : 0,
    immediateRadius: 1,
    preloadAll: false,
  });

  return (
    <>
      <section id="animals" className="forest-section py-12 sm:py-14" style={{ backgroundImage: "url('/bg/grass1.webp')" }}>
        <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

        <div className="container-x section-content">
          <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Наши животные</h2>
          <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
            Сначала выберите компанию, с которой хотите познакомиться поближе. Внутри каждого раздела откроется отдельная галерея по виду, а уже оттуда можно перейти к карточке конкретного жителя.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {speciesGroups.map((group, index) => (
              <motion.div key={group.id} {...reveal(index)} whileHover={{ y: -3 }}>
                <SpeciesCard group={group} count={animalsBySpecies[group.id].length} onOpen={openSpecies} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeSpecies && activeGroup ? (
          <motion.div className="fixed inset-0 z-[90] p-2 sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className="absolute inset-0 bg-[rgba(4,10,7,.86)] backdrop-blur-[8px]" onClick={closeModal} aria-label="Закрыть модальное окно" />

            {!activeAnimal ? (
              <motion.div
                className="relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[#dcc892]/35 bg-[rgba(7,17,11,.97)] shadow-[0_30px_90px_rgba(0,0,0,.48)]"
                initial={{ opacity: 0, scale: 0.97, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 14 }}
                transition={{ duration: 0.24 }}
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#dcc892]/18 px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                  <div>
                    <div className="inline-flex rounded-full border border-[#dcc892]/18 bg-[rgba(255,255,255,.05)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">
                      {activeGroup.subtitle}
                    </div>
                    <h3 className="mt-3 text-[1.42rem] font-black text-[#f8f0dd] sm:text-[2rem]">{activeGroup.title}</h3>
                    <p className="mt-2 max-w-3xl text-[0.86rem] leading-[1.5] text-[#efe4c8]/82 sm:text-[0.96rem]">{activeGroup.description}</p>
                  </div>

                  <button
                    type="button"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dcc892]/26 bg-[rgba(255,255,255,.08)] text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.12)] sm:h-11 sm:w-11"
                    onClick={closeModal}
                    aria-label="Закрыть"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {activeAnimals.map((animal) => (
                      <button
                        key={animal.slug}
                        type="button"
                        onClick={() => openAnimal(animal.slug)}
                        className="group overflow-hidden rounded-[22px] border border-[rgba(236,222,187,.22)] bg-[rgba(255,255,255,.06)] text-left shadow-[0_14px_30px_rgba(0,0,0,.22)]"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={animal.image}
                            alt={animal.imageAlt}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                            style={animal.imagePosition ? { objectPosition: animal.imagePosition } : undefined}
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,18,11,.52))]" />
                          <span className="absolute right-2 top-2 rounded-full border border-[#dcc892]/24 bg-[rgba(8,16,11,.68)] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[#f6edd7]">
                            {animal.kind}
                          </span>
                        </div>
                        <div className="px-3 pb-3 pt-3">
                          <div className="text-[0.95rem] font-black text-[#f8f0dd]">{animal.name}</div>
                          <div className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#e8d9b4]">{animal.badge}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#dcc892]/18 bg-[rgba(8,18,11,.96)] px-4 py-3 sm:px-6 sm:py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[0.84rem] text-[#efe4c8]/82">
                      <LayoutGrid size={16} />
                      {activeAnimals.length} карточек в этом разделе
                    </div>
                    {onOpenBooking ? (
                      <button type="button" className="btn-forest min-h-[44px] px-4" onClick={openBookingFromModal}>
                        <CalendarDays size={18} />
                        <span className="ml-2">Записаться</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[#dcc892]/35 bg-[rgba(7,17,11,.97)] shadow-[0_30px_90px_rgba(0,0,0,.48)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)]"
                initial={{ opacity: 0, scale: 0.97, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 14 }}
                transition={{ duration: 0.24 }}
              >
                <div className="relative h-[38svh] min-h-[260px] border-b border-[#dcc892]/18 lg:h-full lg:min-h-full lg:border-b-0 lg:border-r">
                  <Image
                    src={activeAnimal.image}
                    alt={activeAnimal.imageAlt}
                    fill
                    unoptimized
                    priority
                    sizes="(min-width: 1024px) 54vw, 100vw"
                    className="object-cover"
                    style={activeAnimal.imagePosition ? { objectPosition: activeAnimal.imagePosition } : undefined}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,18,11,.18))]" />
                </div>

                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3 border-b border-[#dcc892]/18 px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                    <div className="pr-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-[#dcc892]/18 bg-[rgba(255,255,255,.05)] px-3 py-1.5 text-[0.72rem] font-semibold text-[#f6edd7]"
                        onClick={closeDetailToGrid}
                      >
                        <ArrowLeft size={15} />
                        К галерее вида
                      </button>
                      <div className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">{activeGroup.title}</div>
                      <h3 className="mt-2 text-[1.52rem] font-black text-[#f8f0dd] sm:text-[2.1rem]">{activeAnimal.name}</h3>
                      <p className="mt-2 text-[0.84rem] font-semibold text-[#dbe8be]">{activeAnimal.badge}</p>
                    </div>

                    <button
                      type="button"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dcc892]/26 bg-[rgba(255,255,255,.08)] text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.12)] sm:h-11 sm:w-11"
                      onClick={closeModal}
                      aria-label="Закрыть"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
                    <p className="text-[0.9rem] leading-[1.55] text-[#f6edd7]">{activeAnimal.summary}</p>
                    <p className="mt-3 text-[0.86rem] leading-[1.55] text-[#efe4c8]/82">{activeAnimal.description}</p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="glass-leaf-card p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#f6edd7]">
                          <Heart size={16} />
                          Любит
                        </div>
                        <ul className="mt-3 space-y-2 text-[0.84rem] leading-5 text-[#efe4c8]/82 sm:text-sm sm:leading-6">
                          {activeAnimal.likes.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#d8c07d]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="glass-leaf-card p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#f6edd7]">
                          <Sparkles size={16} />
                          Что запомнится
                        </div>
                        <ul className="mt-3 space-y-2 text-[0.84rem] leading-5 text-[#efe4c8]/82 sm:text-sm sm:leading-6">
                          {activeAnimal.facts.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8cb85b]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#dcc892]/18 bg-[rgba(8,18,11,.96)] px-3 py-3 sm:px-6 sm:py-4">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#dcc892]/22 bg-[rgba(255,255,255,.05)] px-3 py-3 text-sm font-semibold text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.1)]"
                        onClick={showPrevious}
                      >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Назад</span>
                      </button>

                      <div className="text-center text-[0.88rem] font-bold whitespace-nowrap text-[#f6edd7] sm:text-sm">
                        {activeIndex + 1} / {activeAnimals.length}
                      </div>

                      <button
                        type="button"
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#dcc892]/22 bg-[rgba(255,255,255,.05)] px-3 py-3 text-sm font-semibold text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.1)]"
                        onClick={showNext}
                      >
                        <span className="hidden sm:inline">Вперед</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>

                    {onOpenBooking ? (
                      <button type="button" className="btn-forest mt-2 min-h-[46px] w-full sm:mt-3" onClick={openBookingFromModal}>
                        <CalendarDays size={18} />
                        Записаться на визит
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
