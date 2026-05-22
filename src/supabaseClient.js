import { createClient } from '@supabase/supabase-js';
import {
	HAS_SUPABASE_CONFIG,
	SUPABASE_PUBLISHABLE_KEY,
	SUPABASE_URL,
} from './config';

export const supabase = HAS_SUPABASE_CONFIG
	? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
	: null;
