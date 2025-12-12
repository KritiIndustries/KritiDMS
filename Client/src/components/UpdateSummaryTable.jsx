import React from "react";

const statusColor = {
    Success: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
    "Critical Failure": "bg-orange-100 text-orange-700",
};

const UpdateSummaryTable = ({ summary = [] }) => {
    if (!summary || summary.length === 0) {
        return (
            <div className="text-center text-gray-500 py-6">
                No update summary available.
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                🧾 Sales Order Update Summary
            </h2>

            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Sales Order</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.map((item, index) => (
                            <tr
                                key={index}
                                className="border-t border-gray-200 hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2 font-medium text-gray-900">
                                    {item.salesOrder || "N/A"}
                                </td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor[item.status] || "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-gray-700">
                                    {item.message || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UpdateSummaryTable;
