import axios from 'axios';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return m.reply('❌ Ingresa el nombre del anime que deseas buscar.');

  try {
    let res = await axios.get(`https://animeflvapi.vercel.app/search?text=${encodeURIComponent(text)}`);
    let results = res.data.results;

    if (!results || results.length === 0) {
      return m.reply('❌ No se encontraron resultados para tu búsqueda.');
    }

    let messages = [];

    for (let i = 0; i < results.length && i < 10; i++) {
      let anime = results[i];
      let desc = anime.synopsis?.trim() || 'Sin sinopsis disponible.';
      if (desc.length > 400) desc = desc.slice(0, 380) + '...';

      messages.push([
        `🎌 *${anime.title}*`,
        `📝 *Sinopsis:* ${desc}`,
        anime.poster || 'https://telegra.ph/file/ec725de5925f6fb4d5647.jpg',
        [],
        [[`${usedPrefix}animedl ${anime.id}`]],
        [],
        []
      ]);
    }

    await conn.sendCarousel(
      m.chat,
      `🔎 Resultados para: *${text}*`,
      '',
      '📺 Resultados encontrados',
      messages,
      m
    );
  } catch (e) {
    console.error(e);
    return m.reply('⚠️ Error al buscar anime. La API puede estar caída o el formato cambió.');
  }
};

handler.command = /^\.?animesearch$/i;
export default handler;
