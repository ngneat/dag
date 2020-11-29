import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DagManagerService, DagModelItem } from '@ngneat/dag';
import { Observable } from 'rxjs';

declare let LeaderLine: any;

export interface WorkflowItem extends DagModelItem {
  name: string;
}

@Component({
  selector: 'ngneat-dag-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [DagManagerService],
})
export class LandingComponent implements OnInit, AfterViewInit {
  @ViewChildren('boxes', { read: ElementRef }) boxes: QueryList<ElementRef>;
  private startingItems: WorkflowItem[] = [
    { name: 'Step 1', stepId: 1, parentIds: [0], branchPath: 1 },
  ];
  private linesArr = [];
  public workflow$: Observable<WorkflowItem[][]>;

  constructor(private _dagManager: DagManagerService<WorkflowItem>) {}

  ngOnInit(): void {
    this._dagManager.setNextNumber(2);
    this._dagManager.setNewItemsArrayAsDagModel(this.startingItems);
    this.workflow$ = this._dagManager.dagModel$;
  }

  ngAfterViewInit() {
    this.boxes.changes.subscribe((list) => {
      this.removeLines();
      this.drawLines();
    });
    this.drawLines();
  }

  removeLines() {
    this.linesArr.forEach((line) => line.remove());
    this.linesArr = [];
  }

  drawLines() {
    const boxItems = this._dagManager.getSingleDimensionalArrayFromModel();
    console.log('boxItems:', boxItems);

    boxItems.forEach((box: WorkflowItem) => {
      box.parentIds.forEach((parentId: number) => {
        if (parentId > 0) {
          const parent: ElementRef<any> = this.boxes.find(
            (b: ElementRef) => parentId === +b.nativeElement.children[0].id
          );
          const self: ElementRef<any> = this.boxes.find(
            (b: ElementRef) => +b.nativeElement.children[0].id === box.stepId
          );
          if (parent && self) {
            const line = new LeaderLine(
              parent.nativeElement,
              self.nativeElement,
              {
                startSocket: 'bottom',
                endSocket: 'top',
                endPlug: 'behind',
              }
            );

            this.linesArr.push(line);
          }
        }
      });
    });
  }

  addItem({
    parentIds,
    numberOfChildren,
  }: {
    parentIds: number[];
    numberOfChildren: number;
  }) {
    this._dagManager.addNewStep(parentIds, numberOfChildren, 1, { name: '' });
  }

  removeItem({ stepId }: { stepId: number }) {
    this._dagManager.removeStep(stepId);
  }
}
