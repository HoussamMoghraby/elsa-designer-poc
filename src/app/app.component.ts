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

  constructor(http: HttpClient, private workflowService: WorkflowService) { }

  editActivityForm: FormGroup = new FormGroup(
    { title: new FormControl(''), name: new FormControl(''), description: new FormControl(''), expression: new FormControl('') },
  )

  ngOnInit() {
    this.workflowService.getWorkflow().subscribe(
      result => {
        var activities = JSON.stringify(result.activity);
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
    debugger;
    this.workflowModel.activities.find(f => f.id == this.selectedActivity.id).state = this.selectedActivity.state;
    this.workflowModel = JSON.stringify(this.workflowModel);
    //this.workflowModel = {};
    this.dataAvailable = false
    setTimeout(() => { this.dataAvailable = true }, 0.1)
    this.editActivityForm.reset();
    this.selectedActivity = undefined;
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
