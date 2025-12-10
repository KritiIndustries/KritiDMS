import React, { useState } from "react";
import { UpdateSalesOrder } from "@/lib/UpdateSalesOrder";
import UpdateSummaryTable from "@/components/UpdateSummaryTable";

const SalesOrderUpdater = () => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        //TODO:API Call Here
        const result = await UpdateSalesOrder(SOdata);   // SOdata = your array
        setSummary(result);
        setLoading(false);
    };

    return (
        <div className="p-6">
            <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                {loading ? "Updating..." : "Start Sales Order Update"}
            </button>

            <UpdateSummaryTable summary={summary} />
        </div>
    );
};

export default SalesOrderUpdater;
