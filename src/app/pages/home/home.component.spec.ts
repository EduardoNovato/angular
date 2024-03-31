import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FilterTask } from '../../models/filterTask';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('changeHandler', () => {
    it('should add a task when newTaskControl is valid', () => {
      const title = 'New Task';
      const addTaskSpy = spyOn(component, 'addTask');
      component.newTaskControl.setValue(title);

      component.changeHandler();

      expect(addTaskSpy).toHaveBeenCalledWith(title);
    });

    it('should not add a task when newTaskControl is invalid', () => {
      const title = '';
      const addTaskSpy = spyOn(component, 'addTask');
      component.newTaskControl.setValue(title);

      component.changeHandler();

      expect(addTaskSpy).not.toHaveBeenCalled();
    });
  });

  describe('addTask', () => {
    it('should add a task', fakeAsync(() => {
      const title = 'New Task';
      const tasks = component.tasks();
      const taskLength = tasks.length;

      component.addTask(title);
      //fixture.detectChanges();
      //tick();

      const updatedTasks = component.tasks();
      expect(updatedTasks.length).toBe(taskLength + 1);
      expect(updatedTasks[updatedTasks.length - 1].title).toBe(title);
    }));
  });

  describe('taskByFilter', () => {
    it('should return all tasks when filter is All', () => {
      const tasks = component.tasks();
      const taskByFilter = component.taskByFilter();
      expect(taskByFilter).toEqual(tasks);
    });

    it('should return pending tasks when filter is Pending', () => {
      component.filter.set(FilterTask.Pending);
      const tasks = component.tasks();
      const taskByFilter = component.taskByFilter();
      expect(taskByFilter).toEqual(tasks.filter((task) => !task.completed));
    });

    it('should return completed tasks when filter is Completed', () => {
      component.filter.set(FilterTask.Completed);
      const tasks = component.tasks();
      const taskByFilter = component.taskByFilter();
      expect(taskByFilter).toEqual(tasks.filter((task) => task.completed));
    });
  });

  describe('removeTask', () => {
    it('should remove a task', () => {
      const index = 0;
      const tasks = component.tasks();
      const taskToRemove = tasks[index];
      const taskLength = tasks.length;

      component.removeTask(index);
      const updatedTasks = component.tasks();

      console.log(taskToRemove);

      expect(updatedTasks.length).toBe(taskLength - 1);
      expect(updatedTasks).not.toContain(taskToRemove);
    });
  });
  describe('toggleTask', () => {
    it('should toggle a task', () => {
      const index = 0;
      const tasks = component.tasks();
      const taskToToggle = tasks[index];

      component.toggleTask(index);
      const updatedTasks = component.tasks();

      expect(updatedTasks[index].completed).toBe(!taskToToggle.completed);
    });
  });

  describe('updateTask', () => {
    it('should set editing to true for pending task', () => {
      const tasks = component.tasks();
      const pendingTask = tasks.find((task) => !task.completed);
      const index = tasks.indexOf(pendingTask!);

      component.updateTask(index);
      const updatedTasks = component.tasks();
      const updatedTask = updatedTasks.find(
        (task) => task.id === pendingTask!.id
      );
      console.log(updatedTasks);
      console.log(updatedTask);
      expect(updatedTask!.editing).toBe(true);
    });

    it('should set editing to false for completed task', () => {
      const tasks = component.tasks();
      const completedTask = tasks.find((task) => task.completed);
      const index = tasks.indexOf(completedTask!);

      component.updateTask(index);
      const updatedTasks = component.tasks();
      const updatedTask = updatedTasks.find(
        (task) => task.id === completedTask!.id
      );
      console.log(updatedTasks);
      console.log(updatedTask);
      expect(updatedTask!.editing).toBe(false);
    });
  });

  describe('updateTaskText', () => {
    it('should update task text', () => {
      const index = 0;
      const newText = 'Updated Task';

      component.updateTask(index);
      component.editInputRef.nativeElement.value = newText;
      component.updateTaskText(index);
      const updatedTasks = component.tasks();

      console.log(updatedTasks);

      expect(updatedTasks[index].title).toBe(newText);
    });
  });

  describe('changeFilter', () => {
    it('should change filter', () => {
      const filter = FilterTask.All;
      component.changeFilter(filter);
      expect(component.filter()).toBe(filter);
    });
  });

  describe('removeCompleted', () => {
    it('should remove completed tasks', () => {
      const tasks = component.tasks();
      const completedTasks = tasks.filter((task) => task.completed);
      const taskLength = tasks.length;

      component.removeCompleted();
      const updatedTasks = component.tasks();

      expect(updatedTasks.length).toBe(taskLength - completedTasks.length);
      expect(completedTasks.every((task) => !updatedTasks.includes(task))).toBe(
        true
      );
    });
  });
});
