// SELEÇÃO DE ELEMENTOS
const todoForm = document.querySelector('#todo-form')
const todoInput = document.querySelector('#todo-input')
const todoList = document.querySelector('#todo-list')
const editForm = document.querySelector('#edit-form')
const editInput = document.querySelector('#edit-input')
const cancelEditBtn = document.querySelector('#cancel-edit-btn')
const searchInput = document.querySelector('#search-input')
const eraseBtn = document.querySelector('.erase-button')
const filterBtn = document.querySelector('#filter-select')

let oldInputValue



// FUNÇÕES
// 1- criando todo o template de to do list em JS puro:
const saveTodo = (text, save = 1, done = 0) => {
    const todo = document.createElement('div') //criando a div do meu todo list em js
    todo.classList.add('todo') //inserindo a classe todo na minha div criada na linha anterior

    const todoTitle = document.createElement('h3') //criando o titulo da minha div
    todoTitle.innerText = text //inserindo o atributo de texto no meu h3
    todo.appendChild(todoTitle) //inserindo o meu h3 no todo

    
    // criando os botões:
    //a. botao done
    const doneBtn = document.createElement('button')
    doneBtn.classList.add('finish-todo') //add classe finish-todo ao meu button
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>' //add o icone ao button
    todo.appendChild(doneBtn) //add o doneBtn ao meu todo

    //b. botao edit
    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-todo') //add classe finish-todo ao meu button
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>' //add o icone ao button
    todo.appendChild(editBtn) //add o doneBtn ao meu todo

    //c. botao delete
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('remove-todo') //add classe finish-todo ao meu button
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>' //add o icone ao button
    todo.appendChild(deleteBtn) //add o doneBtn ao meu todo


    // utilizando dados da local storage
    if(done) {
        todo.classList.add('done')
    }

    if(save) {
        saveTodoLocalStorage({text, done})
    }

    //vou pegar a lista e inserir na div todo (linha 68 html)
    todoList.appendChild(todo)

    // limpando o valor do input quando o usuário terminar de digitar
    todoInput.value = ''

    // focando no input depois que o usuário digitar e limpar o campo
    todoInput.focus()
}


// mapeando o form que vai ficar oculto quando o usuário clicar no botão edit do 'todo'
const toggleForms = () => {
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}



const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3')

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text

            updateTodoLocalStorage(oldInputValue, text)
        }
    })
}



//botão de busca/search
const getSearchTodos = (search) => {

    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3').innerText.toLowerCase()

        const normalizeSearch = search.toLowerCase()

        todo.style.display = 'flex'

        if(!todoTitle.includes(normalizeSearch)) {
            todo.style.display = 'none'
        }

        
    })

}



// botão de filtro
const filterTodos = (filterValue) => { 
    const todos = document.querySelectorAll('.todo')

    switch(filterValue) {
        case 'all':
            todos.forEach((todo) => (todo.style.display = 'flex'))
            break;

        case 'done':
            todos.forEach((todo) => todo.classList.contains('done') ? (todo.style.display ='flex') : (todo.style.display ='none'))
            break;

        case 'todo':
            todos.forEach((todo) => !todo.classList.contains('done') ? (todo.style.display ='flex') : (todo.style.display ='none'))
            break;

        default:
        break; 
    }
}



// EVENTOS
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    
    
    const inputValue = todoInput.value

    if (inputValue) {
        saveTodo(inputValue)
    }
})


// 2- Identificando o botão (done, edit, finish) e add o evento em cada um
// selecionando o evento clicado:
document.addEventListener('click', (e) =>{
    const targetEl = e.target //pegando o elemento que foi clicado
    const parentEl = targetEl.closest('div') //selecionei o elemento pai mais próximo da div btn
    let todoTitle //selecionando o titulo do input qdo o usuario estiver no input de edit


    if (parentEl && parentEl.querySelector('h3')) {
        todoTitle = parentEl.querySelector('h3').innerText
    }


    if (targetEl.classList.contains('finish-todo')) { //mapeando qual elemento (btn) clicou e se possui a classe finish-todo
        parentEl.classList.toggle('done') //com o clique do usuário o botao recebe/remove a classe done
        updateTodoStatusLocalStorage(todoTitle)

    } 


    if (targetEl.classList.contains('remove-todo')) { //mapeando o btn e add a funcionalidade de remoção
        parentEl.remove()
        removeTodoLocalStorage(todoTitle)
    }


    if (targetEl.classList.contains('edit-todo')) { //mapeando o btn edit
        toggleForms()

        //mudando o valor do input e salvando ele na memória
        editInput.value = todoTitle
        oldInputValue = todoTitle
    }
})


//quando o usuario está na tela de edição e quer cancelar:
cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault()

    toggleForms()
})



//adicionando o input de edit na minha lista de todo-form
editForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const editInputValue = editInput.value

    if (editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms()
})



//botão de busca
searchInput.addEventListener('keyup', (e) => {
    const search = e.target.value

    getSearchTodos(search)
})


eraseBtn.addEventListener('click', (e) => {
    e.preventDefault()

    searchInput.value = ''

    searchInput.dispatchEvent(new Event('keyup'))
})



//botão filtro
filterBtn.addEventListener('change', (e) => {
    const filterValue = e.target.value
    
    filterTodos(filterValue)
    
})



//local storage (armazenanto local de informaçõe)
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || []
    return todos
}



const loadTodos = () => {
    const todos = getTodosLocalStorage()
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
}


const saveTodoLocalStorage = (todo) => {
    // 1 pegar todos os todos da local storage
    const todos = getTodosLocalStorage()

    // 2 add um novo todo no array do ls
    todos.push(todo)

    // 3 salvar tudo de novo na ls
    localStorage.setItem('todos', JSON.stringify(todos))
}



const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem('todos', JSON.stringify(filteredTodos))
}



const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null)

    localStorage.setItem('todos', JSON.stringify(todos))
}



const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null)

    localStorage.setItem('todos', JSON.stringify(todos))
}


loadTodos()