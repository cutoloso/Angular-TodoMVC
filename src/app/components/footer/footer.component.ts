import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Filter, FilterButton } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  filterButtons: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Complete, label: 'Complete', isActive: false },
  ];

  length = 0;
  hasComplete$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.hasComplete$ = this.todoService.todos$.pipe(
      map((todos) => todos.some((todo) => todo.isComplete)),
      takeUntil(this.destroy$)
    );
    this.todoService.length$
      .pipe(takeUntil(this.destroy$))
      .subscribe((length) => (this.length = length));
  }

  /**
   * Lọc danh sách todo
   * @param type
   */
  filterTodos(type: Filter): void {
    this.setActiveFilterBtn(type);
    console.log(type);
    this.todoService.filterTodos(type);
  }

  /**
   * Active button filter
   * @param type
   */
  setActiveFilterBtn(type: Filter): void {
    this.filterButtons = this.filterButtons.map((btn) => {
      return {
        ...btn,
        isActive: btn.type === type,
      };
    });
  }

  /**
   * Xoá các todo đã hoàn thành
   */
  clearCompleted(): void {
    this.todoService.clearCompleted();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
