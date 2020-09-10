
export default{

	// 提交更新状态
	setMenuList({commit}, menuList){
    sessionStorage.setItem('menu_list', menuList)
		commit('SETMENULIST', menuList)
	}

}
