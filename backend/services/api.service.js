import fetch from "node-fetch";
import { formatArtist } from "../helper/formatArtist.js";

const SAAVN_API = "https://jiosaavn-api-vmd8.onrender.com/api";

const cache = new Map();

const getCached = (key) => cache.get(key);
const setCache = (key, data) => {
  cache.set(key, data);
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);
};

export const fetchSongsByQuery = async (query, limit = 10) => {
  const key = `songs:${query}:${limit}`;

  if (getCached(key)) return getCached(key);

  const res = await fetch(
    `${SAAVN_API}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`,
  );

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(
      `Saavn API failed — status: ${res.status}, body: ${errorBody}`,
    );
    throw new Error("Saavn API failed");
  }

  const data = await res.json();
  const results = data?.data?.results || [];

  setCache(key, results);
  return results;
};

export const fetchSongById = async (ids) => {
  const normalized = Array.isArray(ids) ? ids.join(",") : ids;

  if (!normalized) {
    throw new Error("ids missing");
  }
  const key = `songs:${normalized}`;
  if (getCached(key)) return getCached(key);

  const res = await fetch(`${SAAVN_API}/songs?ids=${normalized}`);
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(
      `Saavn API failed — status: ${res.status}, body: ${errorBody}`,
    );
    throw new Error("Saavn API failed");
  }

  const data = await res.json();
  const result = data?.data || [];
  setCache(key, result);
  return result;
};

export const fetchArtistsByQuery = async (query, limit = 10) => {
  const key = `artists:${query}:${limit}`;
  if (getCached(key)) return getCached(key);

  const res = await fetch(
    `${SAAVN_API}/search/artists?query=${encodeURIComponent(query)}&limit=${limit}`,
  );

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(
      `Saavn API failed — status: ${res.status}, body: ${errorBody}`,
    );
    throw new Error("Saavn API failed");
  }

  const data = await res.json();
  const result = data?.data?.results || []; 

  setCache(key, result);
  return result;
};

export const fetchArtistDetails = async (id) => {
  const key = `artist:${id}`;
  if (getCached(key)) return getCached(key);

  const res = await fetch(`${SAAVN_API}/artists?id=${id}`);
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(
      `Saavn API failed — status: ${res.status}, body: ${errorBody}`,
    );
    throw new Error("Saavn API failed");
  }

  const data = await res.json();
  const artist = data?.data;
  if (!artist) return null;

   const formatted = formatArtist(artist);
   console.log(formatted)

  setCache(key, formatted);
  return formatted;
};

export const fetchAlbumsByQuery = async (query, limit = 10) => {
  const key = `albums:${query}:${limit}`;
  if (getCached(key)) return getCached(key);

  const res = await fetch(
    `${SAAVN_API}/search/albums?query=${encodeURIComponent(query)}&limit=${limit}`,
  );

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(
      `Saavn API failed — status: ${res.status}, body: ${errorBody}`,
    );
    throw new Error("Saavn API failed");
  }

  const data = await res.json();
  const results = data?.data?.results || [];

  setCache(key, results);
  return results;
};

export const fetchAlbumById = async (ids) => {
  const normalized = Array.isArray(ids) ? ids.join(",") : ids;

  if (!normalized) {
    throw new Error("ids missing");
  }

  const key = `album:${normalized}`;
  if (getCached(key)) return getCached(key);

  const res = await fetch(`${SAAVN_API}/albums?ids=${normalized}`);
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(
      `Saavn API failed — status: ${res.status}, body: ${errorBody}`,
    );
    throw new Error("Saavn API failed");
  }

  const data = await res.json();
  const result = data?.data || [];
  setCache(key, result);
  return result;
};

export const fetchMultipleAlbumDetails = async (ids) => {
  const idArray = Array.isArray(ids) ? ids : [ids];

  const results = await Promise.all(
    idArray.map(async (id) => {
      const key = `album:${id}`;
      if (getCached(key)) return getCached(key);

      try {
        const res = await fetch(`${SAAVN_API}/albums?id=${id}`);
        if (!res.ok) return null;

        const data = await res.json();
        const album = data?.data;
        if (!album) return null;

        const formatted = {
          id: album.id,
          title: album.name,
          artist:
            album.artists?.all?.[0]?.name ||
            album.songs?.[0]?.artists?.primary?.[0]?.name ||
            "Unknown",
          image: album.image?.[2]?.url,
          songs: album.songs || [],
        };

        setCache(key, formatted);
        return formatted;
      } catch (err) {
        console.error("Album fetch failed:", id);
        return null;
      }
    }),
  );

  return results.filter(Boolean);
};

export const fetchAlbumDetails = async (id) => {
  const key = `album:${id}`;
  if (getCached(key)) return getCached(key);

  const res = await fetch(`${SAAVN_API}/albums?id=${id}`);
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Saavn API failed — status: ${res.status}, body: ${errorBody}`);
    throw new Error("Saavn API failed");
  }

  const data = await res.json();
  const album = data?.data;
  if (!album) return null;

  const formatted = {
    id: album.id,
    title: album.name,
    artist: album.artists?.all?.[0]?.name
      || album.songs?.[0]?.artists?.primary?.[0]?.name
      || "Unknown",
    image: album.image?.[2]?.url,
    songs: album.songs || [],
  };

  setCache(key, formatted);
  return formatted;
};