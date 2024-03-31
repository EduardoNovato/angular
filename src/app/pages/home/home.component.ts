import { JsonPipe, NgFor } from '@angular/common';
import {
  Component,
  signal,
  ViewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { Task } from '../../models/task.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterTask } from '../../models/filterTask';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, JsonPipe, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('editInput', { static: false })
  editInputRef!: ElementRef<HTMLInputElement>;

  filterTask = FilterTask;

  tasks = signal<Task[]>([
    { id: Date.now(), title: 'Task 1', completed: false },
    { id: Date.now(), title: 'Task 2', completed: true },
  ]);

  filter = signal<FilterTask>(FilterTask.All);
  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    switch (filter) {
      case FilterTask.Pending:
        return tasks.filter((task) => !task.completed);
      case FilterTask.Completed:
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  });

  newTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  changeHandler() {
    if (this.newTaskControl.valid) {
      const value = this.newTaskControl.value.trim();
      if (value !== '') {
        this.addTask(value);
      }
    }
    this.newTaskControl.reset();
  }

  addTask(title: string) {
    const newTask = { id: Date.now(), title, completed: false };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  removeTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((_, i) => i !== index));
  }

  toggleTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  }

  updateTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.map((task, i) => {
        if (i === index && !task.completed) {
          return { ...task, editing: true };
        } else {
          return { ...task, editing: false };
        }
      })
    );
  }

  updateTaskText(index: number) {
    const value = this.editInputRef.nativeElement.value.trim();
    if (value !== '') {
      this.tasks.update((tasks) =>
        tasks.map((task, i) =>
          i === index ? { ...task, title: value, editing: false } : task
        )
      );
    }
  }

  changeFilter(filter: FilterTask) {
    this.filter.set(filter);
  }

  removeCompleted() {
    this.tasks.update((tasks) => tasks.filter((task) => !task.completed));
  }
}
