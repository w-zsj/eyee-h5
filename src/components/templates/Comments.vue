<template>
    <div class="Comments" @click.stop.prevent="loadApp(artitype)" v-show="lengComt>0">
        <p class="title_comment">所有评论({{lengComt}})</p>
        <ul>
            <li v-for="(item,index) in limitedList" :key="index">
                <div class="box-fath">
                    <div class="box-chil right">
                        <em class="ico-zan-thumb"></em>
                        <span class="zan">{{item.digcount}} </span>
                    </div>
                    <div class="wid-30">
                        <img v-lazy="https(item.avatarurl)" alt="">
                    </div>
                    <div class="box-chil wid-flex3">
                        <p class="name"> {{item.username}}</p>
                        <p class="time ">{{item.createtime}}</p>
                        <p class="cont ">{{item.content}}</p>
                    </div>
                </div>
                <section class="replybox" v-if="item.reply && item.reply.length>0">
                    <div class="reply-list" v-for="(re,indx) in item.reply" :key="indx">
                        <label class="reply-name">
                            <span class="name-tit"> {{re.username}}</span>
                            <span>: {{re.content}}</span>
                        </label>
                    </div>
                </section>
            </li>
        </ul>
        <p class="all_comts">查看更多评论>></p>
    </div>
</template>
<script>
    import { DateDiffFormat } from '../../common/util'
    export default {
      name: 'Comments',
      props: ['comments', 'lengComt', 'artitype'],
      computed: {
        limitedList() {
          let comments = this.comments
          // console.log('comments',comments)
          if (comments && comments.length > 0) {
            if (comments.length > 3) {
              comments = comments.slice(0, 3)
            }
            comments = comments.map(i => {
              i.createtime = DateDiffFormat(i.createtime)
              return i
            })
            return comments
          } else {
            return null
          }
        }
      }
    }

</script>
<style scoped>
    .Comments {
        font-size: .75rem;
        color: #999;
        line-height: 20px;
        padding: 10px;
    }

    .Comments .title_comment {
        text-align: left;
        font-size: 1rem;
        color: #333;
    }

    .Comments>ul {
        padding: 20px 10px 0;
    }

    .Comments>ul li {
        display: block;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        width: 100%;
        margin-bottom: 10px;
    }

    .Comments>ul li:last-child {
        border-bottom: none;
    }

    .Comments>ul li .box-fath {
        overflow: hidden;
    }

    .Comments>ul li .box-fath .box-chil.wid-flex3 {
        margin-left: 40px;
        margin-right: 30px;
    }

    .Comments>ul li .box-fath .box-chil.right {
        text-align: right;
        float: right;
        width: 30px;
    }

    .Comments>ul li .box-fath .box-chil p {
        text-align: left;
        margin: 0;
        min-height: 18px;
        line-height: 18px;
        color: #666;
        font-size: .75rem;
    }

    .Comments>ul li .box-fath .box-chil p.name {
        color: #333;
    }

    .Comments>ul li .box-fath .box-chil p.time {
        color: #999;
    }

    .Comments>ul li .box-fath .box-chil p.cont {
        font-size: .835rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .Comments>ul li .box-fath .box-chil span.zan {
        color: #999;
        font-size: .75rem;
        vertical-align: middle;
        margin-right: 3px;
    }

    .Comments>ul li .box-fath .wid-30 {
        float: left;
        width: 30px;
    }

    .Comments>ul li .box-fath .wid-30 img {
        display: block;
        width: 30px;
        height: 30px;
        -webkit-border-radius: 50%;
        border-radius: 50%;
    }

    .Comments>ul li .replybox {
        position: relative;
        margin: 10px 40px 0 40px;
        padding: 9px 5px;
        background: #eee;
        font-size: .75rem;
        color: #999;
        text-align: left;
    }

    .Comments>ul li .replybox:before {
        content: '';
        position: absolute;
        left: 20px;
        top: -8px;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 8px solid #eee;
    }

    .Comments>ul li .replybox .name-tit {
        color: #333;
    }

    .Comments>ul li .replybox .reply-link {
        color: #333;
        font-size: .75rem;
    }

    .Comments .all_comts {
        color: #ffc700;
        font-size: .75rem;
        text-align: center;
        margin: 10px 0;
    }
</style>
