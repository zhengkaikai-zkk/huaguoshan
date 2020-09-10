
export default{
	// 提交更新状态
	setLoading({commit}, loading){
		commit('SETLOADING', loading)
	},
	
	setLoadText({commit}, loadText){
		commit('SETLOADTEXT', loadText)
	},
	
	setUser({commit}){
		commit('SETUSER')
	},

	// setUnLinkCount({commit}, unLinkCount){
	// 	commit('SETUNLINKCOUNT', unLinkCount)
	// },
	
	// setNums({commit}){
	// 	commit('SETNUMS')
	// },
	
	// setRefershMenu({commit}, refershMenu){
	// 	commit('SETREFERSHMENU', refershMenu)
	// }
}


