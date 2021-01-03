import {Component, OnInit} from '@angular/core';
import {TodoService} from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private todoService: TodoService) {
  }
  ngOnInit() {
    this.todoService.fetchFromLocalStorage();
  }
}
