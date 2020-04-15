import Vue from 'vue';
import store from 'store/index';

export default new Vue({
	data() {
		return {};
	},
	methods: {
		errHandler(err) {
			this.$message.error({
				message: JSON.stringify(err),
				duration: 1500,
				center: true,
			});
		},
	},
	store,
});
