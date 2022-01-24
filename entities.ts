export interface Account {
    fname: string
    lname: string
    username: string
    password: string
    id: string
    isManager: boolean
}

export interface Reimbursement {
    name: string,
    amount: number,
    account: { fname: string, lname: string, id: string },
    id: string,
    status: string,
    statusComment?: string
}

export interface Stats {
    fname: string,
    lname: string,
    totalAmount: number,
    accountID: string,
    reimb: { name: string, amount: number }[]
}