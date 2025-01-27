// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// const supabaseUrl = '';
// const supabaseKey = '';

// export const supabase = createClient(supabaseUrl, supabaseKey);

// export async function getLeaderboard() {
//     const { data, error } = await supabase
//         .from('leaderboard')
//         .select('*')
//         .order('tokens_earned', { ascending: false });

//     if (error) throw error;
//     return data;
// }

// export async function getHallOfFame() {
//     const { data, error } = await supabase
//         .from('hall_of_fame')
//         .select('*')
//         .order('created_at', { ascending: false });

//     if (error) throw error;
//     return data;
// }

// export async function createStakingGoal(walletAddress, category, amount, duration) {
//     const { data, error } = await supabase
//         .from('staking_goals')
//         .insert([
//             {
//                 wallet_address: walletAddress,
//                 category,
//                 amount,
//                 duration,
//                 status: 'active'
//             }
//         ]);

//     if (error) throw error;
//     return data;
// }