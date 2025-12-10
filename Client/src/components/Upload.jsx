// import React, { useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";

// export const Upload = () => {
//     const [file, setFile] = useState(null);
//     const [message, setMessage] = useState("");
//     const [skuData, setSkuData] = useState([])

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleDownloadFormat = () => {
//         const headers = [
//             "Code",
//             "Name",
//             "1 KG Price",
//             "Packaing Cost",
//             "SAP Unit",
//             "WgtUnit",
//             "Gross Weight",
//             "Net Weight",
//             "Plant",
//             "Dewas ready price",
//             "Dewas forward price",
//             "JBGL price",
//             "UP Price",
//             "Primary category",
//             "MaterialType",
//             "Secondary Category",
//             "AcceptBulkOrder"
//         ];

//         // Create an empty row with headers
//         const wsData = [headers];
//         const worksheet = XLSX.utils.aoa_to_sheet(wsData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "MaterialFormat");

//         // Generate Excel file
//         XLSX.writeFile(workbook, "Material_Upload_Format.xlsx");
//     };

//     const handleUpload = async () => {
//         if (!file) return alert("Please select a file first!");

//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             const res = await axios.post("http://udaan.kritinutrients.com/admin/upload", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setMessage(res.data.message);
//         } catch (err) {
//             console.error(err);
//             setMessage("Error uploading materials");
//         }
//     };
//     const fetchSKU = async () => {
//         try {
//             const res = await axios.get("http://udaan.kritinutrients.com/dealer/getMaterial");
//             setSkuData(res.data.data)
//         } catch (err) {
//             console.error(err);
//             setMessage("Error uploading materials");
//         }
//     }


//     return <>
//         <div className="p-8 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-10">
//             <h2 className="text-2xl font-bold mb-4">Upload Materials</h2>
//             <div className="flex flex-col space-y-4">
//                 <button
//                     onClick={handleDownloadFormat}
//                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                 >
//                     Download Format
//                 </button>

//                 <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />

//                 <button
//                     onClick={handleUpload}
//                     className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//                 >
//                     Upload File
//                 </button>

//                 {message && <p className="mt-4 text-center text-lg text-gray-700">{message}</p>}
//             </div>
//         </div>
//     </>
// };


import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 🟢 Download Excel (All headers included, 4 columns empty)
    const handleDownloadFormat = async () => {
        try {
            const res = await axios.get("http://udaan.kritinutrients.com/dealer/getMaterial");
            const data = res.data.data || [];

            if (!data.length) {
                alert("No SKU data found!");
                return;
            }

            // ✅ Define headers manually (so order is fixed)
            const headers = [
                "Code",
                , "Name"
                , "KG_Price"
                , "Packaing_Cost"
                , "SAP_Unit"
                , "WgtUnit"
                , "Gross_Weight"
                , "Net_Weight"
                , "Plant"
                , "Dewas_ready_price"
                , "Dewas_forward_price"
                , "JBGL_price"
                , "UP_Price"
                , "Primary_category"
                , "MaterialType"
                , "Secondary_Category"
                , "AcceptBulkOrder"
            ];

            // ✅ Columns you want blank
            const blankCols = [
                "Dewas_ready_price",
                "Dewas_forward_price",
                "JBGL_price",
                "UP_Price",
            ];

            // ✅ Map API data to match your header order and blank 4 fields
            const formattedData = data.map((row) => {
                const newRow = {};
                headers.forEach((header) => {
                    if (blankCols.includes(header)) {
                        newRow[header] = ""; // leave blank
                    } else {
                        // Try to match header to key in API (case-insensitive)
                        const foundKey = Object.keys(row).find(
                            (key) => key.toLowerCase().trim() === header.toLowerCase().trim()
                        );
                        newRow[header] = foundKey ? row[foundKey] : "";
                    }
                });
                return newRow;
            });

            // ✅ Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "MaterialFormat");

            // ✅ Export file
            XLSX.writeFile(workbook, "Material_Upload_Format.xlsx");
            alert("✅ Excel downloaded successfully!");
        } catch (err) {
            console.error(err);
            alert("❌ Error generating Excel file!");
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first!");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://udaan.kritinutrients.com/admin/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(res.data.message);
        } catch (err) {
            console.error(err);
            setMessage("❌ Error uploading materials");
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Upload Materials</h2>
            <div className="flex flex-col space-y-4">
                <button
                    onClick={handleDownloadFormat}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Download Material Data
                </button>

                <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />

                <button
                    onClick={handleUpload}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Upload File
                </button>

                {message && (
                    <p className="mt-4 text-center text-lg text-gray-700">{message}</p>
                )}
            </div>
        </div>
    );
};


