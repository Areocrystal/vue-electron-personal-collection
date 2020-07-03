<template>
	<div>
		<div class="cropper-content">
			<!-- 剪裁框 -->
			<div class="cropper">
				<vueCropper
					ref="cropper"
					:img="option.img"
					:outputSize="option.size"
					:outputType="option.outputType"
					:info="true"
					:full="option.full"
					:canMove="option.canMove"
					:canMoveBox="option.canMoveBox"
					:original="option.original"
					:autoCrop="option.autoCrop"
					:autoCropWidth="option.autoCropWidth"
					:autoCropHeight="option.autoCropHeight"
					:fixedBox="option.fixedBox"
					@realTime="realTime"
					:fixed="option.fixed"
					:fixedNumber="fixedNumber"
				/>
			</div>
			<!-- 预览框 -->
			<div
				class="show-preview"
				:style="{
					width: '15%',
					height: '100%',
					overflow: 'hidden',
					margin: '0 10px',
					display: 'flex',
					'align-items': 'center',
				}"
			>
				<div :style="previews.div" class="preview">
					<img :src="previews.url" :style="previews.img" alt="" />
				</div>
			</div>
		</div>
		<div class="footer-btn">
			<!-- 缩放旋转按钮 -->
			<div class="scope-btn">
				<el-button circle type="primary" icon="el-icon-zoom-in" @click="changeScale(1)" />
				<el-button circle type="primary" icon="el-icon-zoom-out" @click="changeScale(-1)" />
				<el-button round type="primary" @click.prevent.stop="rotateLeft" size="mini"
					>逆时针旋转</el-button
				>
				<el-button round type="primary" @click.prevent.stop="rotateRight" size="mini"
					>顺时针旋转</el-button
				>
			</div>
			<!-- 确认上传按钮 -->
			<div class="upload-btn">
				<!-- <el-button type="primary" @click="uploadImg('blob')">上传</el-button> -->
				<el-button
					type="primary"
					icon="el-icon-success"
					:disabled="isDisabled"
					@click="uploadImg('base64')"
					size="mini"
				>
					确定
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import {VueCropper} from 'vue-cropper';

export default {
	name: 'pic-cropper',
	data() {
		return {
			previews: {}, // 预览数据
			option: {
				img: '', // 裁剪图片的地址  (默认：空)
				outputSize: 1, // 裁剪生成图片的质量  (默认:1)
				full: true, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
				outputType: 'png', // 裁剪生成图片的格式  (默认:jpg)
				canMove: true, // 上传图片是否可以移动  (默认:true)
				original: true, // 上传图片按照原始比例渲染  (默认:false)
				canMoveBox: true, // 截图框能否拖动  (默认:true)
				autoCrop: true, // 是否默认生成截图框  (默认:false)
				autoCropWidth: 600, // 默认生成截图框宽度  (默认:80%)
				autoCropHeight: 450, // 默认生成截图框高度  (默认:80%)
				fixedBox: false, // 固定截图框大小 不允许改变  (默认:false)
				fixed: true, // 是否开启截图框宽高固定比例  (默认:true)
				fixedNumber: [1.3, 1], // 截图框比例  (默认:[1:1])
				enlarge: 1,
			},
			isDisabled: false,
			downImg: '#',
		};
	},
	props: ['imgFile', 'fixedNumber'],
	created() {
		this.getBase64(this.imgFile);
	},
	methods: {
		// 转Base64
		async getBase64(img) {
			const reader = new FileReader();
			reader.addEventListener(
				'load',
				function () {
					this.option.img = reader.result;
				}.bind(this)
			);
			(await img) && reader.readAsDataURL(img);
		},
		changeScale(num) {
			// 图片缩放
			num = num || 1;
			this.$refs.cropper.changeScale(num);
		},
		rotateLeft() {
			// 向左旋转
			this.$refs.cropper.rotateLeft();
		},
		rotateRight() {
			// 向右旋转
			this.$refs.cropper.rotateRight();
		},
		Update() {
			// this.file = this.imgFile
			this.option.img = this.imgFile.url;
		},
		realTime(data) {
			// 实时预览
			this.previews = data;
		},
		uploadImg(type) {
			// 将剪裁好的图片回传给父组件
			this.isDisabled = true;
			let that = this;
			this.$refs.cropper[type === 'blob' ? 'getCropBlob' : 'getCropData']((data) =>
				that.$emit('upload', data)
			);
		},
	},
	watch: {
		imgFile() {
			this.getBase64(this.imgFile);
		},
	},
	components: {VueCropper},
};
</script>
<style lang="less">
.cropper-content {
	display: flex;
	display: -webkit-flex;
	justify-content: flex-end;
	align-items: center;
	-webkit-justify-content: flex-end;

	.cropper {
		width: 80%;
		height: 650px;
	}

	.show-preview {
		flex: 1;
		-webkit-flex: 1;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		-webkit-justify-content: center;
		overflow: hidden;
		border: 1px solid #cccccc;
		background: #cccccc;
		margin-left: 20px;

		.preview {
			overflow: hidden;
			border: 1px solid #cccccc;
			background: #cccccc;
		}
	}
}

.footer-btn {
	margin-top: 30px;
	display: flex;
	display: -webkit-flex;
	justify-content: flex-end;
	-webkit-justify-content: flex-end;

	.scope-btn {
		display: flex;
		display: -webkit-flex;
		justify-content: space-around;
		-webkit-justify-content: space-around;
	}

	.upload-btn {
		flex: 1;
		-webkit-flex: 1;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		-webkit-justify-content: center;
	}

	.btn {
		outline: none;
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		-webkit-appearance: none;
		text-align: center;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		outline: 0;
		margin: 0;
		-webkit-transition: 0.1s;
		transition: 0.1s;
		font-weight: 500;
		padding: 8px 15px;
		font-size: 12px;
		border-radius: 3px;
		color: #fff;
		background-color: #67c23a;
		border-color: #67c23a;
	}
}
</style>
