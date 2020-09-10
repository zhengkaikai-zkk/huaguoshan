<template>
    <div id="invite">
        <pageHeader/>
        <div class="lump" style="margin-top: 21.2rem;">
            <p>邀请规则</p>
            <div class="rule" v-for="(item,index) in explain">
                <div><span>{{index+1}}</span></div>
                <div>{{item}}</div>
            </div>
        </div>
        <div class="d_invite">
            <p>邀请方式</p>
            <div>请将您的专属邀请码复制给您的好友: </div>
            <div class="code">{{inviteCode}}</div>
            <button class="big_btn" @click="$common.copy(inviteCode)">点击复制</button>
            <!-- <img src="@/assets/img/my/invite-btn.png" alt="点击复制" @click="$common.copy(inviteCode)"> -->
        </div>
        <div class="d_list">
            <p>邀请列表</p>
            <div class="table">
                <div class="tr" style="color: #9099A8;">
                    <span>用户</span>
                    <span style="font-size: 1.33rem">注册时间</span>
                </div>
                <div class="tr" v-for="item in list">
                    <span>{{item.usInfo.nick}}</span>
                    <span>{{$common.getDate(item.createTime)}}</span>
                </div>
                <div v-if="list.length==0" class="no_data">暂无邀请记录</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            inviteCode: '',
            explain: [],
            list: [],

        }
    },

    methods: {
        //获取银行卡列表
        getList(){
            this.$request.post({
                url: '/us/invite/list',
                params: {
                    pageNo: 1,
                    pageSize: 100
                },
                success: res => {
                    this.inviteCode=res.inviteCode
                    this.explain=res.levelExplain.split('#')
                    this.list=res.list;
                },
            });
        },


    },

    mounted(){
        this.$store.dispatch('all/setUser');
        this.getList();
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#invite{
    position: relative;
    font-size: 1.33rem;
    color: #9099A8;
    min-height: 100vh;
    background: url('../../assets/img/my/invite-bg.png') no-repeat;
    background-size: 100% auto;
    background-color: #F54B40;
    background-position: 0 4rem;
    overflow: hidden;
    color: #222;
    .lump{
        background: #fff;
        margin: 0 1rem;
        border-radius: 0.9rem;
        padding: 0.3rem 1rem;
        &>p{
            color: $color;
            text-align: center;
            padding-top: 0.8rem;
            padding-bottom: 1rem;
            font-size: 1.52rem;
            font-weight: bold;
        }
        .rule{
            display: flex;
            align-items: flex-start;
            padding-bottom: 1.1rem;
            span{
                background: $color;
                color: #fff;
                border-radius: 1rem;
                height: 1.5rem;
                width: 1.5rem;
                text-align: center;
                line-height: 1.5rem;
                display: inline-block;
                margin-right: 0.7rem;
            }            

        }
    }
    .d_invite{
        background: #fff;
        margin: 0 1rem;
        border-radius: 0.9rem;
        padding: 0.3rem 4.5rem;
        padding-bottom: 1.4rem;
        margin-top: 1.4rem;
        margin-bottom: 1.4rem;
        text-align: center;
        &>p{
            color: $color;
            padding-top: 0.7rem;
            padding-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: bold;
        }
        img{
            width: 100%;
        }
        .code{
            color: #F05447;
            letter-spacing: 0;
            font-weight: bold;
            margin-top: 0.7rem;
            margin-bottom: 1rem;
            font-size: 1.52rem;
        }
    }
    .d_list{
        background: #fff;
        margin: 0 1rem;
        border-radius: 0.9rem;
        padding-bottom: 1.4rem;
        margin-top: 1.4rem;
        margin-bottom: 1.4rem;
        text-align: center;
        &>p{
            color: $color;
            padding-top: 1rem;
            padding-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: bold;
        }
        .table{
            border-top: 1px solid #C0C8D3;
            letter-spacing: 0;
            padding-bottom: 1.5rem;
            .tr{
                display: flex;
                align-items: center;
                border-bottom: 1px solid #f5f5f5;
                padding: 1rem 0;
                :first-child{
                    width: 40%;
                }
                :last-child{
                    width: 60%;
                    font-size: 1.14rem;
                }
            }

        }
    }
    .no_data{
        color: #999;
        margin-top: 1rem;
        font-size: 1.2rem;
    }
}
.big_btn{
    background: $color;
    color: #fff;
    font-size: 1.71rem;
    border-radius: 3rem;
    height: 3.6rem;
    width: 100%;
}
.big_btn:active{
    opacity: .8;
}
</style>