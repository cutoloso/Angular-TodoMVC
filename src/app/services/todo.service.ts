import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Filter } from '../models/filtering.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private static readonly todoStorageKey = 'todos';
  private todos: Todo[] = [];
  private filteredTodos: Todo[] = [];
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<
    Todo[]
  >([]);
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private hasTodosSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private currentFilter: Filter = Filter.All;

  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();
  hasTodos$: Observable<boolean> = this.hasTodosSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {}

  /**
   * Lấy danh sách todo đã lưu từ local storage
   */
  fetchFromLocalStorage(): void {
    this.todos = this.localStorage.getValue(TodoService.todoStorageKey) || [];
    this.filteredTodos = [...this.todos];
    this.updateTodosData();
  }

  /**
   * Cập nhật lại danh sách todo trong local storage
   */
  updateToLocalStorage(): void {
    this.localStorage.setObject(TodoService.todoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();
  }

  /**
   * Thêm mới 1 todo
   * @param todoContent: string
   */
  addTodo(todoContent: string): void {
    const id = new Date(Date.now()).getTime();
    const newTodo = new Todo(id, todoContent);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  /**
   * Cập nhập trạng thái hoàn thành của 1 todo
   * @param id: ID todo
   * @param isComplete: True: hoàn thành, False: chưa hoàn thành
   */
  changeStatus(id: number, isComplete: boolean): void {
    const index = this.todos.findIndex((todo) => todo.id === id);
    this.todos[index].isComplete = isComplete;
    this.updateToLocalStorage();
  }

  /**
   * Cập nhật nội dung 1 todo
   * @param id: ID todo
   * @param content: Nội dung 1 todo
   */
  editTodo(id: number, content: string): void {
    const index = this.todos.findIndex((todo) => todo.id === id);
    this.todos[index].content = content;
    this.updateToLocalStorage();
  }

  /**
   * Xoá 1 todo
   * @param id: ID todo
   */
  deleteTodo(id: number): void {
    const index = this.todos.findIndex((todo) => todo.id === id);
    this.todos.splice(index, 1);
    this.updateToLocalStorage();
  }

  /**
   * Cập nhật trạng thái tất cả todo
   */
  toggleAll(): void {
    const statusTodos = this.todos.some((todo) => !todo.isComplete);
    this.todos = this.todos.map((todo) => {
      return { ...todo, isComplete: statusTodos };
    });
    this.updateToLocalStorage();
  }

  /**
   * Xoá các todo đã hoàn thành
   */
  clearCompleted(): void {
    this.todos = this.todos.filter((todo) => !todo.isComplete);
    this.updateToLocalStorage();
  }

  /**
   * Cập nhật lại danh sách todo hiển
   * @private
   */
  private updateTodosData(): void {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.filteredTodos.length);
    this.hasTodosSubject.next(this.todos.length > 0);
  }

  /**
   * Lọc danh sách todo
   * @param filter
   */
  filterTodos(filter: Filter, isFiltering: boolean = true): void {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter((todo) => !todo.isComplete);
        break;
      case Filter.Complete:
        this.filteredTodos = this.todos.filter((todo) => todo.isComplete);
        break;
      default:
        this.filteredTodos = [...this.todos];
        break;
    }

    if (isFiltering) {
      this.updateTodosData();
    }
  }
}
