import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.interface';
import { FilterTask } from '../models/filterTask';
import {
  Firestore,
  collection,
  doc,
  docData,
  updateDoc,
  addDoc,
  deleteDoc,
  DocumentData,
} from '@angular/fire/firestore';
import { getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private filterSubject = new BehaviorSubject<FilterTask>(FilterTask.All);

  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  filter$: Observable<FilterTask> = this.filterSubject.asObservable();

  constructor(private firestore: Firestore) {}

  /*
  addTask(task: Task) {
    const tasks = this.taskSubject.getValue();
    this.taskSubject.next([...tasks, task]);
  }
  */
  async loadTasksFromFirebase() {
    const tasksCollection = collection(this.firestore, 'tasks');
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasks: Task[] = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data()['title'],
      completed: doc.data()['completed'],
      editing: doc.data()['editing'] || false,
    }));
    this.tasksSubject.next(tasks);
  }

  // addTask(title: string) {
  //   const newTask: Task = {
  //     id: Date.now().toString(),
  //     title,
  //     completed: false,
  //   };
  //   const currentTasks = this.tasksSubject.getValue();
  //   this.tasksSubject.next([...currentTasks, newTask]);
  // }

  addTask(title: string) {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    const tasksCollection = collection(this.firestore, 'tasks');
    addDoc(tasksCollection, newTask).then((docRef) => {
      const taskWithId = { ...newTask, id: docRef.id };
      this.tasksSubject.next([...this.tasksSubject.getValue(), taskWithId]);
    });
  }

  removeTask(id: string) {
    const taskDocRef = doc(this.firestore, 'tasks', id);
    deleteDoc(taskDocRef).then(() => {
      const currentTasks = this.tasksSubject.getValue();
      this.tasksSubject.next(currentTasks.filter((task) => task.id !== id));
    });
  }

  setFilter(filter: FilterTask) {
    this.filterSubject.next(filter);
  }

  removeCompleted() {
    const currentTasks = this.tasksSubject.getValue();
    const remainingTasks = currentTasks.filter((task) => !task.completed);
    this.tasksSubject.next(remainingTasks);
  }
}
