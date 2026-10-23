import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabaseAdmin';
import {
  DEFAULT_STORE_SERVICES,
  DEFAULT_WEB_TOOLS,
  StoreService,
  WebToolItem
} from '../data/defaultCatalog';
import { DEFAULT_SITE_CONFIG, SiteSettingsConfig, deepMergeSiteConfig } from '../types/siteConfig';
import { DEFAULT_REVIEWS } from '@/app/api/reviews/route';

export interface ServerStoreData {
  services: StoreService[];
  webTools: WebToolItem[];
  siteConfig: SiteSettingsConfig;
  reviews: typeof DEFAULT_REVIEWS;
}

function normalizeTiers(rawTiers: unknown): string[] {
  let arr: unknown[] = [];
  if (Array.isArray(rawTiers)) {
    arr = rawTiers;
  } else if (typeof rawTiers === 'string') {
    try {
      const parsed = JSON.parse(rawTiers);
      if (Array.isArray(parsed)) arr = parsed;
      else arr = [rawTiers];
    } catch {
      arr = rawTiers.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }

  return arr
    .map((t) => {
      if (!t) return '';
      if (typeof t === 'string') return t;
      if (typeof t === 'object' && t !== null) {
        const obj = t as { name?: string; title?: string; label?: string; price?: number | string };
        const name = obj.name || obj.title || obj.label || '';
        const price = obj.price !== undefined ? ` — Rs. ${Number(obj.price).toLocaleString()}` : '';
        return (name + price).trim() || JSON.stringify(t);
      }
      return String(t);
    })
    .filter(Boolean);
}

export async function getServerStoreData(): Promise<ServerStoreData> {
  // 1. Fetch Services
  let services = DEFAULT_STORE_SERVICES;
  try {
    const { data: srvRows } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (srvRows && srvRows.length > 0) {
      services = srvRows.map((row) => ({
        id: row.id,
        category: row.category,
        badge: row.badge,
        title: row.title,
        desc: row.desc || '',
        plush: row.plush || 'plush-srv-1',
        orbGrad: row.orb_grad || 'from-pink-500 to-rose-600',
        iconType: row.icon_type,
        customIconUrl: row.custom_icon_url,
        directToolUrl: row.direct_tool_url,
        inputLabel: row.input_label || 'Your Requirement',
        placeholder: row.placeholder || 'Enter details...',
        tiers: normalizeTiers(row.tiers),
        hidden: row.hidden ?? false,
      }));
    }
  } catch {
    // Graceful fallback to default
  }

  // 2. Fetch Web Tools
  let webTools = DEFAULT_WEB_TOOLS;
  try {
    const { data: toolRows } = await supabaseAdmin
      .from('web_tools')
      .select('*')
      .order('sort_order', { ascending: true });

    if (toolRows && toolRows.length > 0) {
      webTools = toolRows.map((row) => ({
        id: row.id,
        title: row.title,
        desc: row.desc || '',
        toolUrl: row.tool_url,
        iconUrl: row.icon_url || '',
        badge: row.badge || 'ONLINE',
        buttonLabel: row.button_label || 'Open Live Tool',
        iconType: row.icon_type || 'wand',
        orbGrad: row.orb_grad || 'from-indigo-600 to-purple-600',
        plush: row.plush || 'plush-website',
        openMode: (row.open_mode as 'new_tab' | 'embed_modal' | 'sim_tab') || 'new_tab',
        hidden: row.hidden ?? false,
      }));
    }
  } catch {
    // Graceful fallback to default
  }

  // 3. Fetch Site Config
  let siteConfig = DEFAULT_SITE_CONFIG;
  try {
    const { data: cfgRow } = await supabaseAdmin
      .from('site_config')
      .select('config')
      .eq('id', 'default')
      .maybeSingle();

    if (cfgRow?.config) {
      siteConfig = deepMergeSiteConfig(cfgRow.config);
    } else {
      // Check server disk backup
      try {
        const backupFile = path.join(process.cwd(), 'data', 'site_config.json');
        if (fs.existsSync(backupFile)) {
          const raw = fs.readFileSync(backupFile, 'utf8');
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            siteConfig = deepMergeSiteConfig(parsed);
          }
        }
      } catch {}
    }
  } catch {
    // Check server disk backup on error
    try {
      const backupFile = path.join(process.cwd(), 'data', 'site_config.json');
      if (fs.existsSync(backupFile)) {
        const raw = fs.readFileSync(backupFile, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          siteConfig = deepMergeSiteConfig(parsed);
        }
      }
    } catch {}
  }

  // 4. Fetch Reviews (Only Approved Reviews on Server-Side Storefront)
  let reviews = DEFAULT_REVIEWS;
  try {
    const { data: revRows } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .or('status.eq.approved,status.is.null')
      .order('created_at', { ascending: false });

    if (revRows && revRows.length > 0) {
      reviews = revRows;
    }
  } catch {
    // Fallback to default
  }

  return {
    services,
    webTools,
    siteConfig,
    reviews,
  };
}
