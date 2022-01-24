import { Account, Reimbursement } from "./entities";

export interface CustomLogger {
    logger(data, req): string;
    logAccount(data, req): string;
    logReimbursement(data, req): string;
}

export default class CustomLoggerImpl implements CustomLogger {
    logAccount(data, req): string {
        const acc: Account = data;
        return `Made a request to ${req} \n\t response: ${acc.fname} ${acc.lname}'s account is being called`;
    }
    logReimbursement(data, req): string {
        const reim: Reimbursement = data;
        return `Made a request to ${req} \n\t response: ${reim.name} reimbursement under ${reim.account.fname} account is being called`;
    }
    logger(data, req): string {
        let response = '';
        const date = new Date().toString();
        let arr = [];
        if (data === null) {
            response = `made a request to ${req}`;
        }
        else {
            for (const key in data) {
                arr.push(key);
            }
            if (arr[2] == 'username') {
                response = this.logAccount(data, req);
            }
            else if (arr[2] == 'account') {
                response = this.logReimbursement(data, req);
            }
            else {
                response = `Made a request to ${req} \n\t for: ${data}`
            }
        }
        return response + '\n  At: ' + date;
    }
}