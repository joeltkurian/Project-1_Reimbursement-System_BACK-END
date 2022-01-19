import { AccountDao } from "../DAOS/accountDAO";
import { ReimbursementDao } from "../DAOS/reimbursementDAO";
import { Account, Reimbursement } from "../entities";
import { ReimbursementError } from "../Error/error";
import { checkAccountService, checkAccountServiceImpl } from "../Services/checkAccount-service";
import { ReimbursementServiceImpl, ReimbursementService } from "../Services/reimbursement-service";



describe("Check Account Service Tests", () => {
    let reimbursements: Reimbursement[] = [];
    let rid = `1`;
    const reimbursementDao: ReimbursementDao = {
        async createReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
            reimbursement.id = rid;
            rid += rid;
            reimbursements.push(reimbursement);
            return reimbursement;
        },
        async getReimbursements(accountId: string, managerControl: boolean): Promise<Reimbursement[]> {
            let r: Reimbursement[] = [];
            if (managerControl) {
                for (const c of reimbursements) {
                    if (c.account.id != accountId)
                        r.push(c);
                }
                return r;
            }
            else {
                for (const c of reimbursements) {
                    if (c.account.id == accountId)
                        r.push(c);
                }
                return r;
            }
        },
        async getReimbursementByID(id: string): Promise<Reimbursement> {

            for (const c of reimbursements) {
                if (c.id == id)
                    return c;
            }
            return null;
        },
        async updateStatusReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
            for (const c of reimbursements) {
                if (c.id == reimbursement.id) {
                    c.status = reimbursement.status;
                    c.statusComment = reimbursement.statusComment;
                    return c;
                }
            }
            return null;
        }
    }


    const memberDaoStub: AccountDao = {
        async getAccountByUsername(username: string): Promise<Account> {
            // Checked in login-service where it's used
            throw new Error("Not Checking here!");
        },
        createAccount: function (account: Account): Promise<Account> {
            // No need to check since we won't be creating Accounts
            throw new Error("Not Checking here!");
        },
        async checkAccountById(id: string): Promise<boolean> {
            if (id == '101' || id == '202' || id == '303')
                return true;

            else
                return false;
        },
        async getAccountById(ID: string): Promise<{ fname: string; lname: string; id: string; }> {
            // This is checked in checkAccount-service
            if (ID == '101')
                return { fname: 'Joel', lname: 'Kurian', id: '101' };
            else if (ID == '202')
                return { fname: 'Adam', lname: 'Ranieri', id: '202' };
            else if (ID == '303')
                return { fname: 'Billy', lname: 'Boop', id: '303' };
            else
                return null;
        }
    }

    const accountService: checkAccountService = new checkAccountServiceImpl(memberDaoStub);
    const reimbursementService: ReimbursementService = new ReimbursementServiceImpl(reimbursementDao, accountService);
    it("Should check for an account, then add the reimbursement", async () => {
        const reimburse: Reimbursement = await reimbursementService.createReimbursement('101', 'paint', 10);
        expect(reimburse.account.id).toBe('101');
        expect(reimburse.amount).toBe(10);
    });
    it("Should not add reimbursement as account not valid", async () => {
        try {
            await reimbursementService.createReimbursement('201', 'draw', 100000);
        }
        catch (e) {
            expect(e.message).toBe("Account stored in Session could not be found");
        }
    });
    it("Should get all of accountID=101's reimbursements", async () => {
        await reimbursementService.createReimbursement('101', 'draw', 1000);
        await reimbursementService.createReimbursement('101', 'gas', 40);
        const reimbursements: Reimbursement[] = await reimbursementService.getReimbursements('101', false);
        expect(reimbursements.length).toBe(3);
    });
    it("Should return all reimbursements other than current manager reimbursements", async () => {
        await reimbursementService.createReimbursement('202', 'zing', 10000);
        await reimbursementService.createReimbursement('303', 'flight', 5000);
        const reimbursements: Reimbursement[] = await reimbursementService.getReimbursements('202', true);
        expect(reimbursements.length).toBe(4);
    });
    it('Should update a reimbursement given ID', async () => {
        const reimb: Reimbursement = await reimbursementService.updateReimbursement('1', 'approved', 'i approve');
        expect(reimb.status == 'approved');
        expect(reimb.id == '1');
        expect(reimb.statusComment == 'i approve');
    });
    it("Should fail to get reimbursements as account doesn't exist", async () => {
        try {
            await reimbursementService.createReimbursement('201', 'draw', 1000);
        } catch (e) {
            expect(e).toBeInstanceOf(ReimbursementError);
        }
    });
});