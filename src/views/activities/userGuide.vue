<template>
    <div>
        <div v-for="(item,index) in img" :key="index" class="img">
            <img v-lazy="item" alt>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            img:[
                'https://files.eyee.com/eyeeh5/img/1.png',
                'https://files.eyee.com/eyeeh5/img/2.png',
                'https://files.eyee.com/eyeeh5/img/3.png',
                'https://files.eyee.com/eyeeh5/img/4.png'
                ]
        }
    }
}
</script>
<style scoped>
.img{
    width: 100%;
}
.img img{
    display: block;
    width: 100%;
}
</style>

