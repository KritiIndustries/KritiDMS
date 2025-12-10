import sql from 'mssql';
import pool from '../config/db.js';  // ✅ Correct import now
import InsertSalesOrder from '../helper/InsertSalesOrder.js';
import UpdateSalesOrder from '../helper/UpdatesalesOrder.js'

export const loginController = async (req, res) => {
    try {
        const dealerCode = req.body.dealerCode || req.body.dealerId;
        const password = req.body.password;
        if (!dealerCode || !password) {
            return res.status(400).json({
                success: false,
                message: 'Dealer code and password are required',
            });
        }
        const request = pool.request();
        request.input('dealerCode', sql.VarChar, dealerCode);
        request.input('password', sql.VarChar, password);

        const result = await request.query(`
      SELECT [UserName],[Location],[FirstName],[EmailId],[Phone],
             [UserType],[Place],[City],[District],[RegionName],
             [SatelliteUser],[ActiveUser],[PriceList],[PriceGroup],
             [PanNumber],[CompanyCode],[SalesOrg],[GstNumber],
             [Address],[StateCode],[GstCode],[PostalCode],[CustType],[plantName]
      FROM Dealers
      WHERE UserName = @dealerCode AND Password = @password
    `);

        if (result.recordset.length > 0) {
            const dealer = result.recordset[0];
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: dealer,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid dealer code or password',
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message,
        });
    }
};

export const getTodayPriceController = async (req, res) => {
    const request = pool.request();
    const result = await request.query(`SELECT [Code]
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
  FROM [DMS_KNL].[dbo].[materials]`)

    if (result.recordset.length > 0) {
        const material = result.recordset;
        return res.status(200).json({
            success: true,
            message: 'Material Fetch successfully',
            data: material,
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Invalid dealer code or password',
        });
    }
}

export const getMaterialController = async (req, res) => {
    const request = pool.request();
    const result = await request.query(`SELECT [Code]
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
  FROM [DMS_KNL].[dbo].[materials]`)

    if (result.recordset.length > 0) {
        const material = result.recordset;
        return res.status(200).json({
            success: true,
            message: 'Material Fetch successfully',
            data: material,
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Invalid dealer code or password',
        });
    }
}

// adjust if your db connection file is different

