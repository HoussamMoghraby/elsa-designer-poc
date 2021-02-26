import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WorkflowService } from "./workflow.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  activityDefinition = "{}";
  workflowModel: any = {};
  dataAvailable = false;
  selectedActivity = undefined;
  originalActivities = [];

  constructor(http: HttpClient, private workflowService: WorkflowService) { }

  editActivityForm: FormGroup = new FormGroup(
    { title: new FormControl(''), name: new FormControl(''), description: new FormControl(''), expression: new FormControl('') },
  )

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  ngOnInit() {
    this.workflowService.getWorkflow().subscribe(
      result => {
        var activities = JSON.stringify(result.activity);
        this.originalActivities = <any>(result.activity);
        var workflow = JSON.stringify(result.workflow);
        this.activityDefinition = activities;
        this.workflowModel = workflow;
        this.dataAvailable = true;
      },
      error => console.error(error)
    );
  }

  saveActivity() {
    let fd = this.editActivityForm.getRawValue();
    let activityDetail = {
      title: fd.title,
      name: fd.name,
      description: fd.description,
      textExpression: {
        expression: fd.expression,
        syntax: "Literal"
      }
    };
    this.selectedActivity.state = { ...activityDetail };
    this.workflowModel.activities.find(f => f.id == this.selectedActivity.id).state = this.selectedActivity.state;
    this.workflowModel = JSON.stringify(this.workflowModel);
    //this.workflowModel = {};
    this.dataAvailable = false
    setTimeout(() => { this.dataAvailable = true }, 0.1)
    this.editActivityForm.reset();
    this.selectedActivity = undefined;
  }

  addActivity(activity) {
    console.log(activity);
    let newActivity = {
      "id": this.uuidv4(),
      "type": activity.type,
      "left": 0,
      "top": 10,
      "state": {},
      "blocking": false,
      "executed": false,
      "faulted": false
    }
    debugger;
    this.workflowModel.activities.push(newActivity);
    this.workflowModel = JSON.stringify(this.workflowModel);
    this.dataAvailable = false
    setTimeout(() => { this.dataAvailable = true }, 0.1)
  }


  onWorkflowEdit(activityDetail: any) {
    console.log(activityDetail);
    let state = activityDetail.state;
    this.selectedActivity = activityDetail;
    this.editActivityForm.reset();
    this.editActivityForm = new FormGroup(
      { title: new FormControl(state.title), name: new FormControl(state.name), description: new FormControl(state.description), expression: new FormControl(state.textExpression ? state.textExpression.expression : '') },
    )
  }

}
