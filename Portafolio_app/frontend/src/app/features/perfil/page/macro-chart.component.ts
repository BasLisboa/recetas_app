import { AfterViewInit, Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-macro-chart',
  template: '<canvas #canvas></canvas>',
  standalone: true,
  imports: [CommonModule]
})
export class MacroChartComponent implements AfterViewInit, OnChanges {
  @Input() data: any;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.data = this.data;
      this.chart.update();
    }
  }

  private renderChart() {
    if (this.canvasRef) {
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'doughnut',
        data: this.data,
      });
    }
  }
}