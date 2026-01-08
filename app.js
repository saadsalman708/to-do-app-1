const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const submitBox = document.querySelector(".submit-box");
const submitInput = document.querySelector(".submit-input");
const submitBtn = document.querySelector(".submit-btn");
const taskList = document.querySelector(".task-list");
const noTasks = document.querySelector(".noTasks");
const cancelBtn = document.querySelector(".cancel-btn");
const addBtn = document.querySelector(".add-btn");
const toggleBtn = document.querySelector(".toggle-btn");




let isEditing = false;
let editingTaskId = null;
let openDropdown = null;



const getTasks = () => JSON.parse(localStorage.getItem("allTasks")) || [];

const saveTasks = Tasks => {
    localStorage.setItem("allTasks", JSON.stringify(Tasks));
};





function createTask() {

    input = submitInput.value.trim();

    if (!input) return;

    console.log(input);

    const allTasks = getTasks();

    let taskData = {
        id: Date.now(),
        text: input,
        isCompleted: false,
        added: new Date().toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }),
    };

    allTasks.unshift(taskData);

    saveTasks(allTasks);

    loadList(getTasks());
    showSubmit();
}


function loadList(tasks) {

    submitInput.value = "";
    submitBtn.textContent = "Add";
    submitBtn.classList.add = "theme-red";
    submitBtn.classList.remove = "theme-green";

    taskList.innerHTML = "";
    console.log(tasks);
    noTasks.style.display = tasks.length !== 0 ? "none" : "flex";

    tasks.forEach(({ id, text, isCompleted, added }) => {

        let li = document.createElement("li");
        li.setAttribute("class", "task");

        li.innerHTML = ` 
                        <input type="checkbox" class="" onclick="checkedTask(${id})" ${isCompleted ? 'checked' : ""}>
                        <div class="details">
                            <p>${text}</p>
                            <span>${added}</span>
                        </div>                        
                        <div class="dropdown">
                            <button class="dropdown-btn ⋮">⋮</button>
                            <div class="dropdown-menu">
                                <button onclick="editTask(${id})">Edit</button>
                                <button onclick="delTask(${id})">Delete</button>
                            </div>
                        </div>
                       `;

        taskList.appendChild(li);
    });
}





function checkedTask(id) {

    const allTasks = getTasks();

    allTasks.forEach(task => {
        if (task.id === id) task.isCompleted = !task.isCompleted;
    });

    saveTasks(allTasks);
    loadList(getTasks());
}





function delTask(id) {

    const allTasks = getTasks();

    let filteredTasks = allTasks.filter(task => task.id !== id);

    saveTasks(filteredTasks);
    loadList(getTasks());
}





function editTask(id) {

    const allTasks = getTasks();

    let editingTask = allTasks.find(task => task.id === id);

    submitInput.value = editingTask.text;

    submitBtn.textContent = "Save";
    submitBtn.classList.remove = "theme-red";
    submitBtn.classList.add = "theme-green";

    isEditing = true;
    editingTaskId = editingTask.id;

    showSubmit();
}





function updatedTask() {

    const allTasks = getTasks();

    let idx = allTasks.findIndex(task => task.id === editingTaskId);

    allTasks[idx].text = submitInput.value.trim();

    isEditing = false;
    editingTaskId = null;

    saveTasks(allTasks);
    loadList(getTasks());
    showSubmit();
}





function cancelEdit() {

    submitInput.value = "";
    submitBtn.textContent = "Add";
    submitBtn.classList.add = "theme-red";
    submitBtn.classList.remove = "theme-green";

    isEditing = false;
    editingTaskId = null;

    showSubmit();
}




function searchFilter() {

    const allTasks = getTasks();
    let input = searchInput.value.trim().toLowerCase();

    let filteredList = allTasks.filter(task => task.text.toLowerCase().includes(input));
    loadList(filteredList);
}





function showSubmit() {
    submitBox.style.display = submitBox.style.display === "flex" ? "none" : "flex";
}



function tasksFilter(boolean) {

    let filter = getTasks().filter((task) => { if (task.isCompleted === boolean) return task });

    loadList(filter);
}






document.addEventListener("click", (e) => {
    const btn = e.target.closest(".dropdown-btn");
    const menuItem = e.target.closest(".dropdown-menu button");

    if (btn) {
        const dropdown = btn.closest(".dropdown");
        const menu = dropdown.querySelector(".dropdown-menu");

        // close previous
        if (openDropdown && openDropdown !== dropdown) {
            openDropdown.querySelector(".dropdown-menu").classList.remove("open");
        }

        menu.classList.toggle("open");
        openDropdown = menu.classList.contains("open") ? dropdown : null;
        return;
    }

    // Click on menu item
    if (menuItem) {
        openDropdown?.querySelector(".dropdown-menu").classList.remove("open");
        openDropdown = null;
        return;
    }

    // Click outside
    if (openDropdown) {
        openDropdown.querySelector(".dropdown-menu").classList.remove("open");
        openDropdown = null;
    }
});






function toggleTheme() {
    document.body.classList.toggle("darkTheme");
    toggleBtn.textContent = document.body.classList.contains("darkTheme") ? "☀️" : "🌙";
}














window.addEventListener("load", loadList(getTasks()));
submitInput.addEventListener("keyup", (e) => { if (e.key === "Enter") isEditing ? updatedTask() : createTask() });
submitBtn.addEventListener("click", () => isEditing ? updatedTask() : createTask());
cancelBtn.addEventListener("click", cancelEdit);
searchInput.addEventListener("keyup", () => searchFilter());
addBtn.addEventListener("click", showSubmit);
toggleBtn.addEventListener("click", toggleTheme);


document.addEventListener("keyup", (e) => {
    if (e.key !== "Escape") return;
    
    if (submitBox.style.display === "flex") cancelEdit();
});