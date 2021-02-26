import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from "@angular/core";
// require('@elsa-workflows/elsa-workflow-designer');

@Component({
  selector: "ng-wf-designer-host",
  template: `
  <!-- <div>
    <button (click)="onAddActivity()">Add new Activity</button>
  </div> -->
    <wf-designer-host
      #wfhost
      id="designerHost"
      canvas-height="300vh"
      [attr.data-activity-definitions]="activityDefinition"
      [(attr.data-workflow)]="workflowModel"
    >
    </wf-designer-host>
  `
})
export class NGWFDesignerHostComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input()
  public activityDefinition;
  @Input()
  public workflowModel;
  @Output()
  public workflowModelChange = new EventEmitter();
  @Output()
  public workflowModelEdit = new EventEmitter();
  @ViewChild("wfhost")
  public wfhost: any;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workflowModel && changes.workflowModel.currentValue && !changes.workflowModel.firstChange) {
      console.log(changes);
      //this.workflowModel = {}
      console.log(changes.workflowModel.currentValue);
      this.workflowModel = { ...changes.workflowModel.currentValue };
      this.cdr.detectChanges();
    }
  }

  onAddActivity() {
    console.log(this.wfhost);
    this.wfhost.nativeElement.showActivityPicker()
  }

  ngAfterViewInit() {
    this.wfhost.nativeElement.addEventListener("workflowChanged", e =>
      this.workflowChange(e)
    );

    this.wfhost.nativeElement.addEventListener("edit-activity", e => {
      e.preventDefault();
      this.workflowModelEdit.emit(e.detail);
    })
  }


  ngOnDestroy() {
    this.wfhost.nativeElement.removeEventListener("workflowChanged", {});
    this.wfhost.nativeElement.removeEventListener("edit-activity", {});
  }

  workflowChange(event) {
    this.workflowModelChange.emit(event.detail);
  }
}
