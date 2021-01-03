import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Todo} from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo: Todo;
  @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();

  isHover: boolean;
  isEditing: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  changeTodoStatus(): void {
    this.changeStatus.emit({...this.todo, isComplete: !this.todo.isComplete});
  }
}
