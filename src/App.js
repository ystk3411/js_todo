import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { element, render } from "./view/html-util.js";

export class App {
    // 1. TodoListModelの初期化
    #todoListModel = new TodoListModel();

    mount() {
        const formElement = document.querySelector("#js-form");
        const inputElement = document.querySelector("#js-form-input");
        const containerElement = document.querySelector("#js-todo-list");
        const todoItemCountElement = document.querySelector("#js-todo-count");
        const formEditElement = document.querySelector("#js-edit-form");
        formEditElement.style.display = 'none'

        // 2. TodoListModelの状態が更新されたら表示を更新する
        this.#todoListModel.onChange(() => {
            const todoListElement = element`<ul></ul>`;
            const todoItems = this.#todoListModel.getTodoItems();
            
            todoItems.forEach(item => {
            const todoEditItemElement = element`
                <li>
                    <form id="js-edit-form">      
                        <input
                            id="js-form-input-edit${item.id}"
                            type="text"
                            placeholder="タスクを入力してください"
                            value=${item.title}
                        />
                        <button class="update">変更</button>
                    </form>
                </li>`
            todoEditItemElement.style.display = 'none'

            const todoItemElement = item.completed
                ? element`
                <li class="todoItemElement">
                    <input type="checkbox" class="checkbox" checked>
                    <s>${item.title}</s>
                    <button class="edit">編集</button>
                    <button class="delete">削除</button>
                </li>`
                : element`
                <li class="todoItemElement">
                    <input type="checkbox" class="checkbox">
                    ${item.title}
                    <button class="edit">編集</button>
                    <button class="delete">削除</button>
                </li>`;

            // チェックボックスのトグル処理は変更なし
            const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
            inputCheckboxElement.addEventListener("change", () => {
                this.#todoListModel.updateTodo({
                    id: item.id,
                    completed: !item.completed
                });
            });

            // 削除ボタン押下時
            const deleteButtonElement = todoItemElement.querySelector(".delete");
            deleteButtonElement.addEventListener("click", () => {
            var result = window.confirm('本当に削除してもよろしいですか？');
            if( result ) {
                this.#todoListModel.deleteTodo({
                    id: item.id
                });
            }
            });

            // 編集ボタン押下時
            const EditButtonElement = todoItemElement.querySelector(".edit");
            EditButtonElement.addEventListener("click", () => {
                todoItemElement.style.display = 'none'
                todoEditItemElement.style.display = 'block'
                // todoListElement.appendChild(todoEditItemElement);
            });

            // 更新ボタン押下時
            const updateButtonElement = todoEditItemElement.querySelector(".update");
            updateButtonElement.addEventListener("click", () => {
                const editForm = document.querySelector(`#js-form-input-edit${item.id}`);
                this.#todoListModel.editTodo({
                    id: item.id,
                    title: editForm.value
                });
            });

            todoListElement.appendChild(todoItemElement);
            todoListElement.appendChild(todoEditItemElement);
            });
            render(todoListElement, containerElement);
            todoItemCountElement.textContent = `全てのタスク:  ${this.#todoListModel.getTotalCount()} 完了済み: ${this.#todoListModel.getCompleteCount()} 未完了: ${this.#todoListModel.getIncompleteCount()}`;
        });

        // 3. フォームを送信したら、新しいTodoItemModelを追加する
        formElement.addEventListener("submit", (event) => {
            event.preventDefault();
            // 新しいTodoItemをTodoListへ追加する
            this.#todoListModel.addTodo(new TodoItemModel({
                title: inputElement.value,
                completed: false
            }));
            inputElement.value = "";
        });
    }
}