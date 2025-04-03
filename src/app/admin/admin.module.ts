import { NgModule } from '@angular/core';

// Import admin routing module
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    imports: [
        AdminRoutingModule
    ],
    providers: []
})
export class AdminModule {
    constructor() {
        console.log('Admin Module loaded');
    }
}
