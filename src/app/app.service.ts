import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AppService {

    private _jsonURL = 'assets/devices.json';
    private _apiUrl = "https://ec2rfkpysh.execute-api.us-west-2.amazonaws.com/dev/manual-devices/view";

    constructor(private httpClient: HttpClient) {}

    getDevicesDetails() {
        return this.httpClient.get(this._apiUrl).pipe(map(result => result));
    }
}