export const checkIndentDone = async (req, res) => {
    try {
        const { SO, Material } = req.params;

        // 🔹 Validate parameters
        if (!SO || !Material) {
            return res.status(400).json({
                success: false,
                message: "Sales Order (SO) and Material are required",
            });
        }

        const request = pool.request();
        request.input("SO", sql.NVarChar(20), SO);
        request.input("Material", sql.NVarChar(10), Material);

        // 🔍 Check indent status for given Sales Order & Material
        const result = await request.query(`
            SELECT SoNumber, Material, quantity, indent
            FROM indent
            WHERE SoNumber = @SO AND Material = @Material
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No indent record found for Sales Order ${SO} and Material ${Material}`,
            });
        }

        const record = result.recordset[0];

        // ✅ Return status based on indent field
        if (record.indent === true) {
            return res.status(200).json({
                success: true,
                message: `Indent is done for Sales Order ${SO} and Material ${Material}`,
                data: record,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `Indent is NOT done for Sales Order ${SO} and Material ${Material}`,
                data: record,
            });
        }
    } catch (err) {
        console.error("checkIndentDone error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const hanldeIndentController = async (req, res) => {
    try {
        const { SoNumber, Material, quantity, indent } = req.body;

        // 🔹 Validate required fields
        if (!SoNumber || !Material || !quantity || indent === undefined) {
            return res.status(400).json({
                success: false,
                message: "SoNumber, Material, quantity, and indent are required",
            });
        }

        const request = pool.request();
        request.input("SoNumber", sql.NVarChar(20), SoNumber);
        request.input("Material", sql.NVarChar(10), Material);
        request.input("quantity", sql.NVarChar(10), quantity);
        request.input("indent", sql.Bit, indent);

        // 🔍 Check if record already exists
        const checkQuery = `
            SELECT COUNT(*) AS count
            FROM indent
            WHERE SoNumber = @SoNumber AND Material = @Material
        `;
        const checkResult = await request.query(checkQuery);
        const exists = checkResult.recordset[0].count > 0;

        if (exists) {
            return res.status(409).json({
                success: false,
                message: `Indent already exists for Sales Order ${SoNumber} and Material ${Material}`,
            });
        }

        // ✅ Insert new indent
        const insertQuery = `
            INSERT INTO indent (SoNumber, Material, quantity, indent)
            VALUES (@SoNumber, @Material, @quantity, @indent)
        `;
        await request.query(insertQuery);

        return res.status(200).json({
            success: true,
            message: "Indent inserted successfully",
            data: { SoNumber, Material, quantity, indent },
        });
    } catch (err) {
        console.error("Indent insert error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};


// export const submitOrder = async (req, res) => {
//     const dealer = req.body.storedDealer
//     const cart = req.body.cart
//     const dealerCategory = req.body.dealerCategory
//     const SBOtype = req.body.SBOtype
//     try {
//         const response = await InsertSalesOrder(dealer, cart, dealerCategory, SBOtype)
//         console.log(response);

//         if (response) {
//             return res.status(200).json({
//                 success: true,
//                 message: `Cooking Oil depot SO ${response} has been saved`,
//                 data: response,
//             });
//         } else {
//             return res.status(400).json({
//                 success: true,
//                 message: `NOT FOUND`,
//                 data: response,
//             });
//         }
//     } catch (err) {
//         console.error('Insertion failed:', err);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: err.message,
//         });
//     }



// }


//This is working fine but not storing in local DB
export const submitOrder = async (req, res) => {
    const dealer = req.body.storedDealer;
    const cart = req.body.cart;
    const dealerCategory = req.body.dealerCategory;
    const SBOtype = req.body.SBOtype;

    try {
        const response = await InsertSalesOrder(dealer, cart, dealerCategory, SBOtype);
        console.log("SAP Response:", response);
        if (response) {
            // const insertedOrder = await insertOrderInLocalDB(dealer, cart, dealerCategory, SBOtype, response.SALESORDER);
            return res.status(200).json({
                success: true,
                message: `Contract ${response.SALESORDER} has been saved`,
                data: response,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "SAP did not return a Sales Order number.",
                data: response,
            });
        }
    } catch (err) {
        console.error("Insertion failed:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating sales order.",
            error: err.message,
        });
    }
};

// export const submitOrder = async (req, res) => {
//     const { storedDealer: dealer, cart, dealerCategory, SBOtype } = req.body;

//     // Validate required fields
//     if (!dealer?.UserName || !Array.isArray(cart) || cart.length === 0 || !dealerCategory || SBOtype === undefined) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing required fields: dealer, cart, dealerCategory, or SBOtype",
//         });
//     }

//     try {
//         // Step 1: Create SO in SAP
//         const sapResponse = await InsertSalesOrder(dealer, cart, dealerCategory, SBOtype);

//         if (!sapResponse?.SALESORDER) {
//             return res.status(400).json({
//                 success: false,
//                 message: "SAP did not return a valid Sales Order number",
//                 data: sapResponse,
//             });
//         }

//         const salesOrderNumber = sapResponse.SALESORDER;

//         // Step 2: Save locally with SO number
//         const localResult = await insertOrderInLocalDB({
//             dealer,
//             cart,
//             dealerCategory,
//             SBOtype,
//             salesOrderNumber,
//         });

//         if (!localResult.success) {
//             console.error("Local DB insert failed after SAP success:", localResult.error);
//             // Optional: You might still want to return success if SAP worked
//         }

//         return res.status(200).json({
//             success: true,
//             message: `Sales Order ${salesOrderNumber} created and saved successfully`,
//             salesOrder: salesOrderNumber,
//             sapData: sapResponse,
//             localInsert: localResult,
//         });
//     } catch (error) {
//         console.error("submitOrder failed:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to create sales order",
//             error: error.message || "Unknown error",
//         });
//     }
// };

// export const insertOrderInLocalDB = async (dealer, cart, dealerCategory, SBOtype, SalesOrder) => {
//     // 🔹 Validate required fields
//     if (!SalesOrder || !dealer || !cart || !dealerCategory || SBOtype === undefined) {
//         return res.status(400).json({
//             success: false,
//             message: "dealer cart  Category SBOtype are required",
//         });
//     }
//     const orders = [];
//     // console.log("Dealer", JSON.stringify(dealer));
//     // console.log("cart", JSON.stringify(cart));
//     // console.log("dealerCategory", JSON.stringify(dealerCategory));
//     // console.log("SBO Type", SBOtype);
//     const today = new Date();

//     let month = today.getMonth() + 1; // getMonth() is 0-indexed, so add 1
//     let day = today.getDate();
//     let year = today.getFullYear().toString().slice(-2); // Get last two digits of the year

//     // Add leading zero if month or day is a single digit
//     if (month < 10) {
//         month = '0' + month;
//     }
//     if (day < 10) {
//         day = '0' + day;
//     }

//     const formattedDate = `${day}/${month}/${year}`;
//     console.log(formattedDate);
//     for (const item of cart) {
//         const insertQuery = `
//         INSERT INTO DMS_KNL.dbo.orders (SalesOrder,
//           soldToParty, material, quantity, description, unit, plant, type,
//           ListPrice, TotalPrice, Date, category, totalweightKG, totalweightMT
//         ) VALUES (
//           @soldToParty, @material, @quantity, @description, @unit, @plant, @type,
//           @ListPrice, @TotalPrice, @formattedDate, @category, @totalweightKG, @totalweightMT
//         )
//       `;
//         const request = pool.request();
//         const insertedOrder = await request
//             .input("SalesOrder", sql.NVarChar(20), String(SalesOrder))
//             .input("soldToParty", sql.NVarChar(20), String(dealer.UserName))
//             .input("material", sql.NVarChar(40), String(item.sku))
//             .input("quantity", sql.Int, parseInt(item.quantity) || 0)
//             .input("description", sql.NVarChar(255), String(item.name))
//             .input("unit", sql.NVarChar(10), String(item.unit).toUpperCase())
//             .input("plant", sql.NVarChar(10), String(dealer.Location))
//             .input("type", sql.NVarChar(20), String(SBOtype))
//             .input("ListPrice", sql.Decimal(18, 2), parseFloat(item.price) || 0)
//             .input("TotalPrice", sql.Decimal(18, 2), parseFloat(item.total) || 0)
//             .input("orderDate", sql.Date, formattedDate) // TODAY'S DATE if not provided
//             .input("category", sql.NVarChar(20), String(dealerCategory))
//             .input("totalweightKG", sql.Decimal(18, 3), parseFloat(item.totalVolume) || 0)
//             .input("totalweightMT", sql.Decimal(18, 3), parseFloat(item.totalTons) || 0)
//             .query(insertQuery);

//         if (indentOrder) {
//             orders.push(insertedOrder);
//         }

//     }
//     return orders;
// }



export const insertOrderInLocalDB = async ({ dealer, cart, dealerCategory, SBOtype, salesOrderNumber }) => {
    if (!dealer?.UserName || !cart?.length || !dealerCategory || SBOtype === undefined || !salesOrderNumber) {
        return { success: false, message: "Invalid input data" };
    }

    const today = new Date();
    const sqlDate = today.toISOString().split('T')[0]; // "2025-04-25" → perfect for SQL DATE

    let connection;
    try {
        connection = await pool.connect();
        const request = connection.request();

        const results = [];

        for (const item of cart) {
            const query = `
        INSERT INTO DMS_KNL.dbo.orders (
          SalesOrder, soldToParty, material, quantity, description, unit, plant, type,
          ListPrice, TotalPrice, [Date], category, totalweightKG, totalweightMT
        ) VALUES (
          @SalesOrder, @soldToParty, @material, @quantity, @description, @unit, @plant, @type,
          @ListPrice, @TotalPrice, @orderDate, @category, @totalweightKG, @totalweightMT
        );
        SELECT SCOPE_IDENTITY() AS insertId;
      `;

            const result = await request
                .input('SalesOrder', sql.NVarChar(20), String(salesOrderNumber))
                .input('soldToParty', sql.NVarChar(20), String(dealer.UserName))
                .input('material', sql.NVarChar(40), String(item.sku || ''))
                .input('quantity', sql.Int, parseInt(item.quantity) || 0)
                .input('description', sql.NVarChar(255), String(item.name || ''))
                .input('unit', sql.NVarChar(10), String(item.unit || 'KG').toUpperCase())
                .input('plant', sql.NVarChar(10), String(dealer.Location || '1100'))
                .input('type', sql.NVarChar(20), SBOtype ? 'ZSB' : 'ZOR')
                .input('ListPrice', sql.Decimal(18, 2), parseFloat(item.price) || 0)
                .input('TotalPrice', sql.Decimal(18, 2), parseFloat(item.total) || 0)
                .input('orderDate', sql.Date, sqlDate)  // Proper DATE type → NO CONVERSION ERROR
                .input('category', sql.NVarChar(20), String(dealerCategory))
                .input('totalweightKG', sql.Decimal(18, 3), parseFloat(item.totalVolume) || 0)
                .input('totalweightMT', sql.Decimal(18, 3), parseFloat(item.totalTons) || 0)
                .query(query);

            results.push({
                insertId: result.recordset[0].insertId,
                material: item.sku,
                date: sqlDate,
            });
        }

        const displayDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;

        console.log(`SUCCESS: ${results.length} items inserted for SO ${salesOrderNumber} on ${displayDate}`);

        return {
            success: true,
            message: "Orders saved successfully",
            count: results.length,
            salesOrder: salesOrderNumber,
            dateStored: sqlDate,        // 2025-04-25 (in DB)
            dateDisplay: displayDate,    // 25/04/25 (for frontend)
        };
    } catch (error) {
        console.error("Local DB insert failed:", error.message);
        return {
            success: false,
            message: "Failed to save to local database",
            error: error.message,
        };
    } finally {
        if (connection) connection.close();
    }
};

export const IndentSalesOrder = async (req, res) => {
    const payload = req.bod.payload
    console.log("payload from Front End", payload);
    return res.status(200).json({
        success: true,
        message: `Checked`,
        data: response
    })


}

export const indentOrder = async (req, res) => {
    try {
        const { d } = req.body;
        if (!d || !d.Vbeln || !d.SalesHdrItemNav || !Array.isArray(d.SalesHdrItemNav)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payload format. Expected structure: d.Vbeln and d.SalesHdrItemNav[]",
            });
        }
        const Vbeln = d.Vbeln;
        const items = d.SalesHdrItemNav;

        const request = pool.request();

        // Loop and insert each item
        for (const item of items) {
            request.input("Vbeln", sql.VarChar, item.Vbeln || Vbeln);
            request.input("Posnr", sql.VarChar, item.Posnr);
            request.input("Matnr", sql.VarChar, item.Matnr);
            request.input("Kwmeng", sql.VarChar, item.Kwmeng);
            request.input("Vrkme", sql.VarChar, item.Vrkme);

            const query = `
        INSERT INTO [DMS_KNL].[dbo].[indent_Table]
        (Vbeln, Posnr, Matnr, Kwmeng, Vrkme)
        VALUES (@Vbeln, @Posnr, @Matnr, @Kwmeng, @Vrkme)
      `;

            await request.query(query);
            request.parameters = {}; // clear parameters for next iteration
        }

        res.status(200).json({
            success: true,
            message: `Indent Order ${Vbeln} inserted successfully with ${items.length} items.`,
            insertedItems: items.length,
        });
    } catch (error) {
        console.error("❌ Error inserting indent order:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const getIndentOrders = async (req, res) => {
    try {
        const request = pool.request();
        const query = `
      SELECT [Vbeln], [Posnr], [Matnr], [Kwmeng], [Vrkme]
      FROM [DMS_KNL].[dbo].[indent_Table]
      ORDER BY [Vbeln], [Posnr]
    `;

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No indent orders found.",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Indent orders retrieved successfully.",
            data: result.recordset,
        });
    } catch (error) {
        console.error("❌ Error retrieving indent orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const breakAndSendToAPI = async (req, res) => {
    try {
        // Validate input
        const SOdata = req.body.filteredSOData;
        if (!SOdata || !Array.isArray(SOdata) || SOdata.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Sales Order data received.",
            });
        }

        console.log("🚀 Starting Break and Send to SAP API process...");
        console.log(`🧾 Total Sales Orders: ${SOdata.length}`);

        // Call UpdateSalesOrder function
        const result = await UpdateSalesOrder(SOdata);

        // Prepare success response
        return res.status(200).json({
            success: true,
            message: "Sales Orders processed successfully.",
            summary: result, // Array of results from UpdateSalesOrder
        });

    } catch (error) {
        console.error("❌ Error during breakAndSendToAPI:", error);

        // Send error response
        return res.status(500).json({
            success: false,
            message: "Failed to process Sales Orders.",
            error: error.message || "Unknown server error",
        });
    }
};




