USE JAC_UDS
GO
-- 车型配置表
IF OBJECT_ID(N'JAC_UDS.dbo.VehicleType') IS NOT NULL
    DROP TABLE JAC_UDS.dbo.VehicleType
GO
CREATE TABLE JAC_UDS.dbo.VehicleType
(
    ID int IDENTITY PRIMARY KEY NOT NULL, -- ID, 自增, 主键
    VehicleType varchar(20) NOT NULL UNIQUE, -- 车型代码
    ECUConfig varchar(30), -- ECU配置
)
GO

-- 插入字段备注
EXEC sp_addextendedproperty N'MS_Description', N'ID', N'USER', N'dbo', N'TABLE', N'VehicleType', N'COLUMN', N'ID'
EXEC sp_addextendedproperty N'MS_Description', N'车型代码', N'USER', N'dbo', N'TABLE', N'VehicleType', N'COLUMN', N'VehicleType'
EXEC sp_addextendedproperty N'MS_Description', N'ECU配置', N'USER', N'dbo', N'TABLE', N'VehicleType', N'COLUMN', N'ECUConfig'
GO

-- 测试: 插入数据
INSERT JAC_UDS.dbo.VehicleType (VehicleType, ECUConfig)
    VALUES ('IEV4', '7,8,9,10')
INSERT JAC_UDS.dbo.VehicleType (VehicleType, ECUConfig)
    VALUES ('IEV6E', '2,3,6,7,8,9,10')
GO
-- 测试: 修改数据
UPDATE JAC_UDS.dbo.VehicleType
    SET ECUConfig = '9,10'
    WHERE VehicleType = 'IEV4'
GO
-- 测试: 查询数据
SELECT *
    FROM JAC_UDS.dbo.VehicleType
GO

-- ECU配置表
IF OBJECT_ID(N'JAC_UDS.dbo.ECU') IS NOT NULL
    DROP TABLE JAC_UDS.dbo.ECU
GO
CREATE TABLE JAC_UDS.dbo.ECU
(
    ID int IDENTITY PRIMARY KEY NOT NULL, -- ID, 自增, 主键
    ECUName varchar(20) NOT NULL UNIQUE, -- ECU名
    TestConfig varchar(30), -- 测试项目配置
)
GO

-- 插入字段备注
EXEC sp_addextendedproperty N'MS_Description', N'ID', N'USER', N'dbo', N'TABLE', N'ECU', N'COLUMN', N'ID'
EXEC sp_addextendedproperty N'MS_Description', N'ECU名', N'USER', N'dbo', N'TABLE', N'ECU', N'COLUMN', N'ECUName'
EXEC sp_addextendedproperty N'MS_Description', N'测试项目配置', N'USER', N'dbo', N'TABLE', N'ECU', N'COLUMN', N'TestConfig'
GO

-- 测试: 插入数据
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('IEV4_ABS', '1,2,3,4,5,6,7')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('IEV6E_ABS', '1,2,3,4,5,6,7,8,9,10')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('BCM', '')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('BMS（LBC）', '1,2,3,4')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('EPB', '')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('IEV6E_EPS', '1,2,3,4,5,6,7')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('PCU', '1,2')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('IEV6E_SRS', '1,2,3,4,5,6,7,8')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('TBOX', '1,2,3,4')
INSERT JAC_UDS.dbo.ECU (ECUName, TestConfig)
    VALUES ('VCU', '1,2,3,4,5,6')
GO
-- 测试: 查询数据
SELECT *
    FROM JAC_UDS.dbo.ECU
GO
