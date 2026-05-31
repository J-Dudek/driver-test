import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {J6nLogoComponent} from "../../components/j6n-logo-component/j6n-logo-component";

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, J6nLogoComponent],
    templateUrl: './about.html',
    styleUrls: ['./about.scss']
})
export class About {
}
