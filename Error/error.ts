import { Request, Response } from "express";


export default function errorHandler(error: Error, req: Request, res: Response) {
    if (error instanceof IncorrectAccount) {
        if (error.ernum === false) // false user does not exist
            res.status(410);
        else
            res.status(411);
        res.send(error.message);
    }
    else if (error instanceof ReimbursementError) {
        res.status(501);
        res.send(error.message);
    }
}

export class IncorrectAccount extends Error {
    ernum: boolean;
    constructor(message: string, ernum: boolean, ...params) {
        super(...params);
        this.message = message;
        this.ernum = ernum;
    }
}

export class ReimbursementError extends Error {
    constructor(message: string) {
        super(message);
    }
}