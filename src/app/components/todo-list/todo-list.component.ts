import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todos$ = this.todoService.todos$;
  }

  /**
   * Sự kiện câp nhật trạng thái 1 todo
   * @param todo: todo đã cập nhật
   */
  onChangeTodoStatus(todo: Todo): void {
    this.todoService.changeStatus(todo.id, todo.isComplete);
  }

  /**
   * Cập nhật nội dung 1 todo
   * @param todo: todo đã cập nhật
   */
  onEditTodo(todo: Todo): void {
    this.todoService.editTodo(todo.id, todo.content);
  }

  /**
   * Xoá 1 todo
   * @param todo: todo muốn xoá
   */
  onDeleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo.id);
  }
}
