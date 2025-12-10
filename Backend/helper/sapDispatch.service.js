
import axios from "axios";

const SAP_BASE_URL =
    "http://182.74.4.110:1084/sap/opu/odata/sap/ZDMS_ZFRT_DTL_SRV";

const SAP_AUTH = {
    username: "kritidms",
    password: "kriti@555",
};

/**
 * Fetch raw ZFRT dispatch data from SAP
 */
export default async function fetchZFRTData(filters = {}) {
    const {
        Regio = "20",
        Vkorg = "1100",
        fromDate,
        toDate,
    } = filters;

    let filterStr = `Regio eq '${Regio}' and Vkorg eq '${Vkorg}'`;

    if (fromDate && toDate) {
        filterStr += ` and Billdate ge '${fromDate}' and Billdate le '${toDate}'`;
    }

    const url = `http://182.74.4.110:1084/sap/opu/odata/sap/ZDMS_ZFRT_DTL_SRV/ET_ZFRTSet?$filter=Billdate ge '24.09.2024' and Billdate le '24.11.2025' and Regio eq '20' and Vkorg eq '1100' &$format=json`;

    const response = await axios.get(url, {
        auth: SAP_AUTH,
        headers: {
            Accept: "application/json",
        },
    });
    if (response) {
        console.log("data Fetched");

    }

    return response.data?.d?.results || [];
}


