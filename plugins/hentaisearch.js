import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📥 *Ingresa el nombre del anime*\n\nEjemplo:\n${usedPrefix + command} Naruto`);

  try {
    const res = await axios.get(`https://animeflvapi.vercel.app/search?text=${encodeURIComponent(text)}`);
    const results = res.data.results;

    if (!results || results.length === 0) return m.reply('❌ No se encontraron resultados.');

    let list = results.slice(0, 5); // Máximo 5 resultados

    for (const anime of list) {
      let caption = `🎬 *${anime.title}*\n`;
      caption += `📦 Tipo: ${anime.type}\n`;
      caption += `🆔 ID: ${anime.id}`;

      await conn.sendMessage(m.chat, {
        image: { url: anime.poster },
        caption,
        buttons: [
          {
            buttonId: `.animedl ${anime.id}`,
            buttonText: { displayText: `📥 Ver Episodios` },
            type: 1
          }
        ],
        headerType: 4
      }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al buscar el anime. Intenta más tarde.');
  }
};

handler.command = /^animesearch$/i;
export default handler;
