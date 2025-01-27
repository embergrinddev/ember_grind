import { createStakingGoal } from '../services/supabase.js';

export default function Dashboard() {
    return `
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-white mb-8">Dashboard</h1>
            
            <div class="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 class="text-xl font-semibold text-white mb-4">Create New Goal</h2>
                
                <form id="goal-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-300 mb-2">Category</label>
                        <select id="category" class="w-full bg-gray-800 text-white rounded p-2">
                            <option value="fitness">Fitness</option>
                            <option value="learning">Learning</option>
                            <option value="productivity">Productivity</option>
                            <option value="addiction">Addiction Recovery</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 mb-2">Stake Amount (GRIND)</label>
                        <input type="number" id="amount" class="w-full bg-gray-800 text-white rounded p-2">
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 mb-2">Duration (Days)</label>
                        <input type="number" id="duration" class="w-full bg-gray-800 text-white rounded p-2">
                    </div>
                    
                    <button type="submit" class="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
                        Create Goal
                    </button>
                </form>
            </div>
            
            <div class="bg-gray-900 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-white mb-4">Active Goals</h2>
                <div id="active-goals">
                    <!-- Goals will be loaded here -->
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('goal-form');
    if (form) {
        form.addEventListener('submit', handleGoalSubmission);
    }
});

async function handleGoalSubmission(e) {
    e.preventDefault();
    
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const duration = document.getElementById('duration').value;
    
    try {
        const button = e.target.querySelector('button');
        button.innerHTML = '<div class="loader"></div>';
        button.disabled = true;
        
        await createStakingGoal(
            window.solana.publicKey.toString(),
            category,
            amount,
            duration
        );
        
        e.target.reset();
        alert('Goal created successfully!');
        
    } catch (error) {
        console.error('Error creating goal:', error);
        alert('Error creating goal. Please try again.');
    } finally {
        button.innerHTML = 'Create Goal';
        button.disabled = false;
    }
}