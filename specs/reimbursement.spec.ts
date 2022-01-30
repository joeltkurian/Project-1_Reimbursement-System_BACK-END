import { AccountDao, AccountDaoImpl } from "../DAOS/accountDAO";
import ReimbursementDaoImpl, { ReimbursementDao } from "../DAOS/reimbursementDAO";
import { Account, Reimbursement } from "../entities";
import { checkAccountService, checkAccountServiceImpl } from "../Services/checkAccount-service";
import { ReimbursementService, ReimbursementServiceImpl } from "../Services/reimbursement-service";


describe("Checking Reimbursement Implementation", () => {
    let account: Account;
    const accountDao: AccountDao = new AccountDaoImpl();
    const reimbursementDao: ReimbursementDao = new ReimbursementDaoImpl();
    const checkAccountService: checkAccountService = new checkAccountServiceImpl(accountDao);
    const reimbursementService: ReimbursementService = new ReimbursementServiceImpl(reimbursementDao, checkAccountService);
    const spidermanSuitPngURI = "data:image/png;base64,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"
    it("Should create a new Reimbursement on cosmosDB", async () => {
        account = await accountDao.getAccountByUsername('spiderman');
        const reimbursement: Reimbursement = await reimbursementService.createReimbursement(account.id, 'webbing', 50, null);
        expect(reimbursement.account.id).toBe(account.id);
    })
    it("Should return false as wrong account id", async () => {
        try {
            const reimbursement: Reimbursement = await reimbursementService.createReimbursement('non-existent-ID', 'paint', 200, null);
        } catch (e) {
            expect(e.message).toBe("Account stored in Session could not be found");
        }
    });
    let reimbursements: Reimbursement[];
    it('Should get all reimbursements for an account id', async () => {
        await reimbursementService.createReimbursement(account.id, 'new suit', 2000, spidermanSuitPngURI);
        await reimbursementService.createReimbursement(account.id, 'new plane', 5000, null);
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