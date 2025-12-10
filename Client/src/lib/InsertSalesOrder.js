
// File: SubmitDMSOrder.js
import axios from "axios";

const SAP_BASE_URL = "api/sap/opu/odata/sap/ZSD_SALES_ORDER_CRT_SRV";
const USERNAME = "dev01";
const PASSWORD = "Kriti@12";
const BASIC_AUTH = "Basic " + btoa(`${USERNAME}:${PASSWORD}`); // ✅ Browser-safe

// Step 1: Fetch X-CSRF-Token and Cookies
// async function fetchCsrfToken() {
//     try {
//         const response = await axios.get(SAP_BASE_URL, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-csrf-token": "fetch",
//                 Authorization: BASIC_AUTH
//                 // Cookie: "sap-usercontext=sap-client=900",
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
    let priceList = '';
    if (dealerCategory == 'SBO') {
        if (SBOtype == 'Forward') {
            priceList = '04'
        } else {
            priceList = '03'
        }
    }
    else {
        priceList = '08'
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
    //     DOCTYPE: docType, //Order Type Location means ZD2=depot(GL,JB),Z02(Dewas),ZGRP(Gorkhapaur)
    //     SALESORG: dealer.CompanyCode,
    //     DISTCHAN: "O3",
    //     DIVISION: "02",
    //     PRICELIST: priceList,// 03Ready 04forwards ,08 groundnut mustod  in my whataap
    //     PRICEGROUP: dealer.PriceGroup,//State
    //     REQDATE: "18.10.2025",
    //     VALIDFROM: "18.10.2025", //Forwad me REQDATE+7days
    //     VALIDTO: "31.10.2024",
    //     SALESORDER: " ",
    //     MESSAGE: " ",
    //     SALESITEMSet: [

    //         {
    //             SOLD_PARTY: "100329",
    //             MATERIAL: "44007066",
    //             PLANT: "1101",
    //             QTY: "1",
    //         },
    //     ],
    // };

    const payload = {
        SOLD_PARTY: dealer.UserName,
        SHIP_PARTY: dealer.UserName,
        DOCTYPE: docType, // Order Type (ZD2 = Depot, Z02 = Dewas, ZGRP = Gorakhpur)
        SALESORG: dealer.CompanyCode,
        DISTCHAN: "O3",
        DIVISION: "02",
        PRICELIST: priceList, // 03 = Ready, 04 = Forward, etc.
        PRICEGROUP: dealer.PriceGroup, // State
        REQDATE: "18.11.2025",
        VALIDFROM: "18.11.2025", // For Forward, REQDATE + 7 days
        VALIDTO: "31.11.2025",
        SALESORDER: " ",
        MESSAGE: " ",
        SALESITEMSet: cart.map((item) => ({
            SOLD_PARTY: dealer.UserName,
            MATERIAL: item.sku,      // your cart item SKU field
            PLANT: dealer.Location,    // your cart item plant/location
            QTY: String(item.quantity || 1) // convert to string as in your sample
        }))
    };

    try {
        const response = await axios.post(
            `${SAP_BASE_URL}/HEADERSet`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken,
                    Authorization: BASIC_AUTH,
                    Cookie: cookies,
                },
            }
        );

        console.log("Dealer", dealer);
        console.log("Primary Categort", dealerCategory);
        console.log("SBO Type", SBOtype);
        console.log("Cart", cart);
        console.log(payload);


        console.log("✅ Sales Order Created Successfully");
        console.log("Response Data:", response.data);
        return response.data
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
        await createContractOrder(csrfToken, cookies, dealer, cart, dealerCategory, SBOtype);

    } catch (error) {
        console.error("🚨 Process failed.");
        console.log(error);

    }
};

export default InsertSalesOrder

