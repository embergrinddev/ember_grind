import { CONFIG } from '../config.js';

export const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

export async function getActiveStake(walletAddress) {
    console.log(walletAddress);
    const { data, error } = await supabase
        .from('stakes')
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }

    return data; 
}

export async function createStake(stakeData) {
    const { data, error } = await supabase
        .from('stakes')
        .insert([stakeData])
        .select()
        .single();

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }

    return data;
}