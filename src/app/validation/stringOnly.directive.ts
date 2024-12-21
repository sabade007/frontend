import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: 'input[stringOnly]'
})
export class StringDirective {

    constructor(private _el: ElementRef) { }

    @HostListener('input', ['$event']) onInputChange(event) {

        let initalValue = this._el.nativeElement.value;
        initalValue = initalValue.replace(/_/g, "");
        initalValue = initalValue.replace('^', "");
        initalValue = initalValue.replace('\\', "");
        this._el.nativeElement.value = initalValue.replace(/[^a-zA-z ]+/g, '');
        if ( initalValue !== this._el.nativeElement.value) {
            event.stopPropagation();
        }
    }

}
