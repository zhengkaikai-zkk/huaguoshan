<template>
    <div id="address_edit">
        <pageHeader :title="title"/>
        <div class="skip" @click="$router.push('/address')" v-if="form.id">取消</div>
        <div class="card">
            <span>收货人</span>
            <input type="text" v-model="form.receiveName" placeholder="请输入收货人姓名">
        </div>
        <div class="card">
            <span>手机号码</span>
            <input type="text" v-model="form.receivePhone" placeholder="请输入手机号码">
        </div>
        <div class="card" @click="show_address = true">
            <span>所在地区</span>
            <input type="text" v-model="form.region" readonly placeholder="点击选择收货人所在地区">
        </div>
        <div class="card">
            <span>详细地址</span>
            <input type="text" v-model="form.details" placeholder="如道路、门牌号、小区等">
        </div>
        <div class="card d_between">
            <span>设为默认地址</span>
            <van-switch v-model="form.isDefault" size="1.8rem" active-color="#07c160"/>
        </div>
        <div class="btn">
            <button @click="addOrUpdate">保存</button>
            <button v-if="form.id" @click="remove">删除地址</button>
        </div>

        <!-- 弹框 -->
        <van-action-sheet v-model="show_address">
			<van-area :area-list="area" value="110101" @confirm="selectAddress" @cancel="show_address=false"/>
		</van-action-sheet>
    </div>
</template>

<script>
import area from '@/assets/js/area.js'

export default {
    data(){
        return{
            area,
            show_address: false,
            form: {
                id: '',
                receiveName: '',
                receivePhone: '',
                region: '',
                details: '',
                isDefault: true
            },
            province: '',
            city: '',
            county: '',
            title: '',
            backType: 0,

        }
    },

    mounted(){
        this.form.id=this.$route.query.id;
        this.backType=this.$route.query.type;
        if(this.form.id){
            this.title='编辑收货地址'
            this.getDetail();
        }
    },

    methods:{
        addOrUpdate(){
            if(!this.form.receiveName){
                this.$toast.fail('收货人不能为空');
                return; 
            }
            if(!this.form.receivePhone){
                this.$toast.fail('手机号不能为空');
                return; 
            }
            if(!this.$common.isPhone(this.form.receivePhone)){
                this.$toast.fail('手机号格式不正确');
                return; 
            }
            if(!this.form.region){
                this.$toast.fail('所在地区不能为空');
                return; 
            }
            if(!this.form.details){
                this.$toast.fail('所在地区不能为空');
                return; 
            }
            this.form.isDefault=this.form.isDefault? 1:0;
            const loading = this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });
            this.$request.post({
                url: '/us/address/addOrUpdate',
                params: this.form,
                success: res => {
                    this.$toast.success('修改成功');
                	sessionStorage.removeItem('usInfo');
                	this.$router.replace('/address');
				},
				finally: () => {
                    loading.clear();
                    this.form.isDefault=this.form.isDefault? true:false;
                }
            })
        },

        remove(){
            this.$dialog.confirm({
                title: '提示',
                message: '确定要删除该地址吗？'
                }).then(() => {
                    this.$request.post({
                        url: '/us/address/delete',
                        params: {
                            id: this.form.id,
                        },
                        success: res => {
                            this.$toast.success('删除成功');
                            sessionStorage.removeItem('usInfo');
                	        this.$router.replace('/address');
                        },
                    });
                }).catch(() => {
                // on cancel
            });
        },

        getDetail(){
            this.$request.post({
                url: '/us/address/details',
                params: {
                    id: this.form.id,
                },
                success: res => {
                    this.form=res;
                    this.form.isDefault=res.isDefault==1;
                },
            });
        },

        //选择省市区
        selectAddress(val) {
            this.province = val[0].name;
            this.city = val[1].name;
            this.county = val[2].name;
            this.form.region = `${val[0].name}-${val[1].name}-${val[2].name}`
            this.show_address = false;
        },
    }
}
</script>

<style lang="scss">
/* @import '@/assets/css/public.scss';
#address_edit .van-picker__confirm{
    color: $color;
} */
</style>
<style lang="scss" scoped>
@import '@/assets/css/public.scss';
#address_edit{
    padding-top: 5.5rem;
    font-size: 1.4rem;
    color: #222;
}
.skip{
    position: fixed;
    right: 1rem;
    top: 1.4rem;
    z-index: 199;
    font-size: 1.4rem;
    letter-spacing: 0;
    color: #F57983;
}
.card{
    background: #fff;
    display: flex;
    align-items: center;
    padding: 1.1rem 1rem;
    color: #222;
    border-bottom: 1px solid #f5f5f5;
    span{
        width: 8rem;
    }
    input{
        border: none;
        width: 21.5rem;
    }
}
.d_between{
    justify-content: space-between;
}
.btn{
    text-align: center;
    margin-top: 2.5rem;
    padding: 0 5rem;
    button{
        color: #f57983;
        border: 1px solid #f57983;
        font-size: 1.6rem;
        width: 100%;
        height: 3.7rem;
        line-height: 3.55rem;
        border-radius: 3.8rem;
        letter-spacing: 0.5rem;
        margin-bottom: 1.9rem;
    } 
    button:first-child{
        background: $color;
        color: #fff;
        border: 1px solid $color;
    }       
}
</style>