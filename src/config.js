export const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED === 'true';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_PUBLISHABLE_KEY =
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
	import.meta.env.VITE_SUPABASE_ANON_KEY ??
	'';

export const HAS_SUPABASE_CONFIG = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
