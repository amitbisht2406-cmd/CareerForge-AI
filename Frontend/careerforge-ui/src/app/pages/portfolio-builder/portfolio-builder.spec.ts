import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBuilder } from './portfolio-builder';

describe('PortfolioBuilder', () => {
  let component: PortfolioBuilder;
  let fixture: ComponentFixture<PortfolioBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
