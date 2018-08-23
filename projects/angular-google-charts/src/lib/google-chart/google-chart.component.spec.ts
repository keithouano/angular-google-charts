import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleChartComponent } from './google-chart.component';
import { ScriptLoaderService } from '../script-loader/script-loader.service';

describe('ChartComponent', () => {
  let component: GoogleChartComponent;
  let fixture: ComponentFixture<GoogleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleChartComponent ],
      providers: [
        ScriptLoaderService
      ]
    })
    .compileComponents();
  }));

  function findInChildren(parent: HTMLElement, comparison: (el: HTMLElement) => boolean): HTMLElement {
    const children = Array.from(parent.children);
    for(let child of children) {
      if (comparison(<HTMLElement>child)) {
        return <HTMLElement>child;
      } else {
        let found = findInChildren(<HTMLElement>child, comparison);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  it('should fire ready events', (done) => {
    fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = "BarChart";
      component.data = [
        ['Copper', 8.94],
        ['Silver', 10.49],
        ['Gold', 19.30],
        ['Platinum', 21.45]
      ];
      component.columnNames = ['Element', 'Density'];
  
      fixture.detectChanges();

      component.ready.subscribe(() => {
        done();
      });
  });

  describe('BarChart tests', () => {
    beforeEach((done) => {
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = "BarChart";
      component.title = "My Bar Chart";
      component.data = [
        ['Copper', 8.94],
        ['Silver', 10.49],
        ['Gold', 19.30],
        ['Platinum', 21.45]
      ];
      component.columnNames = ['Element', 'Density'];
  
      fixture.detectChanges();

      component.ready.subscribe(() => {
        done();
      });
    });

    it('should load the corechart package', () => {
      expect(google.visualization.BarChart).toBeDefined();
      expect(google.visualization.AreaChart).toBeDefined();
      expect(google.visualization.BubbleChart).toBeDefined();
    });

    it('should render a simple bar chart', () => {
      const chartElement = component.getChartElement();
      expect(chartElement).not.toBeNull();
    });
  
    it('should set the title correctly', () => {
      const chartElement = component.getChartElement();
      const title = findInChildren(chartElement, element => element.textContent === "My Bar Chart");
      expect(title).not.toBeNull();
    });

    it('should format the data', (done) => {
      component.roles = [{ role: 'style', type: 'string' }];
      component.data = [
        ['Copper', 8.94, '#b87333'],
        ['Silver', 10.49, 'silver'],
        ['Gold', 19.30, 'gold'],
        ['Platinum', 21.45, 'color: #e5e4e2' ],
      ];

      component.ready.subscribe(() => {
        const chartElement = component.getChartElement();
        const copperBar = findInChildren(chartElement, element => {
          const attr = element.attributes.getNamedItem("stroke");
          return attr ? attr.value === "#b87333" : false;
        });
        
        const silverBar = findInChildren(chartElement, element => {
          const attr = element.attributes.getNamedItem("stroke");
          return attr ? attr.value === "#c0c0c0" : false;
        });
        const goldBar = findInChildren(chartElement, element => {
          const attr = element.attributes.getNamedItem("stroke");
          return attr ? attr.value === "#ffd700" : false;
        });

        expect(copperBar).not.toBeNull();
        expect(silverBar).not.toBeNull();
        expect(goldBar).not.toBeNull();
        
        done();
      });

      component.ngOnChanges();
    });
  });

  describe('events', () => {
    beforeEach((done) => {
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = "BarChart";
      component.title = "My Bar Chart";
      component.data = [
        ['Copper', 8.94],
        ['Silver', 10.49],
        ['Gold', 19.30],
        ['Platinum', 21.45]
      ];
      component.columnNames = ['Element', 'Density'];
  
      fixture.detectChanges();

      component.ready.subscribe(() => {
        done();
      });
    });

    it('should fire hover events', async(() => {
      // TODO
    }));

    it('should fire select event', async(() => {
      // TODO
    }));
  });

  describe('advanced charts', () => {
    it('should load the table chart package', (done) => {
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = "Table";
      component.data = [];
      component.columnNames = [];
  
      fixture.detectChanges();

      component.ready.subscribe(() => {
        expect(google.visualization.Table).toBeDefined();

        done();
      });
    });

    it('should load the material chart package', async(() => {
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = "Bar";
      component.data = [];
      component.columnNames = [];
  
      fixture.detectChanges();

      component.ready.subscribe(() => {
        expect((<any>google.charts).Bar).toBeDefined();
      });
    }));
  });
});