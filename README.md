<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()

@ngneat/dag is designed to assist in creating and managing a [directed acycylic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) model in an Angular application. You can think of a DAG as a workflow where a user adds steps and based on given criteria continues on to the next step or steps. With this library, you can add or remove steps to the DAG and the model will be properly updated. With this part of the workflow being managed by the service, you can focus on what the workflow does rather than how to let the user build it.

## Features

- ✅ Create and manage a directed acyclic graph model in you Angular application
- ✅ Add or remove items
- ✅ Convert the DAG model to a single dimensional array

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [FAQ](#faq)

## Installation

### NPM

`npm install @ngneat/dag`

### Yarn

`yarn add @ngneat/dag`

## Usage

The first thing to note is that this service is not provided in the root of the Angular application. The reasoning for this is because each time a DAG model needs to be created, a new instance of the service should be created. This means that when you import the service into a component, you should add it to the component's `providers` array.

```ts
// workflow-builder.component.ts
@Component({
  selector: 'app-workflow-builder',
  ...
  providers: [DagManagerService]
})
export class WorkflowBuilderComponent {}
```

Each time the component is activated, a new instance of this service will be created. This ensures that there will not be any previous data still in the service when you go to the component; you'll start fresh each time.

The next step when using the service is to define an interface or class that extends the included `DagModelItem` interface provided in this library. Your interface and class can have any number of attributes on it, but extending the `DagModelItem` ensures that the correct attributes will be present for the `DagManagerService` to properly work. Here's the `DagModelItem` interface:

```ts
// dag-model-item.interface.ts
export interface DagModelItem {
  stepId: number;
  parentIds: number[];
  branchPath: number;
}
```

The `stepId` is a unique identifier for a given step. The number doesn't matter, as long as it is unique in any given workflow. The `parentIds` is an array of `stepId`s that are direct parents of a given step. With the DAG model, each step doesn't need to know what its children steps are as long as the parent IDs are tracked. The `branchPath` attribute defines how a workflow is traversed if a step has multiple children steps. Think of a step using if/else logic. If a given set of criteria is `true`, the workflow would traverse `branchPath` one, and if the criteria is `false` it would traverse `branchPath` two. The `branchPath` itself doesn't matter technically; the `false` path could be `branchPath` 1 if you want. The steps are ordered though by `branchPath` in ascending order.

After creating your interface or class, you should provide that in angle brackets when declaring the service in the component's constructor. This allows for the service to know more about the items as the DAG model is being managed.

```ts
// workflow-item.interface.ts
export interface WorkflowItem extends DagModelItem {
  name: string;
  id: string;
}

// workflow-builder.compoonent.ts
export class WorkflowBuilderComponent {
  constructor(private _dagManager: DagManagerService<WorkflowItem>) {}
}
```

After creating an instance of the service, one of the first things that should be done in the `ngOnInit` method is to determine what the next `stepId` should be when an item is created. If you're creating a new workflow, you can start with 1. If you're loading a saved workflow to edit it, you should find the highest ID in the loaded workflow and start at the next number. This will ensure that no two items have the same `stepId`.

```ts
// workflow-builder.component.ts
export class WorkflowBuilderComponent implements OnInit {
  constructor(private _dagManager: DagManagerService<WorkflowItem>) {}

  ngOnInit() {
    const nextItemNumber =
      this.startingItems && this.startingItems.length
        ? getMaxItemNumber(this.startingItems)
        : 1;
    this._dagManager.setNextNumber(nextItemNumber);
  }

  getMaxItemNumber(arr: WorkflowItem) {
    return (
      Math.max.apply(
        Math,
        arr.map((i) => i.stepId)
      ) + 1
    );
  }
}
```

At this point, you are now ready to start having the service manage your DAG model. When the component loads, the service should be provided with an array of items that extend the `DagModelItem`. This could be a new array if the workflow is new, or the array could come from a database. Again, this should be a single dimension array of those items. The service will provide an observable of the DAG model which is a two dimensional array of these items, but we'll talk about that momentarily. Here's an example of priming the service with the starting items:

```ts
// workflow-builder.component.ts
export class WorkflowBuilderComponent implements OnInit {
  startingItems: WorkflowItem[] = [
    {
      id: 1,
      name: 'Step 1',
      stepId: 1,
      parentIds: [0],
      branchPath: 1,
    },
  ];

  constructor(private _dagManager: DagManagerService<WorkflowItem>) {}

  ngOnInit() {
    this._dagManager.setNewItemsArrayAsDagModel(this.startingItems);
  }
}
```

A couple things to note here. First, all items need to have a `parentIds` array, even if the only item in the array is 0. This means that the step is the very starting point of the workflow. Also, every step should have a `branchPath`, regardless of if it has any siblings coming from a given parent.

When this method is called on the service, the DAG model observable from the service emits a new value. The type of that value is a two dimensional array of the provided class or interface, such as `WorkflowItem[][]`. If you don't want to use the observable, you can use the `getCurrentDagModel` method to get the current DAG model from the service, or the `getSingleDimensionalArrayFromModel` to get the DAG model as a single dimensional array. There are multiple ways to manage the model.

## FAQ

## How to ...

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid assumenda atque blanditiis cum delectus eligendi ips

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Logo Attribution

<div>Logo made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
