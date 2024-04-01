import { JsonPipe, NgFor } from '@angular/common';
import {
  Component,
  signal,
  ViewChild,
  ElementRef,
  computed,
  OnInit,
} from '@angular/core';
import { Task } from '../../models/task.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterTask } from '../../models/filterTask';
import { TaskServiceService } from '../../services/task-service.service';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDoc, getDocs } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, JsonPipe, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('editInput', { static: false })
  editInputRef!: ElementRef<HTMLInputElement>;

  filterTask = FilterTask;
  tasks$: Observable<Task[]>;
  filter$: Observable<FilterTask>;

  tasks = signal<Task[]>([]);

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

  constructor(
    private taskService: TaskServiceService,
    private fireStore: Firestore
  ) {
    this.tasks$ = this.taskService.tasks$;
    this.filter$ = this.taskService.filter$;
  }

  ngOnInit(): void {
    this.loadTasksFromFirestore();
  }

  async loadTasksFromFirestore() {
    const tasksCollection = collection(this.fireStore, 'tasks');
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasks: Task[] = tasksSnapshot.docs.map((doc) => doc.data() as Task);
    this.tasks.set(tasks);
  }

  async saveTasksToFirestore(task: Task) {
    const tasksCollection = collection(this.fireStore, 'tasks');
    await addDoc(tasksCollection, task);
  }

  changeHandler() {
    if (this.newTaskControl.valid) {
      const value = this.newTaskControl.value.trim();
      if (value !== '') {
        this.taskService.addTask(value);
      }
    }
    this.newTaskControl.reset();
  }

  removeTask(index: number) {
    this.taskService.removeTask(index.toString());
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
    this.taskService.setFilter(filter);
  }

  removeCompleted() {
    this.taskService.removeCompleted();
  }
}
