import { Component, OnInit } from '@angular/core';
import { DagManagerService, DagModelItem } from '@ngneat/dag';
import { Observable } from 'rxjs';

interface WorkflowItem extends DagModelItem {
  name: string;
}

@Component({
  selector: 'ngneat-dag-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [DagManagerService],
})
export class LandingComponent implements OnInit {
  private startingItems: WorkflowItem[] = [
    { name: 'Step 1', stepId: 1, parentIds: [0], branchPath: 1 },
  ];
  public workflow$: Observable<WorkflowItem[][]>;

  constructor(private _dagManager: DagManagerService<WorkflowItem>) {}

  ngOnInit(): void {
    this._dagManager.setNextNumber(2);
    this._dagManager.setNewItemsArrayAsDagModel(this.startingItems);
    this.workflow$ = this._dagManager.dagModel$;
  }
}
