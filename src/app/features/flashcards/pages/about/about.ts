import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {J6nLogoComponent} from "../../components/j6n-logo-component/j6n-logo-component";

@Component({
    selector: 'app-about',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [RouterLink, J6nLogoComponent],
    templateUrl: './about.html',
    styleUrls: ['./about.scss']
})
export class About {
}
