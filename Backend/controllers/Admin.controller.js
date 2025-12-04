// import sql from 'mssql';
// import pool from '../config/db.js';
// import fs from 'fs'
// import * as XLSX from "xlsx";
// export const uploadMaterialWithPriceController = async (req, res) => {
//     try {

//         if (!req.file) {
//             return res.status(400).json({ success: false, message: "No file uploaded" });
//         }

//         const workbook = XLSX.readFile(req.file.path);
//         const sheetName = workbook.SheetNames[0];
//         const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         for (const row of sheetData) {
//             const request = pool.request();

//             request.input("Code", sql.VarChar, row["Code"]);
//             request.input("Name", sql.VarChar, row["Name"]);
//             request.input("KG_Price", sql.VarChar, row["1 KG Price"]);
//             request.input("Packaing_Cost", sql.VarChar, row["Packaing Cost"]);
//             request.input("SAP_Unit", sql.VarChar, row["SAP Unit"]);
//             request.input("WgtUnit", sql.VarChar, row["WgtUnit"]);
//             request.input("Gross_Weight", sql.VarChar, row["Gross Weight"]);
//             request.input("Net_Weight", sql.VarChar, row["Net Weight"]);
//             request.input("Plant", sql.VarChar, row["Plant"]);
//             request.input("Dewas_ready_price", sql.VarChar, row["Dewas ready price"]);
//             request.input("Dewas_forward_price", sql.VarChar, row["Dewas forward price"]);
//             request.input("JBGL_price", sql.VarChar, row["JBGL price"]);
//             request.input("UP_Price", sql.VarChar, row["UP Price"]);
//             request.input("Primary_category", sql.VarChar, row["Primary category"]);
//             request.input("MaterialType", sql.VarChar, row["MaterialType"]);
//             request.input("Secondary_Category", sql.VarChar, row["Secondary Category"]);

//             await request.query(`
//         INSERT INTO materials (
//           Code, Name, KG_Price, Packaing_Cost, SAP_Unit, WgtUnit, Gross_Weight, Net_Weight, Plant,
//           Dewas_ready_price, Dewas_forward_price, JBGL_price, UP_Price, Primary_category, MaterialType, Secondary_Category
//         )
//         VALUES (
//           @Code, @Name, @KG_Price, @Packaing_Cost, @SAP_Unit, @WgtUnit, @Gross_Weight, @Net_Weight, @Plant,
//           @Dewas_ready_price, @Dewas_forward_price, @JBGL_price, @UP_Price, @Primary_category, @MaterialType, @Secondary_Category
//         )
//       `);
//         }

//         fs.unlinkSync(req.file.path);
//         res.json({ success: true, message: "Materials uploaded successfully!" });
//     } catch (err) {
//         console.error("Error uploading materials:", err);
//         res.status(500).json({ success: false, message: err.message });
//     }
// };


// import sql from 'mssql';
// import pool from '../config/db.js';
// import fs from 'fs';
// import  XLSX from "xlsx";

// export const uploadMaterialWithPriceController = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: "No file uploaded" });
//         }

//         // Check if file exists (extra safety)
//         if (!fs.existsSync(req.file.path)) {
//             return res.status(400).json({ success: false, message: "Uploaded file not found" });
//         }

//         const workbook = XLSX.readFile(req.file.path);
//         const sheetName = workbook.SheetNames[0];
//         const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         for (const row of sheetData) {
//             const request = pool.request();

//             request.input("Code", sql.VarChar, row["Code"]);
//             request.input("Name", sql.VarChar, row["Name"]);
//             request.input("KG_Price", sql.VarChar, row["1 KG Price"]);
//             request.input("Packaing_Cost", sql.VarChar, row["Packaing Cost"]);
//             request.input("SAP_Unit", sql.VarChar, row["SAP Unit"]);
//             request.input("WgtUnit", sql.VarChar, row["WgtUnit"]);
//             request.input("Gross_Weight", sql.VarChar, row["Gross Weight"]);
//             request.input("Net_Weight", sql.VarChar, row["Net Weight"]);
//             request.input("Plant", sql.VarChar, row["Plant"]);
//             request.input("Dewas_ready_price", sql.VarChar, row["Dewas ready price"]);
//             request.input("Dewas_forward_price", sql.VarChar, row["Dewas forward price"]);
//             request.input("JBGL_price", sql.VarChar, row["JBGL price"]);
//             request.input("UP_Price", sql.VarChar, row["UP Price"]);
//             request.input("Primary_category", sql.VarChar, row["Primary category"]);
//             request.input("MaterialType", sql.VarChar, row["MaterialType"]);
//             request.input("Secondary_Category", sql.VarChar, row["Secondary Category"]);

