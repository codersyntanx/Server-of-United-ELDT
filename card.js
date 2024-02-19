var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;


function chargeCreditCard(callback) {
    // Create a new instance of MerchantAuthenticationType and set your API credentials
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName('9M786CmbxK');
    merchantAuthenticationType.setTransactionKey('57L796Bqn387wXAm');

    // Create a new CreditCardType object and set card details
    var creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber('4242424242424242');
    creditCard.setExpirationDate('0822');
    creditCard.setCardCode('999');

    // Create a new PaymentType object and set credit card
    var paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    // Set up other transaction details like order, billing address, line items, etc.
    // ...

    // Create the transaction request
    var transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount("1000");
    // Set other transaction details...

    var createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    ctrl.execute(function(){
        var apiResponse = ctrl.getResponse();
        var response = new ApiContracts.CreateTransactionResponse(apiResponse);
        
        // Handle the response from Authorize.Net
        // This part needs to be adjusted based on the structure of the Authorize.Net response
        callback(response);
    });
}

module.exports.chargeCreditCard = chargeCreditCard;
