import { Component, OnInit } from '@angular/core';
import { Project } from '../../../project/models/project';
import { Task } from '../../models/task';
import { ParentTask } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { ParentTaskService } from '../../services/parent-task.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  project: Project;
  Tasks: Task[];
  parentTask: ParentTask;
  SortKey: string;

  constructor(private taskService: TaskService,
    private alertService: AlertService,
    private parentService: ParentTaskService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
  }

  editTask(taskId: number) {
    this.taskService.getTask(taskId)
      .subscribe(response => {
        if (response.Success == true) {
          this.router.navigate(['/task/add'], { queryParams: { taskId: taskId } });
        }
        else {
          this.alertService.error(response.Message, 'Error', 3000);
        }
      });
  }

  endTask(taskId: number) {
    this.taskService.endTask(taskId)
      .subscribe(response => {
        if (response.Success == true) {
          this.refreshList();
          this.alertService.success('Task ended successfully!', 'Success', 3000);
        }
        else {
          this.alertService.error(response.Message, 'Error', 3000);
        }
      });
  }

  sortTask(sortKey: string) {
    this.SortKey = sortKey;
    this.taskService.getTasksList(this.project.Project_ID, sortKey)
      .subscribe(response => {
        if (response.Success == true) {
          this.Tasks = response.Data;
        }
        else {
          this.alertService.error(response.Message, 'Error', 3000);
        }
      });
  }

  refreshList() {

    let flag = true;
    //fetch all tasks associated to this project and display
    console.log(this.project.Project_ID + '&&' + this.SortKey);
    this.taskService.getTasksList(this.project.Project_ID, this.SortKey)
      .subscribe(response => {
        if (response.Success == true) {
          if (response.Data.length == 0) {
            this.alertService.warn('No taks found for the project:' + this.project.Project, 'Warning', 3000);
          }

          this.Tasks = response.Data;

          // to
          if (flag) {
            for (let ntask of this.Tasks) {
              this.parentService.getParentTaskbyObj(ntask.Parent)
                .subscribe(response => {

                  this.parentTask = response.Data;
                  flag = false;
                });
            }
          }

        }
        else {
          this.alertService.error('Error occured while fetching tasks for the project:' + this.project.Project, 'Error', 3000);
        }
      });
  }


  //callback from Project search popup
  onProjectSelected(project: Project) {
    console.log("onProjectSelected called from view component for project  = " + project);
    this.project = project;
    this.refreshList();
  }

}