//             await request.query(`
//                 INSERT INTO materials (
//                   Code, Name, KG_Price, Packaing_Cost, SAP_Unit, WgtUnit, Gross_Weight, Net_Weight, Plant,
//                   Dewas_ready_price, Dewas_forward_price, JBGL_price, UP_Price, Primary_category, MaterialType, Secondary_Category
//                 )
//                 VALUES (
//                   @Code, @Name, @KG_Price, @Packaing_Cost, @SAP_Unit, @WgtUnit, @Gross_Weight, @Net_Weight, @Plant,
//                   @Dewas_ready_price, @Dewas_forward_price, @JBGL_price, @UP_Price, @Primary_category, @MaterialType, @Secondary_Category
//                 )
//             `);
//         }

//         // Delete uploaded file after processing
//         fs.unlinkSync(req.file.path);

//         res.json({ success: true, message: "Materials uploaded successfully!" });
//     } catch (err) {
//         console.error("Error uploading materials:", err);
//         res.status(500).json({ success: false, message: err.message });
//     }
// };


// controllers/Admin.controller.js
import sql from 'mssql';
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';


export const uploadMaterialWithPriceController = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Ensure uploads folder exists
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Read Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Excel file is empty" });
        }

        // Loop through each row
        for (const row of sheetData) {
            const request = pool.request();
            // Convert all values to string to avoid SQL param errors
            Object.keys(row).forEach(key => {
                row[key] = row[key] !== undefined && row[key] !== null ? String(row[key]) : null;
            });
            request.input("Code", sql.VarChar, row["Code"]);
            request.input("Name", sql.VarChar, row["Name"]);
            request.input("KG_Price", sql.VarChar, row["KG_Price"]);
            request.input("Packaing_Cost", sql.VarChar, row["Packaing_Cost"]);
            request.input("SAP_Unit", sql.VarChar, row["SAP_Unit"]);
            request.input("WgtUnit", sql.VarChar, row["WgtUnit"]);
            request.input("Gross_Weight", sql.VarChar, row["Gross_Weight"]);
            request.input("Net_Weight", sql.VarChar, row["Net_Weight"]);
            request.input("Plant", sql.VarChar, row["Plant"]);
            request.input("Dewas_ready_price", sql.VarChar, row["Dewas_ready_price"]);
            request.input("Dewas_forward_price", sql.VarChar, row["Dewas_forward_price"]);
            request.input("JBGL_price", sql.VarChar, row["JBGL_price"]);
            request.input("UP_Price", sql.VarChar, row["UP_Price"]);
            request.input("Primary_category", sql.VarChar, row["Primary_category"]);
            request.input("MaterialType", sql.VarChar, row["MaterialType"]);
            request.input("Secondary_Category", sql.VarChar, row["Secondary_Category"]);
            request.input("AcceptBulkOrder", sql.VarChar, row["AcceptBulkOrder"]);
            await request.query(`
                INSERT INTO materials (
                    Code, Name, KG_Price, Packaing_Cost, SAP_Unit, WgtUnit, Gross_Weight, Net_Weight, Plant,
                    Dewas_ready_price, Dewas_forward_price, JBGL_price, UP_Price, Primary_category, MaterialType, Secondary_Category,AcceptBulkOrder
                )
                VALUES (
                    @Code, @Name, @KG_Price, @Packaing_Cost, @SAP_Unit, @WgtUnit, @Gross_Weight, @Net_Weight, @Plant,
                    @Dewas_ready_price, @Dewas_forward_price, @JBGL_price, @UP_Price, @Primary_category, @MaterialType, @Secondary_Category, @AcceptBulkOrder
                )
            `);
        }

        // Delete uploaded file
        fs.unlinkSync(req.file.path);
        console.log("Materials uploaded successfully!");
        res.json({ success: true, message: "Materials uploaded successfully!" });
    } catch (err) {
        console.error("Error uploading materials:", err);

        // Delete uploaded file if error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateRate = async (req, res) => {
    const request = pool.request();
    const query = `SELECT  [Code]
      ,[Name]
      ,[KG_Price]
      ,[Packaing_Cost]
      ,[SAP_Unit]
      ,[WgtUnit]
      ,[Gross_Weight]
      ,[Net_Weight]
      ,[Plant]
      ,[Dewas_ready_price]
      ,[Dewas_forward_price]
      ,[JBGL_price]
      ,[UP_Price]
      ,[Primary_category]
      ,[MaterialType]
      ,[Secondary_Category]
      ,[AcceptBulkOrder]
  FROM [DMS_KNL].[dbo].[materials]`

    const result = await request.query(query);
    if (result.recordset.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No SKU found.",
            data: [],
        });
    }
    if (!result) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }




}

