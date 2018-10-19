const testInfo = {};

testInfo.IEV4_ABS = [
    '1.启动通讯 EV4_ABS_StartCommunication',
    '2.选择EOL模式 EV4_ABS_StartDiagnosticSession mode:0x83',
    '3.识别诊断仪存在 EV4_ABS_TestPresent',
    '4.读取版本信息 EV4_ABS_ReadEcuData',
    '5.验证安全步骤 EV4_ABS_UnlockECU',
    '6.读取故障码 EV4_ABS_ReadAllDTC',
    '7.通讯结束 EV4_ABS_StopCommunication',
];
testInfo.IEV6E_ABS = [
    '1.启动通讯 EV6E_ABS_DiagSessionControl mode = 3',
    '2.识别诊断仪存在 EV6E_ABS_TestPresent',
    '3.读取版本信息 EV6E_ABS_ReadEcuData',
    '4.读取整车配置信息(读取VIN码、装配日期、整车配置信息) EV6E_ABS_ReadDataByIdentifier did = 0xFD04',
    '5.验证安全步骤 EV6E_ABS_UnlockECU',
    '6.读取并验证VIN码 EV6E_ABS_ReadDataByIdentifier did = 0xF190',
    '7.读取故障码 EV6E_ABS_ReadAllDTC',
    '8.清除故障码 EV6E_ABS_ClearDTC',
    '9.读取故障码 EV6E_ABS_ReadAllDTC',
    '10.软件复位 EV6E_ABS_EcuReset',
];
testInfo.BCM = [
    '1.钥匙匹配',
    '2.读取钥匙数量',
    '3.清除故障码',
    '4.读取故障码',
];
testInfo['BMS（LBC）'] = [
    '1.读取版本号 BMS_ReadDataByIdentifier did = 0xF194',
    '2.读取故障码 BMS_ReadAllDTC',
    '3.清故障码 BMS_ClearDTC',
    '4.读取故障码 BMS_ReadAllDTC',
];
testInfo.EPB = [
    '1.启动扩展模式 EV6_EPB_DiagSessionControl (3)',
    '2.识别诊断仪 EV6_EPB_TestPresent',
    '3.验证安全步骤 EV6_EPB_UnlockECU',
    '4.读取版本信息 EV6_EPB_ReadEcuData',
    '5.读取故障码 EV6_EPB_ReadAllDTC',
    '6.清除故障码 EV6_EPB_ClearDTC',
    '7.读取故障码 EV6_EPB_ReadAllDTC',
];
testInfo.IEV6E_EPS = [
    '1.启动扩展模式 EV6_EPS_DiagSessionControl (3)',
    '2.识别诊断仪 EV6_EPS_TestPresent',
    '3.验证安全步骤 EV6_EPS_UnlockECU',
    '4.读取版本信息 EV6_EPS_ReadEcuData',
    '5.读取故障码 EV6_EPS_ReadAllDTC',
    '6.清除故障码 EV6_EPS_ClearDTC',
    '7.读取故障码 EV6_EPS_ReadAllDTC',
];
testInfo.PCU = [
    '1.读取PCU内版本 did = 0xF194',
    '2.清读故障码',
];
testInfo.IEV6E_SRS = [
    '1.启动通讯 EV6E_SRS_StartCommunication',
    '2.启动诊断会议 EV6E_SRS_StartDiagnosticSession (0x83)',
    '3.识别诊断仪 EV6E_SRS_TestPresent',
    '4.读取并验证VIN码 EV6E_SRS_ReadDataByIdentifier did = 0x81',
    '5.读取故障码 EV6E_SRS_ReadAllDTC',
    '6.清除故障码 EV6E_SRS_ClearDTC',
    '7.读取故障码 EV6E_SRS_ReadAllDTC',
    '8.结束通讯 EV6E_SRS_StopCommunication',
];
testInfo.TBOX = [
    '1.验证安全步骤 TBox_UnlockECU',
    '2.读取ECU并校验北京电池编码 TBox_ReadDataByIdentifier did = 0xF1F0',
    '3.读取ECU并校验上海电池编码 TBox_ReadDataByIdentifier did = 0xF1F1',
    '4.清除故障码 TBox_ClearDTC',
];
testInfo.VCU = [
    '1.读取VCU版本信息号 VCU_ReadDataByIdentifier did = 0xF194',
    '2.验证安全步骤 VCU_UnlockECU',
    '3.读取并验证VIN码 VCU_ReadDataByIdentifier did = 0xF190',
    '4.读取故障码 VCU_ReadAllDTC',
    '5.清故障码 VCU_ClearDTC',
    '6.读取故障码 VCU_ReadAllDTC',
];

module.exports = {
    testInfo,
};
