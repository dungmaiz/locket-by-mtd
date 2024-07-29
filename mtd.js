var request = $request;

const options = {
    url: "https://api.revenuecat.com/v1/product_entitlement_mapping",
    headers: {
        'Authorization': request.headers["authorization"],
        'X-Platform': 'iOS',
        'User-Agent': request.headers["user-agent"]
    }
}

$httpClient.get(options, function(error, newResponse, data){
  
    const ent = JSON.parse(data);

    // Get the current date and set the time to 01:01:01Z
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getUTCDate()).padStart(2, '0');
    const fixedTime = "01:01:01Z";
    const currentDateISO = `${year}-${month}-${day}T${fixedTime}`;
    const currentDateMs = new Date(currentDateISO).getTime();

    let jsonToUpdate = {
        "request_date_ms": currentDateMs,
        "request_date": currentDateISO,
        "subscriber": {
            "entitlement": {},
            "first_seen": currentDateISO,
            "original_application_version": "9692",
            "last_seen": currentDateISO,
            "other_purchases": {},
            "management_url": null,
            "subscriptions": {},
            "entitlements": {},
            "original_purchase_date": currentDateISO,
            "original_app_user_id": "70B24288-83C4-4035-B001-573285B21AE2",
            "non_subscriptions": {}
        }
    };

    const productEntitlementMapping = ent.product_entitlement_mapping;

    for (const [entitlementId, productInfo] of Object.entries(productEntitlementMapping)) {
        const productIdentifier = productInfo.product_identifier;
        const entitlements = productInfo.entitlements;

        for (const entitlement of entitlements) {
            jsonToUpdate.subscriber.entitlements[entitlement] = {
                "purchase_date": currentDateISO,
                "original_purchase_date": currentDateISO,
                "expires_date": "9692-01-01T01:01:01Z",
                "is_sandbox": false,
                "ownership_type": "PURCHASED",
                "store": "app_store",
                "product_identifier": productIdentifier
            };

            // Add product identifier to subscriptions
            jsonToUpdate.subscriber.subscriptions[productIdentifier] = {
                "expires_date": "9692-01-01T01:01:01Z",
                "original_purchase_date": currentDateISO,
                "purchase_date": currentDateISO,
                "is_sandbox": false,
                "ownership_type": "PURCHASED",
                "store": "app_store"
            };
        }
    }

    body = JSON.stringify(jsonToUpdate);
    $done({body});

});
