import { POSTGROUP } from '@/common/util'
//游客访问
export const RedPackRainOpenMainApi = () => {
  return POSTGROUP('/capi/activity/open/redpacket/openMain')
}
// 进入活动主界面
export const RedPackRainMainApi = (invitecode) => {
  return POSTGROUP('/capi/activity/redpacket/main', { invitecode })
}
// 提醒下一场
export const RedPackRainAppointmentApi = (scene) => {
  return POSTGROUP('/capi/activity/redpacket/appointment', { scene })
}
// 立即开始
export const RedPackRainBeginGameApi = (scene) => {
  return POSTGROUP('/capi/activity/redpacket/play', { scene })
}
// 当前游戏结束
export const RedPackRainGameOverApi = ({ amount, coupon }) => {
  return POSTGROUP('/capi/activity/redpacket/gameOver', { amount, coupon })
}

// 活动结束
export const RedPackRainAllOverApi = () => {
  return POSTGROUP('/capi/activity/redpacket/allOver')
}

// 分享
export const shareRainToFriendApi = () => {
  return POSTGROUP('/capi/activity/redpacket/share')
}
