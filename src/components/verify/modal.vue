<template>
    <div class='md-cont' v-show='showstate'>
        <div class='md-wrapper' >
            <div class='md-title'>
            <slot name='tlt' >
                标题
            </slot>
            </div>
            <div class='md-text'>
            <slot name='text' >
                这里是弹框内容
            </slot>
            </div>
            
        </div>
    </div>
</template>
<script>
export default{
    name:'modal',
    props:['type','showstate'],
    methods:{
        tocancel:function(){
            this.$emit('tocancel');
        },
        took:function(){
            this.$emit('took');
        }
    }
}
</script>
<style scoped>
    .md-cont{
        position:fixed;
        left:0;
        right: 0;
        top:0;
        bottom: 0;
        z-index: 500;
        background:rgba(0,0,0,0.4);
        text-align:center;
        overflow: hidden;
        white-space:nowrap;
    }
    .md-cont:after{
        content:"";
        display:inline-block;
        width:0;
        height:100%;
        visibility: hidden;
        vertical-align:middle;
        }
    .md-wrapper{
        display:inline-block;
        background:#fff;
        color:#ffffff;
        font-size:0.34rem;
        border-radius:14pt;
        max-width:100%;
        vertical-align:middle;
        }
    .md-title{
        border-radius: 14pt 14pt 0 0;
        font-size: 1.3rem;
        line-height:5rem;        
        background:#333;
        display: flex;
    }
    .md-text{
        background-color: #fff;
        font-size:1.3rem;
        line-height:3rem;
        padding:0.2rem 0.5rem;
        color: #ababab;
    }
    .md-btn input{
        color:#fff;
        width: 90%;
        line-height: 2rem;
        border-radius: 5pt;
        margin-top: 2rem;
        margin-bottom: 2rem;
        border: 0;
        -moz-appearance: none;
        -webkit-appearance: none;
    }
</style>