import { POST, POSTGROUP } from '@/common/util'

const GetShareRule = () => {
  return POSTGROUP('/capi/redpacket/receive/getShareRule', {}, 0)
}

const GetInviteUid = () => {
  return POSTGROUP('/capi/redpacket/receive/getinviteduserid', {}, 0)
}

const GetShareList = () => {
  return POSTGROUP('/capi/redpacket/receive/selectShareList', {}, 0)
}

const GetStandardList = activityid => {
  return POSTGROUP('/capi/redpacket/receive/selectStandardList', { activityid })
}

const GetRankList = activityid => {
  return POSTGROUP('/capi/redpacket/receive/getRankList', { activityid })
}

const UpdPopupStatus = ({ activityid, progress, sspopupstatus } = {}) => {
  return POSTGROUP('/capi/redpacket/receive/updatePopupStatus', { activityid, progress, sspopupstatus })
}

const GiveOutRedPacket = activityid => {
  return POSTGROUP('/capi/redpacket/receive/giveOutRedPacket', { activityid })
}

const GetActivityRules = ({ activityid, orderno } = {}) => {
  return POSTGROUP('/capi/redpacket/open/getactivityrules', { activityid, orderno }, 0)
}

const GetOrderShare = ({ orderno, isB2C }) => {
  return POSTGROUP(`/capi/redpacket/randomActivity/${isB2C ? 'b2cOrderDetail' : 'c2cOrderDetail'}`, { orderno })
}

const GetRedpacket = ({ orderno, activityid } = {}) => {
  return POSTGROUP('/capi/redpacket/randomActivity/getRedPacket', { orderno, activityid })
}

const GetRedpacketInfo = receiveid => {
  return POSTGROUP('/capi/redpacket/open/redpacketDetail', { receiveid })
}

const GetRedpacketList = shareid => {
  return POSTGROUP('/capi/redpacket/open/redPacketList', { shareid }, 0)
}


export {
  GetShareRule, GetInviteUid,
  GetShareList, GetStandardList, GetRankList,
  UpdPopupStatus, GiveOutRedPacket,
  GetActivityRules, GetOrderShare,
  GetRedpacket, GetRedpacketInfo, GetRedpacketList
}
