let habits = [];

// Load habits from localStorage
function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    habits = savedHabits ? JSON.parse(savedHabits) : [];
    displayHabits();
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Add new habit
function addHabit() {
    const input = document.getElementById('habitInput');
    const habitName = input.value.trim();
    
    if (habitName) {
        habits.push({
            name: habitName,
            completed: false,
            date: new Date().toISOString().split('T')[0]
        });
        saveHabits();
        displayHabits();
        input.value = '';
    }
}

// Toggle habit completion
function toggleHabit(index) {
    habits[index].completed = !habits[index].completed;
    saveHabits();
    displayHabits();
}

// Display habits
function displayHabits() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';
    
    habits.forEach((habit, index) => {
        const div = document.createElement('div');
        div.className = `habit-enter p-4 rounded-2xl border ${habit.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} transition-all duration-200 shadow-sm hover:shadow-md`;
        
        const timeAgo = getTimeAgo(habit.date);
        
        div.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="relative">
                    <input type="checkbox" 
                           class="w-6 h-6 rounded-xl border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                           ${habit.completed ? 'checked' : ''} 
                           onclick="toggleHabit(${index})">
                </div>
                <div class="flex flex-col flex-1 min-w-0">
                    <span class="text-base text-gray-800 leading-tight ${habit.completed ? 'line-through text-gray-500' : ''} truncate">
                        ${habit.name}
                    </span>
                    <span class="text-xs text-gray-500">${timeAgo}</span>
                </div>
                <button onclick="deleteHabit(${index})" 
                        class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        habitList.appendChild(div);
    });
}

function deleteHabit(index) {
    habits.splice(index, 1);
    saveHabits();
    displayHabits();
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Initialize app
loadHabits();
