CREATE TABLE [dbo].[materials] (
    [AcceptBulkOrder]       VARCHAR(255)      NULL,
    [Code]                  NVARCHAR(255)     NOT NULL,
    [Dewas_forward_price]   DECIMAL(18,2)     NULL,
    [Dewas_ready_price]     DECIMAL(18,2)     NULL,
    [Gross_Weight]          DECIMAL(18,2)     NULL,
    [JBGL_price]            DECIMAL(18,2)     NULL,
    [KG_Price]              DECIMAL(18,2)     NULL,
    [MaterialType]          NVARCHAR(255)     NULL,
    [Name]                  NVARCHAR(255)     NULL,
    [Net_Weight]            DECIMAL(18,2)     NULL,
    [Packaing_Cost]         DECIMAL(18,2)     NULL,
    [Plant]                 NVARCHAR(255)     NULL,
    [Primary_category]      NVARCHAR(255)     NULL,
    [SAP_Unit]              NVARCHAR(255)     NULL,
    [Secondary_Category]    NVARCHAR(255)     NULL,
    [UP_Price]              DECIMAL(18,2)     NULL,
    [WgtUnit]               NVARCHAR(255)     NULL,

    CONSTRAINT [PK_materials_Code] PRIMARY KEY ([Code])
);
