/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],

    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            try {
                const email = requestBody && requestBody.email ? requestBody.email : null;

                let existingCustomerId = null;
                if (email) {
                    const mySearch = search.create({
                        type: search.Type.CUSTOMER,
                        columns: ['internalid', 'email'],
                        filters: [['email', 'is', email]]
                    });

                    const results = mySearch.run().getRange({ start: 0, end: 1 });
                    if (results && results.length > 0) {
                        existingCustomerId = results[0].id;
                    }
                }

                let customerId;
                if (existingCustomerId) {
                    const custRecord = record.load({
                        type: record.Type.CUSTOMER,
                        id: existingCustomerId,
                        isDynamic: true
                    });

                    if (requestBody.companyname) {
                        custRecord.setValue({
                            fieldId: 'companyname',
                            value: requestBody.companyname
                        });
                    }

                    if (requestBody.subsidiary) {
                        custRecord.setValue({
                            fieldId: 'subsidiary',
                            value: requestBody.subsidiary
                        });
                    }

                    if (email !== null) {
                        custRecord.setValue({
                            fieldId: 'email',
                            value: email
                        });
                    }

                    if (requestBody.deleteCustomer) {
                        custRecord.setValue({
                            fieldId: 'isinactive',
                            value: true
                        });
                    }

                    customerId = custRecord.save();
                    return { message: 'Customer updated successfully', id: customerId };
                } 
                else   
                {
                    const custRecord = record.create({
                        type: record.Type.CUSTOMER,
                        isDynamic: true
                    });

                    if (requestBody.companyname) {
                        custRecord.setValue({
                            fieldId: 'companyname',
                            value: requestBody.companyname
                        });
                    }

                    if (requestBody.subsidiary) {
                        custRecord.setValue({
                            fieldId: 'subsidiary',
                            value: requestBody.subsidiary
                        });
                    }

                    if (email !== null) {
                        custRecord.setValue({
                            fieldId: 'email',
                            value: email
                        });
                    }

                    if (requestBody.deleteCustomer) {
                        custRecord.setValue({
                            fieldId: 'isinactive',
                            value: true
                        });
                        return { message: 'Customer Deleted successfully', id: customerId };
                    }

                    customerId = custRecord.save();
                    return { message: 'Customer created successfully', id: customerId };
                }
            } catch (e) {
                log.debug('Error Occurred In Customer Creation', e);
                return { error: e && e.message ? e.message : String(e) };
            }
        };

        return { post };

    });
