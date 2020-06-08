

1. clone this repo and cd into its directory
2. install dependencies: `npm install`
3. start serverless offline: `sls offline start` or `npm start`
4. Endpoints

#### Creat loan( if the company is active):
- from (https://api.overheid.io/openkvk/{id}) the {id} is [type]+[dossiernummer]+[subdossiernummer]+[handelsnaam]
- eindpoint : `localhost:4000/loan/CompanyId`
- body request: { "amount" : number }
- method : POST
#### Payments proccess and updates table status, payment & amount (loan balance)
- eindpoint : `localhost:4000/api/CompanyId`
- body request: { "payment" : number }
- method: POST
#### delete loan:
- eindpoint : `localhost:4000/loan/CompanyId`
- body request: no need
- Method: DELETE
#### Find loan:
- eindpoint : `localhost:4000/loan/CompanyId`
- body request: no need
- method: GET
#### Get all loans:
- eindpoint : `localhost:4000/loans`
- body request: no need
- method: GET
#### Update loan:
- eindpoint : `localhost:4000/loan/CompanyId`
- body request: no need
- method: PUT

## The assignment contains three folders;

1. handling: logical functionality (check the inserted settlement and update the dynamo table)
2. loan :
- lambda functions (CRUD)  
- app.js: will get the response from handling functions and invoke handlingDisburse
3. disburse: to evaluate the checkBalance result and send back a response to handling functions (which has been imported to app.js)
