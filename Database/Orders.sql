USE DMS_KNL;
GO

-- Drop if exists (optional - remove in production if not needed)
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL
    DROP TABLE dbo.orders;
GO

-- HIGH-PERFORMANCE TABLE with correct data types
CREATE TABLE dbo.orders (
    ID              BIGINT IDENTITY(1,1) PRIMARY KEY,    -- Auto-increment ID (best for indexing)
    
    soldToParty     VARCHAR(20)     NOT NULL,   -- e.g. '10001234'
    material        VARCHAR(40)     NOT NULL,   -- Material code
    quantity        INT             NOT NULL,   -- Quantity in units
    description     VARCHAR(255)    NULL,      -- Material description
    unit            VARCHAR(10)     NOT NULL,   -- LTR, KG, etc.
    plant           VARCHAR(10)     NOT NULL,   -- Plant code
    type            VARCHAR(20)     NOT NULL,   -- ZOR, ZNL, etc.
    
    ListPrice       DECIMAL(18,2)   NOT NULL,   -- Price per unit
    TotalPrice      DECIMAL(18,2)   NOT NULL,   -- ListPrice × quantity
    
    [Date]          DATE            NOT NULL,   -- Proper DATE type (not varchar!)
    category        VARCHAR(20)     NOT NULL,   -- SBO, GNO, SFO, etc.
    
    totalweightKG   DECIMAL(18,3)   NOT NULL,   -- Weight in KG (3 decimals)
    totalweightMT   DECIMAL(18,3)   NOT NULL    -- Weight in MT (3 decimals)
);
GO

-- HIGH-PERFORMANCE INDEXES (critical for fast queries)
-- Most common filters → make them covering indexes
CREATE NONCLUSTERED INDEX IX_orders_Date_soldToParty 
ON dbo.orders ([Date] DESC, soldToParty)
INCLUDE (material, quantity, TotalPrice, category, totalweightMT);
GO

CREATE NONCLUSTERED INDEX IX_orders_soldToParty_Date 
ON dbo.orders (soldToParty, [Date] DESC)
INCLUDE (TotalPrice, totalweightMT);
GO

CREATE NONCLUSTERED INDEX IX_orders_category_Date 
ON dbo.orders (category, [Date] DESC)
INCLUDE (soldToParty, TotalPrice, totalweightMT);
GO

CREATE NONCLUSTERED INDEX IX_orders_plant_Date 
ON dbo.orders (plant, [Date] DESC);
GO

-- Optional: Statistics for better query plans
UPDATE STATISTICS dbo.orders;
GO

PRINT 'High-performance table [dbo.orders] created successfully in DMS_KNL';
PRINT 'Ready for millions of rows with lightning-fast queries!';