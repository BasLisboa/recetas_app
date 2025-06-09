import { AfterViewInit, Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-imc-chart',
  template: '<canvas #canvas></canvas>',
  standalone: true,
  imports: [CommonModule]
})
export class ImcChartComponent implements AfterViewInit, OnChanges {
  @Input() data: any;
  @Input() options: any;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.data = this.data;
      this.chart.options = this.options;
      this.chart.update();
    }
  }

  private renderChart() {
    if (this.canvasRef) {
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'bar',
        data: this.data,
        options: this.options,
      });
    }
  }
}