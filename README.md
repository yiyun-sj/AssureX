# AssureX Api & Doc

This is the repository containing the [AssureX](https://assurex.vercel.app) docomentation and API.

![](https://github.com/yiyun-sj/assurex/assets/67709970/2a84141c-6379-4a82-ba25-6951c163f40d)
[**Live Demo →**](https://youtu.be/FUWKrRNe_YE)

## Inspiration
Inspired by Buy-Now, Pay Later (BNPL) platforms like Affirm, we wanted to bring the same ecosystem into the blockchain space. With the various wallets people may have, we wanted AssureX to be an integration component available for wallet providers to add to their list of services.

## What it does
The AssureX project entails two components: the API layer and the demo wallet layer.

### API Layer
First, for the API layer, AssureX provides a RESTful interface for wallets to interact with, containing calls to get and create plans, payments, and invoices. At a high level, a Plan is short for a repayment plan, where the user will have a principal amount borrowed, number of installments (monthly), and monthly base payment; a Payment is simply how much a user paid at a specific date, not necessary the exact amount due per month; an Invoice is how much a user should pay back by the end of a specific date. Moreover, the API layer also handles the notification of due payments with an email that will be sent to the user a number of days before an Invoice is due. This is done using a CRON job. Finally, at the https://assurex.vercel.app/ website, full API documentation is provided for an easy understanding and integration of AssureX.

Plans are created by request via 2 API calls. /api/plan/request gets information on the details of the purchase the customer wants to make and information on the customer themselves for risk evaluation. While the latter part is not actually implemented yet, we hope to take measures like credit score, past plan history, and account balance into account. Should this first API call be successful, installment plans will be generated and returned. The customer should then pick one of the given installment plans which is finally sent back through /api/plan/create to create the plan. From there, we will purchase the item for them after their first payment is completed* (logic not implemented). Created plans will also be accompanied by a set of invoices that dictate the days and amounts for each installation.

Payments are made directly through the XRP Ledger using the Payment Transaction**. The AssureX API should be provided with the resulting Transaction Hash from the payment through /api/payment/confirm. AssureX will then validate for a successful transaction as well as payment amount. If everything is correct, the AssureX marks the invoice that was paid as fulfilled. 

* Due to the timeout limitations of serverless functions provided by Vercel, we were unable to fully explore the XRPL Escrows feature, which was our intended solution to initialize plans. 

** XRPL Checks would be a better alternative to use in place of regular payments to do a more precise payment confirmation, but for the same reasons as * we were unable to do so.

### Demo wallet
The demo wallet is how a wallet would use AssureX to provide a BNPL service to its users. In this demo wallet built on top of the XRP ledger, we support the usage of multiple accounts. To purchase an item using AssureX, head towards the purchase page and request a new plan. After filling out the form with necessary details, an API call will be made to request potential Plan options for the user, of which the user can choose one to follow through with. After confirming, AssureX will make the purchase for the user. Then, to repay a monthly Invoice, the user would head to the pay page and pay the desired amount of XRP to AssureX, calculated using the current XRP conversion rate. 

## How we built it

### API Layer
The API layer is built using the Next.js framework to leverage its serverless function service. Each API route is then able to map and wake up its respective serverless node to complete the function call. As well, the documentation page is built on the same domain to provide information regarding the available functionalities of AssureX. There exists an underlying SQL database to store data regarding the plans, payments, and invoices of users.

### Demo wallet
The demo wallet is built with React, with calls both to the AssureX platform API, XRPL, and its own database. 

## What's next for AssureX
There are quite a few things on the AssureX roadmap:
1. Provide API keys or other forms of authentication for API caller to prevent bad actors (likely in the form of basic or bearer tokens during API calls)
2. Complete an algorithm to calculate a plan request using more information, for example using a combination of credit score, previous payments, and current active plans.

## License

This project is licensed under the MIT License.
