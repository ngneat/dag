import { Injectable } from '@angular/core';
import { DagModelItem } from './interfaces/dag-model-item';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DagManagerService<T extends DagModelItem> {
  private dagModelBs: BehaviorSubject<Array<Array<T>>> = new BehaviorSubject<
    Array<Array<T>>
  >(null);
  public dagModel$: Observable<
    Array<Array<T>>
  > = this.dagModelBs.asObservable();
  private nextStepNumber: number;

  setNextNumber(num: number) {
    this.nextStepNumber = num;
  }

  setNewItemsArrayAsDagModel(arr: T[]) {
    const multi: Array<Array<T>> = this.convertArrayToDagModel(arr);
    this.dagModelBs.next(multi);
  }

  getCurrentDagModel() {
    return this.dagModelBs.getValue();
  }

  getSingleDimensionalArrayFromModel() {
    return this.convertDagModelToSingleArray(this.dagModelBs.getValue());
  }

  convertDagModelToSingleArray(arr: Array<Array<T>>): Array<T> {
    // eslint-disable-next-line
    return [].concat.apply([], arr);
  }

  convertArrayToDagModel(itemsArray: Array<T>): Array<Array<T>> {
    const result = [];
    const levels = {};

    const modify = (data, pid = 0, level = 0) =>
      data
        .filter(({ parentIds, stepId }) => {
          if (levels[level] && levels[level].includes(stepId)) return false;
          return parentIds.includes(pid);
        })
        .forEach((e) => {
          if (!levels[level]) levels[level] = [];
          levels[level].push(e.stepId);

          if (this.findInDoubleArray(e.stepId, result) === -1) {
            if (!result[level]) result[level] = [e];
            else result[level].push(e);
          }

          // sort by branchPath on a given level
          if (result[level - 1]) {
            const sortedResults: Array<T> = [];
            result[level - 1].forEach((i: T) => {
              const childrenArray = result[level].filter((ch: T) =>
                ch.parentIds.includes(i.stepId)
              );
              childrenArray.sort((a: T, b: T) =>
                a.branchPath > b.branchPath ? 1 : -1
              );
              sortedResults.push(...childrenArray);
            });
            result[level] = [...sortedResults];
          }

          modify(data, e.stepId, level + 1);
        });

    modify(itemsArray);
    return result;
  }

  findInDoubleArray(idToFind: number, doubleArr: Array<Array<T>>): number {
    const flat: Array<T> = this.convertDagModelToSingleArray(doubleArr);
    return flat.findIndex((item) => item.stepId === idToFind);
  }

  removeItem(
    idToRemove: number,
    flatArray: Array<T>,
    isChildOfDeletedBranch = false
  ): Array<T> {
    const children: Array<T> = flatArray.filter((item: T) =>
      item.parentIds.includes(idToRemove)
    );
    const childBranchPath1: T = children.find((i) => i.branchPath === 1);
    const childrenNotBranchPath1: Array<T> = children.filter(
      (i) => i.branchPath > 1
    );
    const itemToRemove: T = flatArray.find((i) => i.stepId === idToRemove);

    // if the item that will be removed has multiple children, we have to figure out which to keep and which to delete
    if (children.length > 1) {
      // keep descendants of children.branchPath = 1 if it exists
      if (childBranchPath1) {
        // Set child.branchPath === 1 to itemToRemove.branchPath
        childBranchPath1.branchPath = itemToRemove.branchPath;
        // set child.branchPath === 1.parentIds = itemToRemove.parentIds
        if (childBranchPath1.parentIds.length === 1) {
          childBranchPath1.parentIds = [...itemToRemove.parentIds];
        } else {
          const idxToRemove = childBranchPath1.parentIds.findIndex(
            (i) => i === idToRemove
          );
          childBranchPath1.parentIds.splice(idxToRemove, 1);
        }
      }

      // remove descendants of children.branchPath > 1;
      for (const childToBeRemoved of childrenNotBranchPath1) {
        flatArray = this.removeItem(childToBeRemoved.stepId, flatArray, true);
      }
    } else if (children.length === 1) {
      // if the lone child has only one parent, then just go ahead and remove that item
      if (children[0].parentIds.length === 1) {
        if (isChildOfDeletedBranch) {
          flatArray = this.removeItem(
            children[0].stepId,
            flatArray,
            isChildOfDeletedBranch
          );
        } else {
          children[0].parentIds = [...itemToRemove.parentIds];
          children[0].branchPath = itemToRemove.branchPath;
        }
      } else {
        // if the lone child has more than one parent id, then remove the item which is being removed from the parentIds array
        const idxToRemove = children[0].parentIds.findIndex(
          (i) => i === idToRemove
        );
        children[0].parentIds.splice(idxToRemove, 1);
      }
    }

    const itemToRemoveIdx: number = flatArray.findIndex(
      (i) => i.stepId === idToRemove
    );
    flatArray.splice(itemToRemoveIdx, 1);

    return flatArray;
  }

  createChildrenItems(
    startingBranch,
    numberOfChildren,
    parentIds,
    genericFields: Omit<T, keyof DagModelItem>
  ): Array<T> {
    const newChildren: Array<T> = [];
    for (let count = 1; count <= numberOfChildren; count++) {
      const newItem: T = <T>{
        ...genericFields,
        branchPath: startingBranch++,
        parentIds: [...parentIds],
        stepId: this.nextStepNumber++,
      };
      newChildren.push(newItem);
    }

    return newChildren;
  }

  addItem(
    parentIds: number[],
    flatArray: Array<T>,
    numberOfChildren = 1,
    startingBranch = 1,
    genericFields: Omit<T, keyof DagModelItem>
  ): Array<T> {
    const potentialChildrenIds: number[] = [];
    parentIds.forEach((pid) => {
      return flatArray
        .filter((f: T) => f.parentIds.includes(pid))
        .forEach((id: T) => potentialChildrenIds.push(id.stepId));
    });

    const newChildren: Array<T> = this.createChildrenItems(
      startingBranch,
      numberOfChildren,
      parentIds,
      genericFields
    );

    potentialChildrenIds.forEach((childId: number) => {
      const child = flatArray.find((i: T) => i.stepId === childId);

      parentIds.forEach((pid: number) => {
        const oldParentIdIndex = child.parentIds.findIndex(
          (cpid: number) => cpid === pid
        );
        child.parentIds.splice(oldParentIdIndex, 1);
        child.parentIds.push(newChildren[0].stepId);
      });
    });

    return [...flatArray, ...newChildren];
  }

  addItemAsNewPath(
    parentId: number,
    flatArray: Array<T>,
    numberOfChildren: number,
    genericFields: Omit<T, keyof DagModelItem>
  ): Array<T> {
    const currentChildrenOfParent: Array<T> = flatArray
      .filter((item) => item.parentIds.includes(parentId))
      .sort((a, b) => (a.branchPath > b.branchPath ? 1 : -1));
    const nextBranch: number =
      currentChildrenOfParent[currentChildrenOfParent.length - 1].branchPath +
      1;
    const newChildren: Array<T> = this.createChildrenItems(
      nextBranch,
      numberOfChildren,
      [parentId],
      genericFields
    );

    return [...flatArray, ...newChildren];
  }

  getNodeDepth(stepId: number, items: Array<T>): number {
    const item: T = items.find((i) => i.stepId === stepId);
    let depth = 0;

    if (!item.parentIds.includes(0)) {
      const allDepths: number[] = [];
      for (const itemParentId of item.parentIds) {
        depth = 1 + this.getNodeDepth(itemParentId, items);
        allDepths.push(depth);
      }
      depth = allDepths.sort((x, y) => (x - y ? 1 : -1))[0];
    }

    return depth;
  }

  canAddRelation(childId: number, parentId: number, items: Array<T>) {
    const childItem: T = items.find((item: T) => item.stepId === childId);
    const parentItem: T = items.find((item: T) => item.stepId === parentId);
    if (!childItem || !parentItem) {
      return false;
    }

    // does child already have parentId
    const isAlreadyChild: boolean = this.isNodeAChildOfParent(
      childId,
      parentId,
      items
    );

    // the parentId can not be a sibling to childId
    const nodesAreSiblings: boolean = this.areNodesSiblings(
      childId,
      parentId,
      items
    );

    // the child needs to be deeper than the parent
    const childDepth: number = this.getNodeDepth(childId, items);
    const parentDepth: number = this.getNodeDepth(parentId, items);
    const childIsDeeper: boolean = childDepth > parentDepth;

    // No circular parentIds
    const circularDependency: boolean = this.wouldCreateCircularDependency(
      childId,
      parentId,
      items
    );

    return (
      !isAlreadyChild &&
      !nodesAreSiblings &&
      childIsDeeper &&
      !circularDependency
    );
  }

  wouldCreateCircularDependency(
    id1: number,
    id2: number,
    items: Array<T>
  ): boolean {
    const item1: T = items.find((item: T) => item.stepId === id1);
    const item2: T = items.find((item: T) => item.stepId === id2);

    return item1.parentIds.includes(id2) || item2.parentIds.includes(id1);
  }

  isNodeAChildOfParent(childId, parentId, items): boolean {
    const childItem: T = items.find((item: T) => item.stepId === childId);
    const parentItem: T = items.find((item: T) => item.stepId === parentId);

    if (!childItem || !parentItem) {
      return false;
    }

    let isParent: boolean = childItem.parentIds.includes(parentId);

    if (!isParent) {
      for (const childParentId of childItem.parentIds) {
        isParent = this.isNodeAChildOfParent(childParentId, parentId, items);

        if (isParent) break;
      }
    }

    return isParent;
  }

  areNodesSiblings(node1Id: number, node2Id: number, items: Array<T>): boolean {
    const node1: T = items.find((item: T) => item.stepId === node1Id);
    const node2: T = items.find((item: T) => item.stepId === node2Id);

    if (!node1 || !node2) {
      return false;
    }

    let found = false;
    for (const parentId of node1.parentIds) {
      found = node2.parentIds.includes(parentId);

      if (found) break;
    }

    return found;
  }

  addNewStep(
    parentIds: number[],
    numberOfChildren: number,
    startingBranch = 1,
    genericFields: Omit<T, keyof DagModelItem>
  ): void {
    const updatedItems: Array<T> = this.addItem(
      parentIds,
      this.getSingleDimensionalArrayFromModel(),
      numberOfChildren,
      startingBranch,
      genericFields
    );
    const dagModel = this.convertArrayToDagModel(updatedItems);
    this.dagModelBs.next(dagModel);
  }

  addNewStepAsNewPath(
    parentId: number,
    numberOfChildren: number,
    genericFields: Omit<T, keyof DagModelItem>
  ): void {
    const updatedItems: Array<T> = this.addItemAsNewPath(
      parentId,
      this.getSingleDimensionalArrayFromModel(),
      numberOfChildren,
      genericFields
    );
    const dagModel = this.convertArrayToDagModel(updatedItems);
    this.dagModelBs.next(dagModel);
  }

  removeStep(idToRemove: number): void {
    const updatedItems: Array<T> = this.removeItem(
      idToRemove,
      this.getSingleDimensionalArrayFromModel(),
      false
    );
    const dagModel = this.convertArrayToDagModel(updatedItems);
    this.dagModelBs.next(dagModel);
  }
}
