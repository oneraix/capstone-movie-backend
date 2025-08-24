import { statusCodes } from "./status-code.helper.js";

export class BadrequestException extends Error{
    constructor(message ="BadrequestException"){
        super(message);
        this.code = statusCodes.BAD_REQUEST
    }
}

export class UnauthorizedException extends Error{
    constructor(message= "UnauthorizedException"){
        super(message);
        this.code = statusCodes.UNAUTHORIZED;
    }
}

