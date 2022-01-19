import express from 'express';
import { AccountDao, AccountDaoImpl } from './DAOS/accountDAO';
import { Account, Reimbursement } from './entities';
import { LoginService, LoginServiceImpl } from './Services/login-service';
import cors from 'cors';
import errorHandler from './Error/error';
import { ReimbursementService, ReimbursementServiceImpl } from './Services/reimbursement-service';
import ReimbursementDaoImpl, { ReimbursementDao } from './DAOS/reimbursementDAO';
import { checkAccountService, checkAccountServiceImpl } from './Services/checkAccount-service';

const app = express();

app.use(express.json());
app.use(cors());

const accountDao: AccountDao = new AccountDaoImpl();
const reimbursementDao: ReimbursementDao = new ReimbursementDaoImpl();
const loginService: LoginService = new LoginServiceImpl(accountDao);
const accountService: checkAccountService = new checkAccountServiceImpl(accountDao);
const reimbursementService: ReimbursementService = new ReimbursementServiceImpl(reimbursementDao, accountService);


//CREATE ACCOUNT (TEMPORARY)
app.post('/accountCreation', async (req, res) => {
    const acc: { fname: string, lname: string, username: string, password: string, id: string, isManager: boolean } = req.body;
    const account: Account = await loginService.createAccount(acc);
    res.status(201);
    res.send(account);
});

app.patch("/login", async (req, res) => {
    try {
        const user: { username: string, password: string } = req.body;
        const account: Account = await loginService.loginWithUsernamePassword(user.username, user.password);
        res.status(201);
        res.send(account);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

app.post('/reimbursement', async (req, res) => {
    try {
        const { accountId, name, amount } = req.body;
        const reimbursement: Reimbursement = await reimbursementService.createReimbursement(accountId, name, amount);
        res.status(201);
        res.send(reimbursement);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

app.get('/reimbursement/:id/:managerControl', async (req, res) => {
    try {
        const { id } = req.params;
        const managerControl: boolean = req.params.managerControl === 'true' ? true : false;
        const reimbursements: Reimbursement[] = await reimbursementService.getReimbursements(id, managerControl);
        if (reimbursements.length == 0) {
            res.status(250);
        }
        else
            res.status(200);
        res.send(reimbursements);
    } catch (error) {
        console.log(error.message);
        errorHandler(error, req, res);
    }
});

app.patch('/reimbursement/:id/:status', async (req, res) => {
    try {
        const { id, status } = req.params;
        const { statusComment } = req.body;
        const reimbursement: Reimbursement = await reimbursementService.updateReimbursement(id, status, statusComment);
        res.status(200);
        res.send(reimbursement);
    } catch (error) {
        console.log(error.message);
        res.send(505);
        res.send(error);
    }
});

app.listen(5000, () => {
    console.log("Application has started!");
});