import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let mockDagManagerService;

  beforeEach(() => {
    component = new LandingComponent(mockDagManagerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
