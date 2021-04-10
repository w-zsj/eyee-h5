import { POSTGROUP, GETGROUP, POST } from '@/common/util'

const RecommendBuiness = () => {
    return POST('/api/Business/RecommendBuiness', {}, true)

}
const BrandHotSale = () => {
    return POST('/api/Base/BrandHotSale', {}, true)

}
const categoryShop = ({ categoryid, pageindex }) => {
    return POST('/api/Business/GetListByCategoryV322', { categoryid, pageindex }, true)
}

export { RecommendBuiness, BrandHotSale, categoryShop }
