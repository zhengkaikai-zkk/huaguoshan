<template>
	<div id="census">
    <!-- 日期选择 -->
    <div class="graphic">
      <el-row class="manage">
        <el-col style="text-align: right; margin: 10px 0;">
          <el-select size="mini" v-model="date3" placeholder="请选择" @change="getDate" :disabled="load">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
            :disabled="load"
            v-model="deftime"
            :type="date3"
            :picker-options="pickerOptions"
            :format="textList[date3]"
            placeholder="选择周"
            size="mini"
            @change="getDate"
            :clearable="false"
          ></el-date-picker>
        </el-col>
      </el-row>
      <div id="vallage" class="echart" v-loading="load"></div>
    </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
        value1: "",
        options: [
          {
            label: "周视图",
            value: "week"
          },
          {
            label: "月视图",
            value: "month"
          },
          {
            label: "年视图",
            value: "year"
          }
        ],
        textList: {
          week: "yyyy 年第 WW 周(MM月)",
          month: "yyyy 年 - MM月",
          year: "yyyy 年"
        },
        date3: "week",
        deftime: new Date(),
        year: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        month: [
          // 每个月的天数均不相同, 所以这里为动态
        ],
        week: ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
        list: [],
        load: false,
        pickerOptions: {
          shortcuts: [{
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },{
            text: '上周',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }],
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },

        nears: {
          orderNum1: null,
          orderNum7: null,
          orderNum30: null,
          all: null,
        }
			};
		},

    created() {
      // this.getData();
      // this.getOrderNum();
    },

		watch: {
			date3(val){
				this.pickerOptions.shortcuts.splice(0)
				switch (val){
					case 'week':
						this.pickerOptions.shortcuts.push({
							text: '本周',
							onClick(picker) {
								picker.$emit('pick', new Date());
							}
						},{
							text: '上周',
							onClick(picker) {
								const date = new Date();
								date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit('pick', date);
							}
						})
						break;
					case 'month':
						this.pickerOptions.shortcuts.push({
							text: '本月',
							onClick(picker) {
								picker.$emit('pick', new Date());
							}
						},{
							text: '上月',
							onClick(picker) {
								var month = new Date().getMonth();
								var year = new Date().getFullYear()
								var date =( (month == 0) ? ( (year-1)+"-12-01 00:00") : ( year +"-"+ month +'-01 00:00' )) ;
								picker.$emit('pick', new Date(date));
							}
						})
						break;
					case 'year':
						this.pickerOptions.shortcuts.push({
							text: '本年',
							onClick(picker) {
								picker.$emit('pick', new Date());
							}
						},{
							text: '上年',
							onClick(picker) {
								picker.$emit('pick', new Date( (new Date().getFullYear()-1)+'-01-01 00:00'));
							}
						})
						break;
					default:
						break;
				}
			}
		},

    mounted() {
      this.getDate()
    },

    methods: {
      getDate(){
        var selectDate = this.$moment(this.deftime).format('YYYY-MM-DD')
        var dateStrs = [];
        switch(this.date3){
          case 'week':
            // 获取本日在当前周的第几日
            var thisWeekDay = this.$moment().format('E')
            if(thisWeekDay == 7){
              thisWeekDay = 0
            }
            if(thisWeekDay == 0){
              var weeks = ['星期日']
              dateStrs = weeks
            }else{
              // 获取本周的第一天
              var dateByWeek = this.$moment().subtract(thisWeekDay, 'days');
              // 检查选择的日期是否在两个时间内
              if(this.$moment(selectDate).isBetween(dateByWeek, new Date())){
                // 返回周一到当前今天的时间
                var weeks = []
                for(var i = 0; i <= thisWeekDay; i++){
                    weeks.push('星期'+this.getChnNumChar(i))
                }
                dateStrs = weeks
              }else{
                dateStrs = this.week
              }
            }
            break;
          case 'month':
            var thisMonth = new Date().getMonth()
            var selectMonth = new Date(selectDate);
            if(thisMonth == selectMonth.getMonth()){
              // 如果是本月
              this.month.splice(0)
              for(var i = 0; i < new Date().getDate(); i++){
                this.month.push(i+1+'号')
              }
            }else{
              this.getMonth(selectDate)
            }
            dateStrs = this.month
            break;
          case 'year':
            var thisYear = new Date().getFullYear();
            var selectYear = new Date(selectDate);
            if(thisYear == selectYear.getFullYear()){
              // 如果是本年
              dateStrs.splice(0)
              for(var i = 0; i < new Date().getMonth()+1;i++){
                dateStrs.push(i+1+'月')
              }
            }else{
              dateStrs = this.year
            }
            break;
        }
        this.$emit('changeDate', {type: this.date3, selectDate, dateStrs})
      },

      // 动态设置指定月份的天数
      getMonth(date){
      	let d = new Date(date)
      	// 将日期设置为下月一号
      	d.setMonth(d.getMonth()+1)
      	d.setDate('1')
      	// 获取本月最后一天
      	d.setDate(d.getDate()-1)
      	this.month.splice(0)
      	for(var i = 1; i <= d.getDate(); i++){
      		this.month.push(i+"号")
      	}
      },

      getChnNumChar(num){
        return ['日', '一', '二', '三', '四', '五', '六'][num]
      },
      
    }
	}
</script>

<style>

</style>

<style scoped>

</style>
