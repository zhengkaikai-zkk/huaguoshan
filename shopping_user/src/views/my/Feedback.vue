<template>
    <div id="feedback">
        <pageHeader/>
        <div class="skip" @click="$router.push('/feedback_list')">反馈列表</div>
        <div class="fill">
            <div>
                <textarea v-model="content" placeholder="请输入你的反馈内容（200字以内）" maxlength="200"></textarea>
                <span class="count">{{content.length}}/200</span>
            </div>
        </div>
        <div class="btn">
            <van-button round type="info" color="#C1164B" @click="submit" block>提交</van-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            content: '',
        }
    },

    methods:{
        submit(){
            if(!this.content){
                this.$toast.fail('请填写你所要反馈的内容哦');
                return; 
            }
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/sysAdvice/feedback',
                params: {
                    content: this.content
                },
                success: res => {
                    this.$toast.success('提交成功');
                    this.$router.push('/feedback_list')
				},
				finally: () => {
                    loading.clear();
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
#feedback{
    padding-top: 4.6rem;
    font-size: 1.4rem;
    color: #222;
}
.skip{
    position: fixed;
    right: 1rem;
    top: 1.8rem;
    z-index: 199;
    font-size: 1.14rem;
}
.fill{
    background: #fff;
    margin-top: 0.9rem;
    padding: 1rem 1rem 0.5rem 1rem;
    &>div{
        position: relative;
        height: 8rem;
        padding-bottom: 1.5rem;
        textarea{
            border:none;
            resize: none;
            width: 100%;
            height: 100%;
            font-size: 1.4rem;
        }
        .count{
            position: absolute;
            bottom: 0;
            right: 0;
            color: #c0c8d3;
            letter-spacing: 0;
        }
    }
}
.btn{
    text-align: center;
    margin-top: 2.5rem;
    padding: 0 5rem;
    button{
        font-size: 1.6rem;
        height: 3.8rem;
        line-height: 3.8rem;
        border-radius: 3.8rem;
    }        
}
</style>