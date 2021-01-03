import { Component, OnInit } from '@angular/core';
import {TodoService} from '../../services/todo.service';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss']
})
export class TodoInputComponent implements OnInit {
  todoContent = '';
  constructor(private totoService: TodoService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.todoContent !== '') {
      this.totoService.addTodo(this.todoContent);
      this.todoContent = '';
    }
  }
}
