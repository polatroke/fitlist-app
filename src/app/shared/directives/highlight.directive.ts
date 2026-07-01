import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    standalone: true,
})
export class HighlightDirective {
    @Input('appHighlight') set highlight(value: string | null | undefined) {
        this.applyHighlight(value);
    }

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private renderer: Renderer2,
    ) { }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.renderer.setStyle(this.elementRef.nativeElement, 'box-shadow', '0 0 0 2px #ff3d3d');
        this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'translateY(-2px)');
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.renderer.removeStyle(this.elementRef.nativeElement, 'box-shadow');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'transform');
    }

    private applyHighlight(value: string | null | undefined): void {
        const color = value ? '#ff3d3d' : '#1f1f1f';
        this.renderer.setStyle(this.elementRef.nativeElement, 'border', `2px solid ${color}`);
    }
}
