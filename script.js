document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoColumn = document.querySelector('.todo');
    const inProgressColumn = document.querySelector('.in-progress');
    const testingColumn = document.querySelector('.testing');
    const doneColumn = document.querySelector('.done');
    const completedTasksList = document.getElementById('completed-tasks-list');
    let doneTimeout; // Variable to hold the timeout ID

    // Add event listener to the "Add Task" button
    addTaskBtn.addEventListener('click', addNewTask);

    function addNewTask() {
        // Get the task description from the input field
        const taskDescription = taskInput.value.trim();
        
        if (taskDescription === '') {
            alert('Please enter a task description.');
            return;
        }

        // Create a new task card element
        const newTaskCard = document.createElement('div');
        newTaskCard.classList.add('task-card');
        newTaskCard.draggable = true;
        newTaskCard.textContent = taskDescription;

        // Append the new task card to the ToDo column
        todoColumn.appendChild(newTaskCard);

        // Automatically move the task to the In Progress column
        moveTask(newTaskCard, todoColumn, inProgressColumn);
        
        // Clear the input field after adding the task
        taskInput.value = '';
    }

    function moveTask(taskCard, fromColumn, toColumn) {
        // Append the task card to the target column
        toColumn.appendChild(taskCard);
    
        // Automatically handle task progression
        if (toColumn === inProgressColumn) {
            // If moving to In Progress column, move it to Testing column after a delay
            setTimeout(() => moveTask(taskCard, inProgressColumn, testingColumn), 2000); // Simulating 3 seconds for "work in progress"
        } else if (toColumn === testingColumn) {
            // If moving to Testing column, move it to Done column after a delay
            setTimeout(() => moveTask(taskCard, testingColumn, doneColumn), 2000); // Simulating 3 seconds for "testing"
        } else if (toColumn === doneColumn) {
            // If moving to Done column, record it as completed in the "Completed Tasks" section
            if (taskFails()) {
                // Task failed, record as failed in the "Completed Tasks" section
                recordCompletedTask(taskCard.textContent, '❌ Failed');
            } else {
                // Task succeeded, record as completed in the "Completed Tasks" section
                recordCompletedTask(taskCard.textContent, '✅ Done');
            }
            if (fromColumn === doneColumn) { // Check if the taskCard is coming from the Done column
                fromColumn.querySelector('.task-card').remove(); // Remove the task card from the Done column
            }
            // Reset the Done column after 5 seconds
            clearTimeout(doneTimeout);
            doneTimeout = setTimeout(() => {
                doneColumn.innerHTML = '<h2>Done</h2>'; // Reset the Done column with only the heading
            }, 2000);
        }
    }
    
    function taskFails() {
        // Generate a random number between 0 and 1
        const random = Math.random();
        console.log('Random number:', random);
        // Probability of a task failing (adjust as needed)
        const failureProbability = 0.5; // 50% chance of failure
        console.log('Failure probability:', failureProbability);
        const isFailed = random <= failureProbability;
        console.log('Is failed?', isFailed);
        return isFailed; // Return true if random number is less than or equal to failure probability
    }
    
    function recordCompletedTask(taskDescription) {
        const completionDate = new Date().toLocaleDateString();
        const completionTime = new Date().toLocaleTimeString();
        
        // Create a new row for the completed task in the table
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${taskDescription}</td>
            <td>${completionDate}</td>
            <td>${completionTime}</td>
            <td>✅ Done</td>
        `;
        
        // Append the new row to the table
        completedTasksList.appendChild(newRow);
    }
});
