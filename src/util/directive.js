import Vue from 'vue';

//全局绑定animate.css动画
Vue.directive('animation', {
	bind: function (el, binding, vnode) {
		const {value} = binding;
		el.addEventListener('mouseenter', function ($ev) {
			$ev.preventDefault();
			$ev.stopPropagation();
			this.classList.add(value);
		});
		el.addEventListener('mouseleave', function ($ev) {
			$ev.preventDefault();
			$ev.stopPropagation();
			this.classList.remove(value);
		});
	},
	inserted: function (el) {
		el.classList.add('animated');
	},
});
