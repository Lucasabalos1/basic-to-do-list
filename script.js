const submitTask = document.getElementById("submit-task")
const listCont = document.querySelector(".list-cont");
const isLoged = localStorage.getItem('userActive')
let saveEditHandler = null;

const currentTask = {
    task_id: 1,
  
    nextTaskId(){
        this.task_id++;
    },
  
    previusTaskId(){
        if (this.task_id > 1) {
            this.task_id--;
        }
    },
  
    getTaskId(){
        return this.task_id;
    },
  
  }

const toggleEditModal = () => {
    const modal = document.querySelector(".edit-modal-background");

    modal.classList.toggle("show-edit")
}

const editMsg = (oldTask) => {
    toggleEditModal();

    const cancelEditBtn = document.querySelector(".cancel-edit");
    const saveEditBtn = document.getElementById("save-edit");

    // Eliminar listeners previos si existen
    if (saveEditHandler) {
        saveEditBtn.removeEventListener("click", saveEditHandler);
    }

    cancelEditBtn.addEventListener("click", toggleEditModal);

    // Nueva función para manejar el guardado
    saveEditHandler = () => {
        const newTask = document.getElementById("task-edit").value;

        const storage = JSON.parse(localStorage.getItem("userTasks"));

        const userFound = storage.userTasks[0].users.find((us) => us.id === parseInt(localStorage.getItem("userActive")));

        const searchTask = userFound.tasks.find((tsk) => tsk.task_id === oldTask);

        searchTask.task = newTask;

        localStorage.setItem("userTasks", JSON.stringify(storage));

        toggleEditModal();

        loadTasks();

        document.getElementById("task-edit").value = "";
    };

    // Agregar el nuevo listener
    saveEditBtn.addEventListener("click", saveEditHandler);
};


const deleteTask = (taskToDelete) => {
    const storage = JSON.parse(localStorage.getItem("userTasks"));

    const userFound = storage.userTasks[0].users.find(us => us.id === parseInt(localStorage.getItem("userActive")))
 
    const searchTask = userFound.tasks.findIndex(tsk => tsk.task_id === taskToDelete)

    if (searchTask !== -1) {
        userFound.tasks.splice(searchTask, 1);
    }
    
    localStorage.setItem("userTasks", JSON.stringify(storage));
    
    loadTasks()
}

const saveTask = (task, id_task) => {
    const storage = JSON.parse(localStorage.getItem("userTasks")) || { "userTasks": [{ "users": [] }] };

    let  userFound = storage.userTasks[0].users.find(us => us.id === parseInt(localStorage.getItem('userActive')));

    //si el usuario no existe
    if (!userFound) {
        userFound = {
        id: parseInt(localStorage.getItem('userActive')),
        tasks: []
        };

        storage.userTasks[0].users.push(userFound);
    }

    //luego de crear el usuario o si el usuario existe agrego la tarea a tasks
    const newTask = {
        task_id: id_task, 
        task: task 
    }

    userFound.tasks.push(newTask)

    localStorage.setItem("userTasks", JSON.stringify(storage));
}

/* Codigo para guardar en el localstorage las task */
const loadTasks = () => {
    
    listCont.innerHTML= ""
    
    const storage = JSON.parse(localStorage.getItem("userTasks"));

    if (!storage) {
        return;
    }

    const userFound = storage.userTasks[0].users.find(us => us.id === parseInt(localStorage.getItem('userActive')));

    if(!userFound){
        return;
    }

    const tasks = userFound.tasks;

    for (const task of tasks) {
        
        const inputValue = task.task;

        const id = task.task_id;
    
        const li = document.createElement("LI");
        li.classList.add("task-cont");
        li.innerHTML = `
            <div class="task_id">${id}</div>
            <div class="task">
                <input type="checkbox" name="complete" class="task-complete">
                <span class= "task-title">${inputValue}</span>
            </div>
            <div class="btn-cont">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
            `
    
        listCont.appendChild(li);
        
        const editBtn = li.querySelector(".edit");
        const deleteBtn = li.querySelector(".delete");

        
        const getTask = li.querySelector(".task_id").textContent

   
        editBtn.addEventListener("click", () => {
            editMsg(parseInt(getTask))
        })
    
        deleteBtn.addEventListener("click", () => {
            deleteTask(parseInt(getTask))
        })

    }
}


