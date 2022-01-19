import { AccountDao, AccountDaoImpl } from "../DAOS/accountDAO";
import ReimbursementDaoImpl, { ReimbursementDao } from "../DAOS/reimbursementDAO";
import { Account, Reimbursement } from "../entities";
import { checkAccountService, checkAccountServiceImpl } from "../Services/checkAccount-service";
import { LoginService, LoginServiceImpl } from "../Services/login-service";
import { ReimbursementService, ReimbursementServiceImpl } from "../Services/reimbursement-service";


describe("Checking Reimbursement Implementation", () => {
    let account: Account;
    const accountDao: AccountDao = new AccountDaoImpl();
    const reimbursementDao: ReimbursementDao = new ReimbursementDaoImpl();
    const checkAccountService: checkAccountService = new checkAccountServiceImpl(accountDao);
    const reimbursementService: ReimbursementService = new ReimbursementServiceImpl(reimbursementDao, checkAccountService);

    it("Should create a new Reimbursement on cosmosDB", async () => {
        account = await accountDao.getAccountByUsername('spiderman');
        const reimbursement: Reimbursement = await reimbursementService.createReimbursement(account.id, 'webbing', 560);
        expect(reimbursement.account.id).toBe(account.id);
    })
    it("Should return false as wrong account id", async () => {
        try {
            const reimbursement: Reimbursement = await reimbursementService.createReimbursement('81e1a0', 'pasint', 200);
        } catch (e) {
            expect(e.message).toBe("Account stored in Session could not be found");
        }
    });
    let reimbursements: Reimbursement[];
    it('Should get all reimbursements for an account id', async () => {
        await reimbursementService.createReimbursement(account.id, 'new suit', 2000);
        await reimbursementService.createReimbursement(account.id, 'new plane', 500000);
        reimbursements = await reimbursementService.getReimbursements(account.id, false);
        expect(reimbursements.length).toBeGreaterThanOrEqual(3);
    });
    it('Should update reimbursements under spiderman', async () => {
        let status = 'denied';
        let statusComment = 'For Testing';
        for (const r of reimbursements) {
            await reimbursementService.updateReimbursement(r.id, status, statusComment);
            status == 'denied' ? status = 'approved' : status = 'denied';
        }
        let reimb: Reimbursement[] = await reimbursementService.getReimbursements(account.id, false);
        for (const r of reimb) {
            expect(r.status).not.toBe('');
        }
    })

});