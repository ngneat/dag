import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkflowItem } from '../landing/landing.component';

@Component({
  selector: 'ngneat-dag-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent {
  @Input() item: WorkflowItem;
  @Output() addItem: EventEmitter<{
    parentIds: number[];
    numberOfChildren: number;
  }> = new EventEmitter<{ parentIds: number[]; numberOfChildren: number }>();
  @Output() removeItem: EventEmitter<{ stepId: number }> = new EventEmitter<{
    stepId: number;
  }>();
  public numberOfChildren = 0;

  addChildren() {
    this.addItem.emit({
      parentIds: [this.item.stepId],
      numberOfChildren: this.numberOfChildren,
    });
  }

  removeThisItem() {
    this.removeItem.emit({
      stepId: this.item.stepId,
    });
  }
}
