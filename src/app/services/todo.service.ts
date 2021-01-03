import {Injectable} from '@angular/core';
import {Todo} from '../models/todo.model';
import {Filter} from '../models/filtering.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private static readonly todoStorageKey = 'todos';
  private todos: Todo[] = [];
  private filteredTodos: Todo[] = [];
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private currentFilter: Filter = Filter.All;

  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
  }

  fetchFromLocalStorage(): void {
    this.todos = this.localStorage.getValue(TodoService.todoStorageKey) || [];
    this.currentFilter = Filter.All;
    this.filteredTodos = [...this.todos];
    this.updateTodosData();
  }

  updateToLocalStorage(): void {
    this.localStorage.setObject(TodoService.todoStorageKey, this.todos);
    this.updateTodosData();
  }

  addTodo(todoContent: string): void {
    const id = new Date(Date.now()).getTime();
    const newTodo = new Todo(id, todoContent);
    this.todos.unshift(newTodo);
    this.filteredTodos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeStatus(id: number, isComplete: boolean): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    this.todos[index].isComplete = isComplete;
    this.updateToLocalStorage();
  }

  private updateTodosData(): void {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.filteredTodos.length);
  }

  filterTodos(filter: Filter): void {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter(todo => !todo.isComplete);
        break;
      case Filter.Complete:
        this.filteredTodos =  this.todos.filter(todo => todo.isComplete);
        break;
      default:
        this.filteredTodos = [...this.todos];
        break;
    }
  }
}
