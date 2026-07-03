export type BookingTicketId = "social" | "happy-hour" | "family" | "standard";

export type BookingTicket = {
  id: BookingTicketId;
  name: string;
  mobileName: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  viewed: string;
  mobileViewed: string;
  location: string;
  description: string;
  mobileDescription: string;
  details: string;
  note?: string;
  button: "forest" | "cream";
};

export type BookingExtra = {
  id: string;
  title: string;
  description: string;
  price: number;
  note: string;
};

export const BOOKING_CONTACTS = {
  phone: "+7 (901) 329-40-40",
  phoneHref: "tel:+79013294040",
  telegramLabel: "@v_elkah",
  telegramHref: "https://t.me/+79013294040",
  vkLabel: "v_elkah",
  vkHref: "https://vk.com/v_elkah",
  address: "Переулок Гривцова, 3, Санкт-Петербург",
  hours: "Принимаем гостей по записи: 11:00, 13:00, 15:00, 17:00 и 19:00",
  inn: "470706645895",
  ogrn: "325470400025791",
  legalName: "Индивидуальный предприниматель ТЮЧКИН ВЛАДИМИР АЛЕКСАНДРОВИЧ",
  mapImage: "/contacts/grivtsova-map.webp",
  mapHref: "https://2gis.ru/spb/firm/70000001109893075/tab/info",
  note: "Каждый визит длится 1 час. Выберите удобные дату, время и билет для посещения.",
} as const;

export const BOOKING_TICKETS: BookingTicket[] = [
  {
    id: "social",
    name: 'Входной билет "ЛЬГОТНЫЙ"',
    mobileName: "Льготный",
    price: 1000,
    viewed: "Посмотрели 596 человек",
    mobileViewed: "596 просмотров",
    location: BOOKING_CONTACTS.address,
    description:
      "Скидка 33% на входной билет для пенсионеров, участников СВО, инвалидов и именинников + чай, кофе, сок, вода и сладости.",
    mobileDescription: "Для пенсионеров, участников СВО, инвалидов и именинников.",
    details: "Льгота подтверждается документом при посещении. Формат визита тот же: 1 час в антикафе с животными и угощениями.",
    note: "Нужен подтверждающий документ",
    button: "forest",
  },
  {
    id: "happy-hour",
    name: 'Входной билет "СЧАСТЛИВЫЙ ЧАС"',
    mobileName: "Счастливый час",
    price: 1000,
    oldPrice: 1500,
    discount: "-33%",
    viewed: "Посмотрели 632 человека",
    mobileViewed: "632 просмотра",
    location: BOOKING_CONTACTS.address,
    description:
      "Акция на будний визит в слот 11:00 или 13:00 со скидкой 33%: один час общения с белками и минипигами + чай, кофе, сок, вода и сладости.",
    mobileDescription: "Будний визит на 11:00 или 13:00 по сниженной цене.",
    details: "Тариф действует только по будням и только на слоты 11:00 и 13:00. Для других часов выбирайте стандартный, семейный или льготный билет.",
    note: "Только будни в 11:00 и 13:00",
    button: "forest",
  },
  {
    id: "family",
    name: 'Входной билет "СЕМЕЙНЫЙ"',
    mobileName: "Семейный",
    price: 1200,
    oldPrice: 1500,
    discount: "-20%",
    viewed: "Посмотрели 679 человек",
    mobileViewed: "679 просмотров",
    location: BOOKING_CONTACTS.address,
    description:
      "Акция для семьи или компании от 3 человек: цена указана за одного гостя, а сам визит длится 1 час и включает чай, кофе, сок, воду и сладости.",
    mobileDescription: "Акция для семьи или компании от 3 человек: цена указана за одного гостя",
    details: "Семейный тариф считается от трех гостей. Если гостей меньше, лучше выбрать стандартный или льготный билет.",
    note: "Минимум 3 гостя",
    button: "cream",
  },
  {
    id: "standard",
    name: 'Входной билет "СТАНДАРТНЫЙ"',
    mobileName: "Стандартный",
    price: 1500,
    viewed: "Посмотрели 574 человека",
    mobileViewed: "574 просмотра",
    location: BOOKING_CONTACTS.address,
    description:
      "Классический билет на 1 час в антикафе с белками и минипигами. Можно выбрать один из слотов: 15:00, 17:00 или 19:00.",
    mobileDescription: "Классический билет на 1 час в антикафе с белками и минипигами.",
    details: "Базовый тариф без дополнительных условий: подходит для первого визита, пары, семьи и друзей.",
    note: "Любой слот: 15:00, 17:00 и 19:00",
    button: "forest",
  },
];

export const BOOKING_EXTRAS: BookingExtra[] = [
  {
    id: "treat-cup",
    title: "Стаканчик с угощением",
    description: "Безопасные лакомства для белок и минипигов, чтобы покормить животных под присмотром сотрудника.",
    price: 100,
    note: "Подходит к любому визиту",
  },
  {
    id: "bottle-feeding",
    title: "Кормление минипигов с бутылочки",
    description: "Особый формат общения с самыми маленькими пятачками, который обычно особенно нравится детям.",
    price: 400,
    note: "Добавляется по желанию",
  },
];

export function formatCurrency(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}
