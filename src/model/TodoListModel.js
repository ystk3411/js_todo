import { EventEmitter } from "../EventEmitter.js";

export class TodoListModel extends EventEmitter {
    #items;
    /**
     * @param {TodoItemModel[]} [items] 初期アイテム一覧（デフォルトは空の配列）
     */
    constructor(items = []) {
        super();
        this.#items = items;
    }

    /**
     * TodoItemの合計個数を返す
     * @returns {number}
     */
    getTotalCount() {
        return this.#items.length;
    }

    /**
     * completedがtrueのTodoItemの合計個数を返す
     * @returns {number}
     */
    getCompleteCount() {
        const count = this.#items.filter((item) => item.completed === true)
        return count.length;
    }

    /**
     * completedがfalseのTodoItemの合計個数を返す
     * @returns {number}
     */
    getIncompleteCount() {
        const count = this.#items.filter((item) => item.completed === false)
        return count.length;
    }

    /**
     * 表示できるTodoItemの配列を返す
     * @returns {TodoItemModel[]}
     */
    getTodoItems() {
        return this.#items;
    }

    /**
     * TodoListの状態が更新されたときに呼び出されるリスナー関数を登録する
     * @param {Function} listener
     */
    onChange(listener) {
        this.addEventListener("change", listener);
    }

    /**
     * 状態が変更されたときに呼ぶ。登録済みのリスナー関数を呼び出す
     */
    emitChange() {
        this.emit("change");
    }

    /**
     * TodoItemを追加する
     * @param {TodoItemModel} todoItem
     */
    addTodo(todoItem) {
        this.#items.push(todoItem);
        this.emitChange();
    }

    updateTodo({ id, completed }) {
        // `id`が一致するTodoItemを見つけ、あるなら完了状態の値を更新する
        const todoItem = this.#items.find(todo => todo.id === id);
        if (!todoItem) {
            return;
        }
        todoItem.completed = completed;
        this.emitChange();
  }

  deleteTodo({ id }) {
    // `id`に一致しないTodoItemだけを残すことで、`id`に一致するTodoItemを削除する
    this.#items = this.#items.filter(todo => {
        return todo.id !== id;
    });
    this.emitChange();
  }

  editTodo({ id, title }) {
    console.log("item.id:"+id)
    this.#items.forEach(item => {console.log(item.id === id)})
    // `id`に一致するTodoItemを編集する
    const todoItem = this.#items.find(todo => todo.id === id);
    console.log("todoItem:"+todoItem.id)
    console.log("title:"+title)
    if (!todoItem) {
        return;
    }
    console.log(title)
    todoItem.title = title
    this.emitChange();
  }
}