const addTask = () => {
    const inputValue = document.querySelector(".input-task").value;
    
    if(!inputValue){ 
        alert("No deje vacia la casilla de la tarea"); 
        return;
    }

    const li = document.createElement("LI");
    li.classList.add("task-cont");
    li.innerHTML = `
        <div class="task_id">${currentTask.getTaskId()}</div>
        <div class="task">
            <input type="checkbox" name="complete" class="task-complete">
            <span class="task-title">${inputValue}</span>
        </div>
        <div class="btn-cont">
            <button  class="edit">Edit</button>
            <button  class="delete">Delete</button>
        </div>
        `

    listCont.appendChild(li);

    saveTask(inputValue, currentTask.getTaskId());

    const editBtn = li.querySelector(".edit");
    const deleteBtn = li.querySelector(".delete");
    
    const getTask = li.querySelector(".task_id").textContent

   
    editBtn.addEventListener("click", () => {
        editMsg(parseInt(getTask))
    })

    deleteBtn.addEventListener("click", () => {
        deleteTask(parseInt(getTask))
    })

    document.querySelector(".input-task").value = "";

    currentTask.nextTaskId();
}


/*

-cambiar lo de task por una id

*/

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(()=>{
        if (!isLoged) {
            document.querySelector(".modal-background").classList.toggle("show-modal")
        }
    },500)

    const closeModal = document.querySelector(".close-modal")

    closeModal.addEventListener(("click"), () => {
        document.querySelector(".modal-background").classList.toggle("show-modal")
    })

    if (isLoged) {
        loadTasks()
    }
    submitTask.addEventListener("click", addTask)
    registerBtn.addEventListener("click", (event) => { registerUser(event)})
    loginBtn.addEventListener("click", (event) => { loginUser(event) })
})

/* Codigo para el login y el register */

const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

const redirectLogin = document.querySelector(".login-redirect")
const redirectRegister = document.querySelector(".register-redirect")

const registerBtn = document.getElementById("submit-register");
const loginBtn = document.getElementById("submit-login");

const toggleForm = () =>{
    loginForm.classList.toggle("hidden-form")
    registerForm.classList.toggle("hidden-form")
}

redirectLogin.addEventListener("click", (event) => {
    event.preventDefault();
    toggleForm();
})

redirectRegister.addEventListener("click", (event) => {
    event.preventDefault();
    toggleForm();
})

const registerUser = (event) => {
    event.preventDefault();

    const email = document.getElementById("user-email-reg").value;
    const password = document.getElementById("user-password-reg").value;
    const repeatPassword = document.getElementById("user-repeat-password-reg").value;

    const emailValid = ["@gmail.com", "@gmail.com.ar", "@hotmail.com", "@hotmail.com"].some(dom => email.includes(dom) )

    if (!emailValid) {
        alert("Ingresa un mail valido")
        return;
    }

    if (password != repeatPassword) {
        alert("La constraseñas no coinciden")
        return;
    }

    const storage = JSON.parse(localStorage.getItem("users")) || {"users":[]};

    const user = {
        id: storage.users.length + 1,
        email: email,
        password: password
    };

    const userFound = storage.users.some( us => us.email === user.email && us.password === user.password)

    if (userFound) {
        alert("El usuario ya existe");
        return;
    }

    storage.users.push(user);

    localStorage.setItem("users",JSON.stringify(storage));

    alert("registro con exito")
    toggleForm();
}

const loginUser = (event) => {
    event.preventDefault();

    const email = document.getElementById("user-email-log").value;
    const password = document.getElementById("user-password-log").value;

    const storage = JSON.parse(localStorage.getItem("users"));

    const userExist = storage.users.find(us => us.email === email && us.password === password);

    if (!userExist) {
        alert("El usuario no existe")
        return;
    }

    alert("Sesion iniciada")
    localStorage.setItem("userActive" , userExist.id);
    location.reload()
}

