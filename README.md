# Project-1_Reimbursement-System_BACK-END
- This repository contains the back end implementation for the reimbursement full stack application
- This service uses express to communicate, and uses Azure Cosmos DB to store information retrieved from the front-end services

## BASIC OPERATIONS
- Create an account
    - Creates an account given a req.body containing account information
    - `/accountCreation`

- Login to Account
    - Logs into an account given a req.body containing pertinent information
    - `/login`

- Create a Reimbursement
    - Create a new reimbursement given a req.body containing pertinent reimbursement information
    - `/reimbursement`

- Get all Reimbursements
    - Get all reimbursements for an account, or if manager control, then get all reimbursements except the current calling managers'
    - This needs two parameters to be passed
    - `/reimbursement/${id:string}/${managerControl:boolean}`

- Update a reimbursement with Status and Comment if applicable
    - Update a reimbursement given an id, called by a manager
    - `/reimbursement/:id/:status`

- Get Statistics
    - Get statistics information which will send an object with relevant information back
    - `/manager/statistics`
