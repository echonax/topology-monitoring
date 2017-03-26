"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/toPromise");
let SignUpComponent = class SignUpComponent {
    constructor(router, http) {
        this.router = router;
        this.http = http;
        this.model = { username: "", password: "" };
    }
    onSubmit() {
        let headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        let options = new http_1.RequestOptions({ headers: headers });
        this.http.post("http://localhost:9999/signup", this.model, options)
            .map((res) => { return res; })
            .catch((err) => { console.log(err); return err; })
            .toPromise()
            .then((res) => {
            console.log(res);
            if (res._body == 23505) {
                alert("username exists");
            }
            else if (res._body == "yes") {
                alert("successfully created");
            }
        });
    }
};
SignUpComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'signup-comp',
        templateUrl: 'signup.component.html'
    }),
    __metadata("design:paramtypes", [router_1.Router, http_1.Http])
], SignUpComponent);
exports.SignUpComponent = SignUpComponent;
//# sourceMappingURL=signup.component.js.map