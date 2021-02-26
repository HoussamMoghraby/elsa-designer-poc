import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WorkflowModel } from "./WorkflowModel";

@Injectable({
  providedIn: "root"
})
export class WorkflowService {
  constructor(private http: HttpClient) {}

  getWorkflow() {
    return this.http.get<WorkflowModel>("/assets/workflow.json");
  }
}
