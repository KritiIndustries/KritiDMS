
// // File: SubmitDMSOrder.js
import axios from "axios";
// //Production Credntial
// const SAP_BASE_URL = "http://182.74.4.110:1084/sap/opu/odata/sap/ZSD_SALES_ORDER_CRT_SRV";
// const USERNAME = "dev01@555";
// const PASSWORD = "Kriti@12";
// const BASIC_AUTH = "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");
// //Devepolemnet Credncial
const SAP_BASE_URL = "http://182.74.4.110:1081/sap/opu/odata/sap/ZSD_SALES_ORDER_CRT_SRV";
const USERNAME = "dev01";
const PASSWORD = "Kriti@12";
const BASIC_AUTH = "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");

// // Step 1: Fetch X-CSRF-Token and Cookies
// async function fetchCsrfToken() {
//     try {
//         const response = await axios.get(SAP_BASE_URL, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-csrf-token": "fetch",
//                 Authorization: BASIC_AUTH,
//                 Cookie: "sap-usercontext=sap-client=200",
//             },
//         });

//         const csrfToken = response.headers["x-csrf-token"];
//         const cookies = response.headers["set-cookie"]
//             ?.map((c) => c.split(";")[0])
//             .join("; ");

//         console.log("✅ CSRF Token fetched successfully");
//         return { csrfToken, cookies };
//     } catch (error) {
//         console.error("❌ Error fetching CSRF Token:");
//         if (error.response) {
//             console.error("Status:", error.response.status);
//             console.error("Response:", error.response.data);
//         } else {
//             console.error(error.message);
//         }
//         throw error;
//     }
// }

// // Step 2: Create Contract Order (Sales Order)
// async function createContractOrder(csrfToken, cookies) {
//     const payload = {
//         SOLD_PARTY: "102115",
//         SHIP_PARTY: "102115",
//         DOCTYPE: "ZD2", //Order Type Location means ZD2=depot(GL,JB),Z02(Dewas),ZGRP(Gorkhapaur)
//         SALESORG: "1100",
//         DISTCHAN: "O3",
//         DIVISION: "02",
//         PRICELIST: "03",//Ready forwards , groundnut mustod in my whataap
//         PRICEGROUP: "M",//State
//         REQDATE: "01.11.2025",
//         VALIDFROM: "01.11.2025", //Forwad me REQDATE+7days
//         VALIDTO: "07.11.2025",
//         SALESORDER: " ",
//         MESSAGE: " ",
//         SALESITEMSet: [
//             {
//                 SOLD_PARTY: "102115",
//                 MATERIAL: "44001419",
//                 PLANT: "1101",
//                 QTY: "20",
//             },

//         ],
//     };

//     try {
//         const response = await axios.post(
//             `${SAP_BASE_URL}/HEADERSet`,
//             payload,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "x-csrf-token": csrfToken,
//                     Authorization: BASIC_AUTH,
//                     Cookie: cookies,
//                 },
//             }
//         );

//         console.log("✅ Sales Order Created Successfully");
//         console.log("Response Data:", response.data);
//     } catch (error) {
//         console.error("❌ Error creating Sales Order:");
//         if (error.response) {
//             console.error("Status:", error.response.status);
//             console.error("Response:", JSON.stringify(error.response.data, null, 2));
//         } else {
//             console.error(error.message);
//         }
//     }
// }

// // Step 3: Run the functions
// (async () => {
//     try {
//         console.log(BASIC_AUTH);

//         const { csrfToken, cookies } = await fetchCsrfToken();

//         await createContractOrder(csrfToken, cookies);
//     } catch (error) {
//         console.error("🚨 Process failed.");
//     }
// })();





const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};
const today = new Date();

