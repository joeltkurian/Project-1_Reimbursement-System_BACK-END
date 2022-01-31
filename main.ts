import express from 'express';
import { AccountDao, AccountDaoImpl } from './DAOS/accountDAO';
import { Account, Reimbursement, Stats } from './entities';
import { LoginService, LoginServiceImpl } from './Services/login-service';
import cors from 'cors';
import errorHandler from './Error/error';
import { ReimbursementService, ReimbursementServiceImpl } from './Services/reimbursement-service';
import ReimbursementDaoImpl, { ReimbursementDao } from './DAOS/reimbursementDAO';
import { checkAccountService, checkAccountServiceImpl } from './Services/checkAccount-service';
import CustomLoggerImpl, { CustomLogger } from './customLogger';


const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors());

const accountDao: AccountDao = new AccountDaoImpl();
const reimbursementDao: ReimbursementDao = new ReimbursementDaoImpl();
const loginService: LoginService = new LoginServiceImpl(accountDao);
const accountService: checkAccountService = new checkAccountServiceImpl(accountDao);
const reimbursementService: ReimbursementService = new ReimbursementServiceImpl(reimbursementDao, accountService);
const log: CustomLogger = new CustomLoggerImpl();

//CREATE ACCOUNT
app.post('/accountCreation', async (req, res) => {
    const acc: { fname: string, lname: string, username: string, password: string, id: string, isManager: boolean } = req.body;
    const account: Account = await loginService.createAccount(acc);
    console.log(log.logger(account, '/accountCreation :: POST Account'));
    res.status(201);
    res.send(account);
});

// LOGIN TO ACCOUNT
app.patch("/login", async (req, res) => {
    try {
        const user: { username: string, password: string } = req.body;
        const account: Account = await loginService.loginWithUsernamePassword(user.username, user.password);
        console.log(log.logger(account, '/login :: PATCH Login'));
        res.status(201);
        res.send(account);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// CREATE A NEW REIMBURSEMENT PROVIDED A OBJECT WITH CERTAIN VALUES
app.post('/reimbursement', async (req, res) => {
    try {
        const { accountId, name, amount, formData } = req.body;
        console.log(formData);
        const reimbursement: Reimbursement = await reimbursementService.createReimbursement(accountId, name, amount, formData);
        console.log(log.logger(reimbursement, '/reimbursement :: POST Reimbursement'));
        res.status(201);
        res.send(reimbursement);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// GET ALL REIMBURSEMENTS GIVEN AN ID, OR IF A MANAGER, GET ALL REIMBURSEMENTS OTHER THAN THE MANAGERS
app.get('/reimbursement/:id/:managerControl', async (req, res) => {
    try {
        const { id } = req.params;
        const managerControl: boolean = req.params.managerControl === 'true' ? true : false;
        const reimbursements: Reimbursement[] = await reimbursementService.getReimbursements(id, managerControl);
        if (managerControl == false) {
            if (reimbursements == [])
                console.log(log.logger(`${reimbursements[0].account.fname} ${reimbursements[0].account.lname} account`, '//reimbursement/:id/:managerControl :: GET ALL Reimbursements'));
            else
                console.log(log.logger(`account ${id}`, '//reimbursement/:id/:managerControl :: GET ALL Reimbursements'));
        }
        else {
            console.log(log.logger(`all accounts`, '//reimbursement/:id/:managerControl :: GET ALL Reimbursements'));
        }
        if (reimbursements.length == 0) {
            res.status(250);
        }
        else {
            res.status(200);
        }
        res.send(reimbursements);
    } catch (error) {
        console.log(error.message);
        errorHandler(error, req, res);
    }
});

// UPDATE A REIMBURSEMENT WITH A STATUS AND COMMENT?
app.patch('/reimbursement/:id/:status', async (req, res) => {
    try {
        const { id, status } = req.params;
        const { statusComment } = req.body;
        const reimbursement: Reimbursement = await reimbursementService.updateReimbursement(id, status, statusComment);
        console.log(log.logger(reimbursement, '/reimbursement/:id/:status :: PATCH Update Reimbursement'));
        res.status(200);
        res.send(reimbursement);
    } catch (error) {
        console.log(error.message);
        res.send(505);
        errorHandler(error, req, res);
    }
});

// GET THE STATISTICS WHICH WILL RETRIEVE ALL REIMBURSEMENTS IN COSMOS AND RETURN RELEVANT INFORMATION
app.get('/manager/statistics', async (req, res) => {
    try {
        const stats: Stats[] = await reimbursementService.createStatistics();
        console.log(log.logger(null, '/manager/statistics :: GET Statistics for all Reimbursements'));
        res.status(200);
        res.send(stats);
    } catch (error) {
        console.log(error.message);
        res.status(501);
        res.send(error.message);
    }
});

app.listen(process.env.PORT ?? 5000, () => {
    console.log("Application has started!");
});