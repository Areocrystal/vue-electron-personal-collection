onmessage = (e) => {
	const {numTotal, numRow, size} = e.data,
		tableData = [],
		l = (numTotal / numRow) | 0,
		remainArr = [];
	let remains = numTotal % numRow;
	tableData.length = l;
	for (let i = 0; i < l; i++) {
		tableData[i] = [];
		for (let j = 0; j < numRow; j++) {
			tableData[i][j] = {
				val: i * numRow + j + 1,
				type: '',
				size,
			};
		}
	}
	if (remains > 0) {
		while (remains) {
			remainArr.unshift({
				val: numRow * l + remains--,
				type: '',
				size,
			});
		}
		tableData.push(remainArr);
	}
	postMessage(JSON.stringify(tableData));
};
