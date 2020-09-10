export default{
	
	myConfig: {
		URDITOR_HOME_URL: 'static/ueditor/',
		// 编辑器不自动被内容撑高
		autoHeightEnabled: false,
		// 初始容器高度
		initialFrameHeight: 400,
		// 初始容器宽度
		initialFrameWidth: '140%',
		// 自动保存时间
		saveInterval: 2000,
		pasteplain: false,
		// 设置允许最大字数
		maximumWords: 1000000,
		tableDragable: true,
		topOffset: false,
		zIndex: 1000,
		serverUrl: '/api/jsp/controller.jsp',
		autoFloatEnabled: false,
		// serverUrl: 'http:192.168.0.135:8081/jsp/controller.jsp',
		// UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
		UEDITOR_HOME_URL: '/static/UEditor/',
		imageUrl: "http://192.168.0.150:8090/base_shop_project/jsp/controller.jsp?action=config",
		
		toolbars: [
			[
				'undo', 'redo', 'formatmatch', 'removeformat', 'cleardoc', '|', 'spechars', 'justifyleft',
				'justifycenter', 'justifyright',
				'justifyjustify', 'insertorderedlist', 'insertunorderedlist', 'fullscreen', 'rowspacingtop', 'rowspacingbottom',
				'lineheight', 'imagecenter',
				'|', 'inserttable', 'deletetable', 'insertrow', 'insertcol', 'deleterow', 'deletecol', 'mergecells',
				'splittocells', 'edittd', 'edittable',
			],
			[
				'simpleupload', 'insertimage', 'wordimage', 'bold', 'italic', 'underline', 'strikethrough', 'fontborder', 'horizontal', 'subscript', 'superscript',
				'inserttitle',
				'forecolor', 'backcolor', 'fontfamily', 'fontsize', 'paragraph',
			]
		],
	},
}
