import { getCountryInfo } from '../utils/countries.js';

/**
 * Parses EXTINF attributes and channel data from M3U playlist content
 * @param {string} content - Raw M3U file text
 * @returns {Array<Channel>} - Array of parsed channel objects
 */
export function parseM3U(content) {
  if (!content || typeof content !== 'string') return [];

  const lines = content.split(/\r?\n/);
  const channels = [];
  let currentChannel = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      currentChannel = parseExtInf(line, channels.length);
    } else if (line.startsWith('#')) {
      // Directives like #EXTVLCOPT, #EXTGRP, etc.
      if (currentChannel && line.startsWith('#EXTGRP:')) {
        const grp = line.replace('#EXTGRP:', '').trim();
        if (grp && (!currentChannel.group || currentChannel.group === 'General')) {
          currentChannel.group = grp;
        }
      }
      continue;
    } else if (currentChannel) {
      // This is the stream URL
      currentChannel.url = line;
      
      // Basic validation: must look like a valid URL
      if (currentChannel.url.startsWith('http://') || currentChannel.url.startsWith('https://')) {
        channels.push(currentChannel);
      }
      currentChannel = null;
    }
  }

  return channels;
}

/**
 * Helper to parse a single #EXTINF line
 */
function parseExtInf(line, index) {
  // Extract attributes using regex
  const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
  const idMatch = line.match(/tvg-id="([^"]*)"/i);
  const groupMatch = line.match(/group-title="([^"]*)"/i);
  const countryAttrMatch = line.match(/tvg-country="([^"]*)"/i);

  // Extract channel name (everything after the last comma)
  const commaIndex = line.lastIndexOf(',');
  let name = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : `Channel ${index + 1}`;

  const tvgId = idMatch ? idMatch[1] : '';
  const logo = logoMatch ? logoMatch[1] : '';
  let groupTitle = groupMatch ? groupMatch[1] : 'General';

  // Normalize group title: take the first if multiple separated by semicolons
  if (groupTitle.includes(';')) {
    groupTitle = groupTitle.split(';')[0].trim();
  }
  if (!groupTitle || groupTitle === 'Undefined') {
    groupTitle = 'General';
  }

  // Country detection:
  // 1. Check tvg-country attribute
  // 2. Or extract 2-letter country code from tvg-id (e.g., "Channel.bd@SD" -> "bd")
  let countryCode = countryAttrMatch ? countryAttrMatch[1].toLowerCase() : null;
  
  if (!countryCode && tvgId) {
    const tvgCountryMatch = tvgId.match(/\.([a-z]{2})(@|$)/i);
    if (tvgCountryMatch) {
      countryCode = tvgCountryMatch[1].toLowerCase();
    }
  }

  // Extract quality/resolution badge if present in the title (e.g., "1080p", "720p", "HD", "4K")
  let quality = null;
  const qualityMatch = name.match(/\b(4K|2160p|1080p|720p|576p|480p|360p|270p|240p|FHD|HD|SD)\b/i);
  if (qualityMatch) {
    quality = qualityMatch[1].toUpperCase();
  }

  // Clean channel name by stripping resolution in parentheses if desired, or keep as is
  const country = getCountryInfo(countryCode);

  return {
    id: tvgId ? `${tvgId}-${index}` : `ch-${index}-${name.replace(/\s+/g, '-').toLowerCase()}`,
    tvgId,
    name,
    cleanName: name.replace(/\s*\(\d+p\)/gi, '').replace(/\s*\[.*?\]/gi, '').trim(),
    logo: logo && logo.startsWith('http') ? logo : '',
    group: groupTitle,
    countryCode: country.code,
    countryName: country.name,
    countryFlag: country.flag,
    quality: quality || 'HD',
    url: ''
  };
}
