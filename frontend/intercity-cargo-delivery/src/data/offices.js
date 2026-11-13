// Офисы InterCargo — общие для страниц «О компании» и «Контакты»
export const offices = [
  { city: 'Москва', address: 'ул. Ленинская Слобода, 19', phone: '+7 (495) 123-45-67', hours: 'Пн–Пт 9:00–20:00, Сб 10:00–16:00', lat: 55.7099, lon: 37.6544, main: true },
  { city: 'Санкт-Петербург', address: 'Невский пр., 88', phone: '+7 (812) 234-56-78', hours: 'Пн–Пт 9:00–19:00', lat: 59.9322, lon: 30.3485 },
  { city: 'Казань', address: 'ул. Баумана, 45', phone: '+7 (843) 345-67-89', hours: 'Пн–Пт 9:00–19:00', lat: 55.7905, lon: 49.1146 },
  { city: 'Екатеринбург', address: 'ул. Ленина, 52', phone: '+7 (343) 456-78-90', hours: 'Пн–Пт 9:00–19:00', lat: 56.8402, lon: 60.6160 },
  { city: 'Новосибирск', address: 'Красный пр., 100', phone: '+7 (383) 567-89-01', hours: 'Пн–Пт 9:00–19:00', lat: 55.0447, lon: 82.9180 },
  { city: 'Краснодар', address: 'ул. Красная, 176', phone: '+7 (861) 678-90-12', hours: 'Пн–Пт 9:00–19:00', lat: 45.0526, lon: 38.9790 },
];

// Встраиваемая карта OpenStreetMap (бесплатно, без ключей)
export const osmEmbed = ({ lat, lon }, d = 0.006) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d * 1.8},${lat - d},${lon + d * 1.8},${lat + d}&layer=mapnik&marker=${lat},${lon}`;
export const yandexRoute = ({ lat, lon }) => `https://yandex.ru/maps/?rtext=~${lat},${lon}&rtt=auto`;
export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;
