const METAR_API_URL = process.env.NEXT_PUBLIC_METAR_API_URL || '';

export interface MetarData {
  icao: string;
  raw: string;
  timestamp: string;
}

export interface TafData {
  icao: string;
  raw: string;
  timestamp: string;
}

export interface MetarTafResponse {
  metar?: MetarData;
  taf?: TafData;
  error?: string;
}

// Convert IATA to ICAO (simplified - in production use a proper database)
const iataToIcao: Record<string, string> = {
  // Mexico
  MEX: 'MMMX',
  GDL: 'MMGL',
  MTY: 'MMMY',
  CUN: 'MMUN',
  TIJ: 'MMTJ',
  // USA
  LAX: 'KLAX',
  JFK: 'KJFK',
  MIA: 'KMIA',
  ORD: 'KORD',
  DFW: 'KDFW',
  ATL: 'KATL',
  SFO: 'KSFO',
  // Europe
  LHR: 'EGLL',
  CDG: 'LFPG',
  FRA: 'EDDF',
  AMS: 'EHAM',
  MAD: 'LEMD',
  BCN: 'LEBL',
  // Add more as needed
};

export function convertIataToIcao(iata: string): string {
  const upper = iata.toUpperCase().trim();
  // If already ICAO (4 chars), return as-is
  if (upper.length === 4) return upper;
  // Try to convert from IATA
  return iataToIcao[upper] || upper;
}

// Fetch METAR/TAF for an airport
export async function fetchMetarTaf(iataOrIcao: string): Promise<MetarTafResponse> {
  const icao = convertIataToIcao(iataOrIcao);

  if (!METAR_API_URL) {
    return {
      error: 'METAR API not configured. Please set NEXT_PUBLIC_METAR_API_URL',
    };
  }

  try {
    const response = await fetch(`${METAR_API_URL}?icao=${icao}`);

    if (!response.ok) {
      throw new Error('Failed to fetch METAR/TAF');
    }

    return await response.json();
  } catch (error) {
    console.error('METAR fetch error:', error);
    return {
      error: 'No se pudo obtener METAR/TAF. Verifica tu conexión.',
    };
  }
}

// Fetch METAR/TAF for multiple airports
export async function fetchMultipleMetarTaf(
  airports: string[]
): Promise<Record<string, MetarTafResponse>> {
  const results: Record<string, MetarTafResponse> = {};

  await Promise.all(
    airports.map(async (airport) => {
      results[airport] = await fetchMetarTaf(airport);
    })
  );

  return results;
}

// Parse basic METAR info (simplified)
export function parseMetarBasics(rawMetar: string): {
  visibility?: string;
  ceiling?: string;
  wind?: string;
  conditions?: string;
} {
  const parts = rawMetar.split(' ');
  const result: {
    visibility?: string;
    ceiling?: string;
    wind?: string;
    conditions?: string;
  } = {};

  for (const part of parts) {
    // Wind (e.g., 27015KT, 27015G25KT)
    if (/^\d{5}(G\d{2,3})?(KT|MPS)$/.test(part)) {
      result.wind = part;
    }
    // Visibility in SM (e.g., 10SM, 3SM, 1/2SM)
    if (/^\d+\/?(\d+)?SM$/.test(part) || /^P?\d+SM$/.test(part)) {
      result.visibility = part;
    }
    // Cloud layers (e.g., BKN025, OVC010)
    if (/^(FEW|SCT|BKN|OVC|VV)\d{3}/.test(part)) {
      if (!result.ceiling && /^(BKN|OVC|VV)/.test(part)) {
        result.ceiling = part;
      }
    }
    // Weather phenomena
    if (/^(-|\+)?(RA|SN|TS|FG|BR|HZ|DZ|SH|GR)/.test(part)) {
      result.conditions = result.conditions ? `${result.conditions} ${part}` : part;
    }
  }

  return result;
}

// Determine flight category
export function getFlightCategory(rawMetar: string): 'VFR' | 'MVFR' | 'IFR' | 'LIFR' | 'UNKNOWN' {
  const parsed = parseMetarBasics(rawMetar);

  // Get ceiling in hundreds of feet
  let ceilingFeet: number | undefined;
  if (parsed.ceiling) {
    const match = parsed.ceiling.match(/\d{3}/);
    if (match) {
      ceilingFeet = parseInt(match[0]) * 100;
    }
  }

  // Get visibility in statute miles
  let visibilityMiles: number | undefined;
  if (parsed.visibility) {
    if (parsed.visibility.includes('/')) {
      // Fraction like 1/2SM
      const [num, den] = parsed.visibility.replace('SM', '').split('/').map(Number);
      visibilityMiles = num / den;
    } else {
      visibilityMiles = parseFloat(parsed.visibility.replace('SM', '').replace('P', ''));
    }
  }

  // Determine category
  if (ceilingFeet !== undefined && visibilityMiles !== undefined) {
    if (ceilingFeet < 500 || visibilityMiles < 1) return 'LIFR';
    if (ceilingFeet < 1000 || visibilityMiles < 3) return 'IFR';
    if (ceilingFeet < 3000 || visibilityMiles < 5) return 'MVFR';
    return 'VFR';
  }

  if (ceilingFeet !== undefined) {
    if (ceilingFeet < 500) return 'LIFR';
    if (ceilingFeet < 1000) return 'IFR';
    if (ceilingFeet < 3000) return 'MVFR';
    return 'VFR';
  }

  if (visibilityMiles !== undefined) {
    if (visibilityMiles < 1) return 'LIFR';
    if (visibilityMiles < 3) return 'IFR';
    if (visibilityMiles < 5) return 'MVFR';
    return 'VFR';
  }

  return 'UNKNOWN';
}