let REQDATE = formatDate(today);
async function fetchCsrfToken() {
    try {
        const response = await axios.get(SAP_BASE_URL, {
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": "fetch",
                Authorization: BASIC_AUTH,
            },
        });

        const csrfToken = response.headers["x-csrf-token"];
        const cookies = response.headers["set-cookie"]
            ?.map((c) => c.split(";")[0])
            .join("; ");

        console.log("✅ CSRF Token fetched successfully");
        return { csrfToken, cookies };
    } catch (error) {
        console.error("❌ Error fetching CSRF Token:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", error.response.data);
        } else {
            console.error(error.message);
        }
        throw error;
    }
}
// Step 2: Create Contract Order (Sales Order)
async function createContractOrder(csrfToken, cookies, dealer, cart, dealerCategory, SBOtype) {
    // async function createContractOrder(dealer, cart, dealerCategory, SBOtype) {

    console.log("Category is", dealerCategory);

    let priceList = '';
    let Validate = "";
    let validTill = "";

    if (dealerCategory == 'SBO') {
        if (SBOtype == 'Forward') {
            priceList = '04'
            // For Forward → Validate = today + 7 days, ValidTill = today + 14 days
            const validateDate = new Date(today);
            validateDate.setDate(today.getDate() + 7);
            Validate = formatDate(validateDate);


            const validTillDate = new Date(today);
            validTillDate.setDate(today.getDate() + 14);
            validTill = formatDate(validTillDate);
        }
        else {
            priceList = '03'
            Validate = formatDate(today);

            const validTillDate = new Date(today);
            validTillDate.setDate(today.getDate() + 7);
            validTill = formatDate(validTillDate);
        }
    }
    else if (dealerCategory == 'Bari') {
        priceList = '03'
        Validate = formatDate(today);

        const validTillDate = new Date(today);
        validTillDate.setDate(today.getDate() + 14);
        validTill = formatDate(validTillDate);
    }
    else {
        priceList = '08'
        Validate = formatDate(today);

        const validTillDate = new Date(today);
        validTillDate.setDate(today.getDate() + 7);
        validTill = formatDate(validTillDate);
    }

    let docType = ''
    if (dealer.CompanyCode == '1114') {
        docType = 'ZGRP'
    }
    else if (dealer.CompanyCode == '1111' || dealer.CompanyCode == '1112') {
        docType = 'ZD2'
    }
    else {
        docType = 'Z02'
    }

    // const payload = {
    //     SOLD_PARTY: dealer.UserName,
    //     SHIP_PARTY: dealer.UserName,
    //     DOCTYPE: docType, // Order Type (ZD2 = Depot, Z02 = Dewas, ZGRP = Gorakhpur)
    //     SALESORG: "1100",
    //     DISTCHAN: "O3",
    //     DIVISION: "02",
    //     PRICELIST: priceList, // 03 = Ready, 04 = Forward, etc.
    //     PRICEGROUP: dealer.PriceGroup, // State
    //     REQDATE: REQDATE,
    //     VALIDFROM: String(Validate) || "06.11.2025", // For Forward, REQDATE + 7 days
    //     VALIDTO: String(validTill) || "13.11.2025",
    //     SALESORDER: " ",
    //     MESSAGE: " ",
    //     SALESITEMSet: cart.map((item) => ({
    //         SOLD_PARTY: dealer.UserName,
    //         MATERIAL: item.sku,      // your cart item SKU field
    //         PLANT: dealer.Location,    // your cart item plant/location
    //         QTY: String(item.quantity || 1) // convert to string as in your sample
    //     }))
    // };

    // try {
    //     const response = await axios.post(
    //         `${SAP_BASE_URL}/HEADERSet`,
    //         payload,
    //         {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "x-csrf-token": csrfToken,
    //                 Authorization: BASIC_AUTH,
    //                 Cookie: cookies,
    //             },
    //         }
    //     );

    //     console.log("Response", response.data);
    //     console.log("✅ Sales Order Created Successfully");
    //     // console.log("Response Data:", response.data);
    //     return response.data
    // } catch (error) {
    //     console.error("❌ Error creating Sales Order:");
    //     if (error.response) {
    //         console.error("Status:", error.response.status);
    //         console.error("Response:", JSON.stringify(error.response.data, null, 2));
    //     } else {
    //         console.error(error.message);
    //     }
    // }


    const payload = {
        SOLD_PARTY: dealer.UserName,
        SHIP_PARTY: dealer.UserName,
        DOCTYPE: docType,
        SALESORG: "1100",
        DISTCHAN: "O3",
        DIVISION: "02",  //Check With Pravesh sir for Division for Bari it is 01 and ask for others
        PRICELIST: priceList,
        PRICEGROUP: dealer.PriceGroup,
        REQDATE: REQDATE,         // today's date
        VALIDFROM: Validate,      // depends on SBOtype
        VALIDTO: validTill,       // depends on SBOtype
        SALESORDER: " ",
        MESSAGE: " ",
        SALESITEMSet: cart.map((item) => ({
            SOLD_PARTY: dealer.UserName,
            MATERIAL: item.sku,
            PLANT: dealer.Location,
            QTY: String(item.quantity || 1),
        })),
    };
    console.log("Paload", payload);
    try {
        const response = await axios.post(`${SAP_BASE_URL}/HEADERSet`, payload, {
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": csrfToken,
                Authorization: BASIC_AUTH,
                Cookie: cookies,
            },
        });
        const result = response.data?.d || {};
        console.log("✅ Sales Order Created Successfully");
        console.log("MESSAGE:", result.MESSAGE || "No SAP message");
        return result;
    } catch (error) {
        console.error("❌ Error creating Sales Order:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }

}
// Step 3: Run the functions
const InsertSalesOrder = async (dealer, cart, dealerCategory, SBOtype) => {
    try {

        const { csrfToken, cookies } = await fetchCsrfToken();
        const res = await createContractOrder(csrfToken, cookies, dealer, cart, dealerCategory, SBOtype);
        return res
    } catch (error) {
        console.error("🚨 Process failed.");
        console.log(error);

    }
};

export default InsertSalesOrder
