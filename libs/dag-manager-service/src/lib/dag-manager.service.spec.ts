import { DagManagerService } from './dag-manager.service';
import { DagModelItem } from './interfaces/dag-model-item';

interface TestDagModel extends DagModelItem {
  name: string;
}

describe('DagManagerService', () => {
  let service: DagManagerService<TestDagModel>;

  beforeEach(() => {
    service = new DagManagerService<TestDagModel>();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* ***************************************************************************
		1
	2		3
		4
**************************************************************************** */
  it('should convert the simple array to a DAG model', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
    ];
    const result = service.convertArrayToDagModel(items);
    const expectedResult = [
      [{ branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 }],
      [
        { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
        { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      ],
      [{ branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 }],
    ];

    expect(result).toStrictEqual(expectedResult);
  });

  /* ***************************************************************************
		1
	2		3
	4
		5
**************************************************************************** */
  it('should convert a more complicated array to a DAG model', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 1, name: 'Step 5', parentIds: [4, 3], stepId: 5 },
    ];
    const result = service.convertArrayToDagModel(items);
    const expectedResult = [
      [{ branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 }],
      [
        { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
        { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      ],
      [{ branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 }],
      [{ branchPath: 1, name: 'Step 5', parentIds: [4, 3], stepId: 5 }],
    ];

    expect(result).toStrictEqual(expectedResult);
  });

  /* ***************************************************************************
		1
	5	6	7
2	3
  4
**************************************************************************** */
  it('should properly display the graph with a node that has three children', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [5], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [5], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
      { branchPath: 1, name: 'Step 5', parentIds: [1], stepId: 5 },
      { branchPath: 2, name: 'Step 6', parentIds: [1], stepId: 6 },
      { branchPath: 3, name: 'Step 7', parentIds: [1], stepId: 7 },
    ];
    const dagModel = [
      [{ branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 }],
      [
        { branchPath: 1, name: 'Step 5', parentIds: [1], stepId: 5 },
        { branchPath: 2, name: 'Step 6', parentIds: [1], stepId: 6 },
        { branchPath: 3, name: 'Step 7', parentIds: [1], stepId: 7 },
      ],
      [
        { branchPath: 1, name: 'Step 2', parentIds: [5], stepId: 2 },
        { branchPath: 2, name: 'Step 3', parentIds: [5], stepId: 3 },
      ],
      [{ branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 }],
    ];
    const result = service.convertArrayToDagModel(items);

    expect(result).toStrictEqual(dagModel);
  });

  /* ***************************************************************************
		1
	4		3

**************************************************************************** */
  it('should properly order the items on a row by branch path', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [1], stepId: 4 },
    ];
    const dagModel = [
      [{ branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 }],
      [
        { branchPath: 1, name: 'Step 4', parentIds: [1], stepId: 4 },
        { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      ],
    ];
    const result = service.convertArrayToDagModel(items);

    expect(result).toStrictEqual(dagModel);
  });

  it('should return if an item is found in a two dimensional array', () => {
    const dagModel = [
      [{ branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 }],
      [
        { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
        { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      ],
      [{ branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 }],
      [{ branchPath: 1, name: 'Step 5', parentIds: [4, 3], stepId: 5 }],
    ];
    const found1 = service.findInDoubleArray(1, dagModel);
    const found6 = service.findInDoubleArray(6, dagModel);

    expect(found1).toBe(0);
    expect(found6).toBe(-1);
  });

  /* ***************************************************************************
	1			|		1
2		3		|		5
	4			|	2		3
				|	    4
**************************************************************************** */
  it('should add an item to the array', () => {
    service.setNextNumber(5);
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [5], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [5], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
      { branchPath: 1, name: '', parentIds: [1], stepId: 5 },
    ];
    const itemsList = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
    ];
    const result = service.addItem([1], itemsList, 1, 1, { name: '' });

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|			1
2		3		|		5		6
	4			|	2	3
				|	  4
**************************************************************************** */
  it('should add two items to the array', () => {
    service.setNextNumber(5);
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [5], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [5], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
      { branchPath: 1, name: '', parentIds: [1], stepId: 5 },
      { branchPath: 2, name: '', parentIds: [1], stepId: 6 },
    ];
    const itemsList = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
    ];
    const result = service.addItem([1], itemsList, 2, 1, { name: '' });

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|			1
2		3		|		5	6	7
	4			|	2	3
				|	  4
**************************************************************************** */
  it('should add three items to the array', () => {
    service.setNextNumber(5);
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [5], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [5], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
      { branchPath: 1, name: '', parentIds: [1], stepId: 5 },
      { branchPath: 2, name: '', parentIds: [1], stepId: 6 },
      { branchPath: 3, name: '', parentIds: [1], stepId: 7 },
    ];
    const itemsList = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
    ];
    const result = service.addItem([1], itemsList, 3, 1, { name: '' });

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|			1
2		3		|		4		5
				|	2	3
				|
**************************************************************************** */
  it('should add two items to the array as a child to the first node and a parent to the original branch', () => {
    service.setNextNumber(4);
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [4], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [4], stepId: 3 },
      { branchPath: 1, name: '', parentIds: [1], stepId: 4 },
      { branchPath: 2, name: '', parentIds: [1], stepId: 5 },
    ];
    const itemsList = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
    ];
    const result = service.addItem([1], itemsList, 2, 1, { name: '' });

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|			1
2		3		|		2	3	5
	4			|		  4
				|
**************************************************************************** */
  it('should add a new child path from 1 at the same level as 2 and 3', () => {
    service.setNextNumber(5);
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
      { branchPath: 3, name: '', parentIds: [1], stepId: 5 },
    ];
    const itemsList = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
    ];
    const result = service.addItemAsNewPath(1, itemsList, 1, { name: '' });

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|			1
2		3		|		2  3  5	 6
	4			|		 4
				|
**************************************************************************** */
  it('should add a new child path from 1 at the same level as 2 and 3', () => {
    service.setNextNumber(5);
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
      { branchPath: 3, name: '', parentIds: [1], stepId: 5 },
      { branchPath: 4, name: '', parentIds: [1], stepId: 6 },
    ];
    const itemsList = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
    ];
    const result = service.addItemAsNewPath(1, itemsList, 2, { name: '' });

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|		1
2		3		|	2		3
4				|
**************************************************************************** */
  it('should remove a child at the end of the graph', () => {
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
    ];
    const itemsArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },

      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2, 3], stepId: 4 },
    ];
    const result = service.removeItem(4, itemsArray);

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|		1
	2			|		3
	3			|
