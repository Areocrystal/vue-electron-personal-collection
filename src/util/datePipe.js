import Vue from 'vue';
import {
	format,
	differenceInDays,
	differenceInWeeks,
	addYears,
	subYears,
	addMonths,
	subMonths,
	addDays,
	subDays,
	getYear,
	getMonth,
} from 'date-fns';

//自定义过滤器
Vue.filter('date-format', function (value, formatStr = 'yyyy-MM-dd') {
	return format(value, formatStr);
});

Vue.filter('gap-day-format', function (start, end, formatStr = 'yyyy-MM-dd') {
	if (start > end) {
		[start, end] = [end, start];
	}
	return format(end, formatStr) !== format(start, formatStr)
		? `${differenceInDays(end, start)}天`
		: '相同日期';
});

Vue.filter('gap-week-format', function (start, end) {
	if (start > end) {
		[start, end] = [end, start];
	}
	const weeks = differenceInWeeks(end, start),
		days = differenceInDays(end, start) - 7 * weeks;
	return weeks ? (days ? `${weeks}周, ${days}天` : `${weeks}周`) : '';
});

Vue.filter('operation-format', function (value, operation, y, m, d, formatStr = 'yyyy-MM-dd') {
	if (operation === '+') {
		return format(addDays(addMonths(addYears(value, y), m), d), formatStr);
	}
	if (operation === '-') {
		return format(subDays(subMonths(subYears(value, y), m), d), formatStr);
	}
});

Vue.filter('ancient-format', function (value) {
	const dateVal = new Date(value);
	const landList = '子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥'.split('、'),
		skyLandList = [
			'甲子',
			'乙丑',
			'丙寅',
			'丁卯',
			'戊辰',
			'己巳',
			'庚午',
			'辛未',
			'壬申',
			'癸酉',
			'甲戌',
			'乙亥',
			'丙子',
			'丁丑',
			'戊寅',
			'己卯',
			'庚辰',
			'辛巳',
			'壬午',
			'癸未',
			'甲申',
			'乙酉',
			'丙戌',
			'丁亥',
			'戊子',
			'己丑',
			'庚寅',
			'辛卯',
			'壬辰',
			'癸巳',
			'甲午',
			'乙未',
			'丙申',
			'丁酉',
			'戊戌',
			'己亥',
			'庚子',
			'辛丑',
			'壬寅',
			'癸卯',
			'甲辰',
			'乙巳',
			'丙午',
			'丁未',
			'戊申',
			'己酉',
			'庚戌',
			'辛亥',
			'壬子',
			'癸丑',
			'甲寅',
			'乙卯',
			'丙辰',
			'丁巳',
			'戊午',
			'己未',
			'庚申',
			'辛酉',
			'壬戌',
			'癸亥',
		];
	return `${
		skyLandList[(getYear(dateVal) - 4) % skyLandList.length]
	}年${landList[getMonth(dateVal)]}月`;
});

// 双指针法计算所有天干地支
// const skyLand = () => {
//     const skyList = '甲、乙、丙、丁、戊、己、庚、辛、壬、癸'.split('、'),
//         landList = '子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥'.split('、');
//     const skyLandList = [];
//     let i = 0, j = 0;
//     while (1) {
//         if (i === skyList.length) {
//             i = 0;
//         }
//         if (j === landList.length) {
//             j = 0;
//         }
//         let tmp = skyList[i++] + landList[j++];
//         if (skyLandList.includes(tmp)) {
//             return skyLandList;
//         }
//         skyLandList.push(tmp)
//     }
// };
