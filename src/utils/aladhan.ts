export interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface AlAdhanHijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string; days?: number };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface AlAdhanResponse {
  code: number;
  status: string;
  data: {
    timings: AlAdhanTimings;
    date: {
      readable: string;
      gregorian: { date: string; format: string; day: string; weekday: { english: string }; month: { number: number; en: string }; year: string };
      hijri: AlAdhanHijriDate;
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: { id: number; name: string };
    };
  };
}

export async function fetchAlAdhanTimings(city = "Mecca", country = "Saudi Arabia", method = 2): Promise<AlAdhanResponse["data"] | null> {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`);
    const json: AlAdhanResponse = await res.json();
    if (json.code === 200 && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.error("AlAdhan API error:", err);
    return null;
  }
}

export async function fetchGregorianToHijri(dateStr = ""): Promise<AlAdhanHijriDate | null> {
  try {
    // date format: DD-MM-YYYY or empty for today
    const queryDate = dateStr || new Date().toLocaleDateString("en-GB").split("/").join("-");
    const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${queryDate}`);
    const json = await res.json();
    if (json.code === 200 && json.data && json.data.hijri) {
      return json.data.hijri;
    }
    return null;
  } catch (err) {
    console.error("AlAdhan GtoH error:", err);
    return null;
  }
}

export async function fetchAlAdhanCalendar(city = "Mecca", country = "Saudi Arabia", month = 3, year = 2026, method = 2): Promise<any[] | null> {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&month=${month}&year=${year}`);
    const json = await res.json();
    if (json.code === 200 && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.error("AlAdhan Calendar API error:", err);
    return null;
  }
}