**************************************************************************** */
  it('should remove a child with only a single child', () => {
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 3', parentIds: [1], stepId: 3 },
    ];
    const itemsArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 1, name: 'Step 3', parentIds: [2], stepId: 3 },
    ];
    const result = service.removeItem(2, itemsArray);

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|		1
2		3		|	2		5
4		5		|	4
**************************************************************************** */
  it('should remove the branch 2 child and rearrange', () => {
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 2, name: 'Step 5', parentIds: [1], stepId: 5 },
    ];
    const itemsArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 1, name: 'Step 5', parentIds: [3], stepId: 5 },
    ];
    const result = service.removeItem(3, itemsArray);

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	 1			|		2
2		3		|		4
4		5		|
**************************************************************************** */
  it('should remove a parent of nodes that branch and rearrange', () => {
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 2', parentIds: [0], stepId: 2 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
    ];
    const itemsArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 1, name: 'Step 5', parentIds: [3], stepId: 5 },
    ];
    const result = service.removeItem(1, itemsArray);

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|		2
2	3	4		|		5
5	6	7		|
**************************************************************************** */
  it('should remove all but the branch 1 child and rearrange', () => {
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 2', parentIds: [0], stepId: 2 },
      { branchPath: 1, name: 'Step 5', parentIds: [2], stepId: 5 },
    ];
    const itemsArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 3, name: 'Step 4', parentIds: [1], stepId: 4 },
      { branchPath: 1, name: 'Step 5', parentIds: [2], stepId: 5 },
      { branchPath: 1, name: 'Step 6', parentIds: [3], stepId: 6 },
      { branchPath: 1, name: 'Step 7', parentIds: [4], stepId: 7 },
    ];
    const result = service.removeItem(1, itemsArray);

    expect(result).toStrictEqual(expectedResultArray);
  });

  /* ***************************************************************************
	1			|		1
2	3	4		|	2	6	4
5	6	7		|	5		7
**************************************************************************** */
  it('should remove all but the branch 1 child and rearrange', () => {
    const expectedResultArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 3, name: 'Step 4', parentIds: [1], stepId: 4 },
      { branchPath: 1, name: 'Step 5', parentIds: [2], stepId: 5 },
      { branchPath: 2, name: 'Step 6', parentIds: [1], stepId: 6 },
      { branchPath: 1, name: 'Step 7', parentIds: [4], stepId: 7 },
    ];
    const itemsArray = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 3, name: 'Step 4', parentIds: [1], stepId: 4 },
      { branchPath: 1, name: 'Step 5', parentIds: [2], stepId: 5 },
      { branchPath: 1, name: 'Step 6', parentIds: [3], stepId: 6 },
      { branchPath: 1, name: 'Step 7', parentIds: [4], stepId: 7 },
    ];
    const result = service.removeItem(3, itemsArray);

    expect(result).toStrictEqual(expectedResultArray);
  });

  it('should return result if two nodes are siblings', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 3, name: 'Step 3', parentIds: [1], stepId: 3 },
    ];

    const result1 = service.areNodesSiblings(2, 3, items);
    const result2 = service.areNodesSiblings(1, 3, items);

    expect(result1).toBe(true);
    expect(result2).toBe(false);
  });

  it('should return the proper depth for a node', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 2, name: 'Step 5', parentIds: [2], stepId: 5 },
      { branchPath: 1, name: 'Step 6', parentIds: [5, 3], stepId: 6 },
    ];

    const depth1 = service.getNodeDepth(1, items);
    const depth3 = service.getNodeDepth(3, items);
    const depth5 = service.getNodeDepth(5, items);
    const depth6 = service.getNodeDepth(6, items);

    expect(depth1).toBe(0);
    expect(depth3).toBe(1);
    expect(depth5).toBe(2);
    expect(depth6).toBe(3);
  });

  it('should return if a node is a child of another node', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 2, name: 'Step 5', parentIds: [2], stepId: 5 },
      { branchPath: 1, name: 'Step 6', parentIds: [5, 3], stepId: 6 },
    ];

    const isChild1 = service.isNodeAChildOfParent(6, 1, items);
    const isChild2 = service.isNodeAChildOfParent(4, 3, items);
    const isChild3 = service.isNodeAChildOfParent(4, 6, items);
    const isChild4 = service.isNodeAChildOfParent(6, 4, items);
    const isChild5 = service.isNodeAChildOfParent(1, 4, items);

    expect(isChild1).toBe(true);
    expect(isChild2).toBe(false);
    expect(isChild3).toBe(false);
    expect(isChild4).toBe(false);
    expect(isChild5).toBe(false);
  });

  it('should return if two nodes would create a circular dependency', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 2, name: 'Step 5', parentIds: [2], stepId: 5 },
      { branchPath: 1, name: 'Step 6', parentIds: [5, 3], stepId: 6 },
    ];

    const result1 = service.wouldCreateCircularDependency(6, 1, items);
    const result2 = service.wouldCreateCircularDependency(5, 6, items);
    const result3 = service.wouldCreateCircularDependency(4, 6, items);

    expect(result1).toBe(false);
    expect(result2).toBe(true);
    expect(result3).toBe(false);
  });

  it('should return if a relationship can be added between two nodes', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 2, name: 'Step 5', parentIds: [2], stepId: 5 },
      { branchPath: 1, name: 'Step 6', parentIds: [5, 3], stepId: 6 },
    ];

    const result1 = service.canAddRelation(6, 4, items);
    const result2 = service.canAddRelation(5, 4, items);
    const result3 = service.canAddRelation(6, 1, items);
    const result4 = service.canAddRelation(6, 3, items);
    const result5 = service.canAddRelation(5, 3, items);

    expect(result1).toBe(true);
    expect(result2).toBe(false);
    expect(result3).toBe(false);
    expect(result4).toBe(false);
    expect(result5).toBe(true);
  });

  it('should return the proper number of children for a given node', () => {
    const items = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
      { branchPath: 2, name: 'Step 5', parentIds: [2], stepId: 5 },
      { branchPath: 1, name: 'Step 6', parentIds: [5, 3], stepId: 6 },
    ];
    service.setNewItemsArrayAsDagModel(items);

    const result1 = service.nodeChildrenCount(1);
    expect(result1).toBe(2);

    const result3 = service.nodeChildrenCount(3);
    expect(result3).toBe(1);
  });

  it('should add the relation between a parent and child node', () => {
    const items: Array<TestDagModel> = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 1, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [2], stepId: 4 },
    ];
    service.setNewItemsArrayAsDagModel(items);

    const returnedItems = service.addRelation(4, 3);

    const returnedItems4 = returnedItems.find(
      (i: TestDagModel) => i.stepId === 4
    );
    expect(returnedItems4.parentIds).toStrictEqual([2, 3]);
  });

  it('should throw an error if a relationship cannot be made between two nodes', () => {
    const items: Array<TestDagModel> = [
      { branchPath: 1, name: 'Parent', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Child', parentIds: [1], stepId: 2 },
    ];
    service.setNewItemsArrayAsDagModel(items);

    try {
      service.addRelation(2, 1);
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.message).toBe(
        'DagManagerService error: Cannot add parent ID 1 to child 2'
      );
    }
  });

  /* ***************************************************************************
		1			|			1
	2		3		|		4		3
					|		2
	**************************************************************************** */
  it('should insert a node between two others', () => {
    const items: Array<TestDagModel> = [
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [1], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
    ];
    service.setNextNumber(4);
    service.setNewItemsArrayAsDagModel(items);

    const updated = service.insertNode(2, {
      branchPath: null,
      name: 'Step 4',
      parentIds: [],
      stepId: null,
    });
    console.log(JSON.stringify(updated, null, 2));

    expect(updated).toStrictEqual([
      { branchPath: 1, name: 'Step 1', parentIds: [0], stepId: 1 },
      { branchPath: 1, name: 'Step 2', parentIds: [4], stepId: 2 },
      { branchPath: 2, name: 'Step 3', parentIds: [1], stepId: 3 },
      { branchPath: 1, name: 'Step 4', parentIds: [1], stepId: 4 },
    ]);
  });
});
