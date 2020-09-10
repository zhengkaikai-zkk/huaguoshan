<template>
    <div id="address">
        <pageHeader/>
        <div class="skip" @click="$router.push('/address_edit')">添加收货地址</div>
        <div class="d_list">
            <div class="card" v-for="(item,index) in list">
                <div>
                    <li>{{index+1}}</li>
                    <div>
                        <p>{{item.receiveName}}&nbsp;&nbsp;{{item.receivePhone}}</p>
                        <span>{{item.region+' '+item.details}}</span>
                    </div>
                </div>
                <p @click="$router.push('/address_edit?id='+item.id)">编辑</p>
            </div>
        </div>
        <div v-if="list.length==0" class="no_data">暂未添加地址</div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list: [],
        }
    },

    methods: {
        getList(){
            this.$request.post({
                url: '/us/address/list',
                success: res => {
                    this.list=res;
                },
            });
        },
    },

    mounted(){
        this.getList();
    }
}
</script>

<style lang="scss" scoped>
#address{
    padding-top: 4.6rem;
    font-size: 1.4rem;
    color: #222;
}
.skip{
    position: fixed;
    right: 1rem;
    top: 1.4rem;
    z-index: 199;
    font-size: 1.2rem;
    letter-spacing: 0;
}
.d_list{
    margin: 0.9rem;
    background: #fff;
    border-radius: 0.5rem;
}
.card{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem;
    letter-spacing: 0;
    border-bottom: 1px solid #f3f3f3;
    &>div{
        display: flex;
        align-items: center;
        border-right: 1px solid #f3f3f3;
        width: 90%;
        p{
            margin-bottom: 0.5rem;
        }
        span{
            font-size: 1.2rem;
        }
    }
    li{
        background: #f5f5f5;
        color: #C0C8D3;
        width: 1.8rem;
        height: 1.8rem;
        text-align: center;
        line-height: 1.8rem;
        border-radius: 50%;
        font-size: 1.3rem;
        margin-right: 0.8rem;
    }
    &>p{
        color: #9099A8;
        text-align: right;
        padding-left: 0.5rem;
        width: 10%;
    }
}

</style>