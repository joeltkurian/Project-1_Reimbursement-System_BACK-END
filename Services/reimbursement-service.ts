import { ReimbursementDao } from "../DAOS/reimbursementDAO";
import { Account, Reimbursement } from "../entities";
import { ReimbursementError } from "../Error/error";
import { checkAccountService } from "./checkAccount-service";


export interface ReimbursementService {
    createReimbursement(accountId: string, name: string, amount: number): Promise<Reimbursement>;
    getReimbursements(accountId: string, managerControl: boolean): Promise<Reimbursement[]>;
    updateReimbursement(id: string, status: string, statusComment: string): Promise<Reimbursement>;
}

export class ReimbursementServiceImpl implements ReimbursementService {
    private reimbursementDao: ReimbursementDao;
    private checkAccountService: checkAccountService;

    constructor(reimbursementDao: ReimbursementDao, accountService: checkAccountService) {
        this.reimbursementDao = reimbursementDao;
        this.checkAccountService = accountService;
    }

    async createReimbursement(accountId: string, name: string, amount: number): Promise<Reimbursement> {
        if (await this.checkAccountService.checkAccountId(accountId) == true) {
            if (isNaN(amount)) {
                throw new ReimbursementError('Amount is not a Number');
            }
            else {
                const reimbursement: Reimbursement = {
                    name: name,
                    amount: Number(amount),
                    account: await this.checkAccountService.getAccountById(accountId),
                    id: '',
                    status: "",
                }
                const reimburse: Reimbursement = await this.reimbursementDao.createReimbursement(reimbursement);
                return reimburse;
            }
        }
        else {
            throw new ReimbursementError("Account stored in Session could not be found");
        }
    }

    async getReimbursements(accountId: string, managerControl: boolean): Promise<Reimbursement[]> {
        if (await this.checkAccountService.checkAccountId(accountId) == true) {
            const reimbursements: Reimbursement[] = await this.reimbursementDao.getReimbursements(accountId, managerControl);
            if (reimbursements != undefined)
                return reimbursements;
            else
                return undefined;
        }
        else {
            throw new ReimbursementError("Account stored in Session could not be found");
        }
    }

    async updateReimbursement(id: string, status: string, statusComment: string): Promise<Reimbursement> {
        const reimbursement: Reimbursement = await this.reimbursementDao.getReimbursementByID(id);
        if (reimbursement == undefined) {
            throw new ReimbursementError('Cannot find Reimbursement');
        }
        let newReimbursement: Reimbursement;
        if (statusComment)
            newReimbursement = { ...reimbursement, status, statusComment };
        else
            newReimbursement = { ...reimbursement, status };

        const updatedReimbursement: Reimbursement = await this.reimbursementDao.updateStatusReimbursement(newReimbursement);
        return updatedReimbursement;
    }
}