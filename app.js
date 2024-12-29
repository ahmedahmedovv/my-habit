// Initialize habits from localStorage
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderHabits();
    initializeApp();
});

function initializeApp() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => console.error('Service Worker registration failed:', error));
    }

    // Set up form submission handler
    document.getElementById('habitForm').addEventListener('submit', handleNewHabit);
}

function handleNewHabit(e) {
    e.preventDefault();
    const input = document.getElementById('habitInput');
    const habitName = input.value.trim();
    
    if (habitName) {
        addHabit(habitName);
        input.value = '';
    }
}

function addHabit(habitName) {
    try {
        const habit = {
            id: Date.now(),
            name: habitName,
            dates: {},
            streak: 0,
            createdAt: new Date().toISOString()
        };
        habits.push(habit);
        saveHabits();
        renderHabits();
    } catch (error) {
        console.error('Error adding habit:', error);
    }
}

function toggleHabitDate(habitId, date) {
    try {
        const habit = habits.find(h => h.id === parseInt(habitId));
        if (!habit) return;

        if (habit.dates[date]) {
            delete habit.dates[date];
        } else {
            habit.dates[date] = true;
        }
        
        updateStreak(habit);
        saveHabits();
        renderHabits();
    } catch (error) {
        console.error('Error toggling habit date:', error);
    }
}

function updateStreak(habit) {
    try {
        let streak = 0;
        const today = new Date();
        let currentDate = new Date();
        
        // Convert to date string format YYYY-MM-DD
        const formatDate = (date) => date.toISOString().split('T')[0];
        
        // Check backwards from today
        while (habit.dates[formatDate(currentDate)]) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        habit.streak = streak;
    } catch (error) {
        console.error('Error updating streak:', error);
        habit.streak = 0;
    }
}

function saveHabits() {
    try {
        localStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
        console.error('Error saving habits:', error);
    }
}

function renderHabits() {
    try {
        const habitsList = document.getElementById('habitsList');
        if (!habitsList) return;
        
        habitsList.innerHTML = '';
        const today = new Date().toISOString().split('T')[0];
        
        habits.forEach(habit => {
            const isChecked = habit.dates[today];
            const habitElement = document.createElement('div');
            
            habitElement.className = 'p-4 bg-white rounded-lg shadow flex items-center justify-between mb-3';
            habitElement.innerHTML = `
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800">${escapeHtml(habit.name)}</h3>
                    <p class="text-sm text-gray-600">Current streak: ${habit.streak} days</p>
                </div>
                <button 
                    class="w-8 h-8 rounded-full transition-colors duration-200 flex items-center justify-center ${isChecked ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 hover:bg-gray-300'}"
                    onclick="toggleHabitDate(${habit.id}, '${today}')"
                    aria-label="${isChecked ? 'Mark incomplete' : 'Mark complete'}"
                >
                    ${isChecked ? '<span class="text-white">✓</span>' : ''}
                </button>
            `;
            
            habitsList.appendChild(habitElement);
        });
    } catch (error) {
        console.error('Error rendering habits:', error);
    }
}

// Utility function to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Make functions available globally
window.toggleHabitDate = toggleHabitDate; 