import { File } from 'megajs';
import path from 'path';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    try {
        if (!args[0]) return m.reply(`Ingresa el id y el capitulo del anime Ej:dragon-ball-z 10`);
        const animeId = args[0];
        const episode = args[1] || 1;
        const apiUrl = `https://animeflvapi.vercel.app/download/anime/${animeId}/${episode}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error al obtener datos de la API');
        const { servers } = await response.json();
        const megaLink = servers[0].find(server => server.server === 'mega').url;
        if (!megaLink) throw new Error('No se encontró el enlace de MEGA ');
        const file = File.fromURL(megaLink);
        await file.loadAttributes();
        if (file.size >= 300000000) return m.reply('Error: El archivo es grande (Máximo tamaño: 300MB)');
        await m.reply("Descargando No envies de nuevo el comando o te baneo")
        const caption = `*_DEѕCαRɢαѕ αɴιмE ғLV нD..._*\nɴᴏᴍʙʀᴇ: ${file.name}\nᴛᴀᴍᴀÑᴏ: ${formatBytes(file.size)}`;
        const dataBuffer = await file.downloadBuffer();
        const fileExtension = path.extname(file.name).toLowerCase();
        const mimeTypes = {
            ".mp4": "video/mp4",
            ".pdf": "application/pdf",
            ".zip": "application/zip",
            ".rar": "application/x-rar-compressed",
            ".7z": "application/x-7z-compressed",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
        };
        const mimetype = mimeTypes[fileExtension] || "application/octet-stream";

        await conn.sendFile(m.chat, dataBuffer, file.name, caption, m, null, { mimetype, asDocument: true });
    } catch (error) {
        return m.reply(`Error: No especifico el anime`);
    }
}
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

handler.help = ['animedl <anime-id> <episode-number>'];
handler.tags = ['downloader'];
handler.command = ['animedl', 'animeflvdl', 'anidl'];
handler.group = true
handler.limit = 15

export default handler;
