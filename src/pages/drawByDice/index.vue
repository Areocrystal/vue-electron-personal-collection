<template>
    <div slot="dice" class="dice-wrapper">
        <el-alert class="dice-title" type="info"
                  center :closable="false" show-icon>
            <div slot="title">
                <h2 class="s-c">
                    <font-awesome-icon icon="quote-left"/>&nbsp;
                    <span>骰子作图</span>
                    &nbsp;<font-awesome-icon icon="quote-right"/>
                </h2>
            </div>
        </el-alert>
        <el-form :model="ruleForm" :rules="rules"
                 label-position="left"
                 ref="ruleForm" label-width="15%" class="ruleForm">
            <el-form-item label="基本单元大小" prop="range" class="custom-item bs">
                <el-tooltip class="item" effect="light" :open-delay="2200" placement="bottom">
                    <el-slider v-model="ruleForm.range" :min="1" :max="33" :marks="marks" show-input></el-slider>
                    <div slot="content">
                        <h3 style="text-align: center;color:#E6A23C;">注意：设置基本单元大小</h3>
                        <p>这个设置的越小，图像就渲染的越清晰同时渲染速度也越慢(页面卡顿)</p>
                    </div>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="基本单元类型" prop="type" class="custom-item bs">
                <el-select v-model="ruleForm.type" style="width:100px;" placeholder="请选择单元类型">
                    <el-option label="圆点" value="dot"></el-option>
                    <el-option label="方块" value="diamond"></el-option>
                    <el-option label="字符" value="character"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="像素渲染颜色" prop="unitColor" class="custom-item bs">
                <el-color-picker v-model="ruleForm.unitColor" size="mini"></el-color-picker>
            </el-form-item>
            <el-form-item label="背景渲染颜色" prop="bgColor" class="custom-item bs">
                <el-color-picker v-model="ruleForm.bgColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="是否裁剪" prop="isCrop" class="custom-item bs">
                <el-tooltip class="item" effect="light" content="此项不激活会按照原图尺寸生成"
                            placement="right-start" :open-delay="500">
                    <el-switch v-model="ruleForm.isCrop"></el-switch>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="图片上传" class="custom-item bs spec-br">
                <el-tooltip class="item" effect="light" :open-delay="1500" placement="bottom"
                            content="上传仅支持jpg、png、bmp或ico格式的图片，大小不要超过5M！">
                    <el-upload action="#"
                               list-type="picture-card"
                               :file-list="rawFileList"
                               :on-change="beforePictureChange"
                               :auto-upload="false">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" ref="thumbnail"
                                 :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview"
                                  @click="handlePictureCardPreview(file)">
                              <i class="el-icon-zoom-in"></i>
                            </span>
                                <!--上传的原图就没必要再下载了-->
                            <span v-if="downloadRaw" class="el-upload-list__item-delete"
                                  @click="download(cropperThumbnailSrc, fileNames[fileNames.length - 1])">
                                <i class="el-icon-download"></i>
                            </span>
                            <span class="el-upload-list__item-delete"
                                  @click="rawFileList = []">
                              <i class="el-icon-delete"></i>
                            </span>
                        </span>
                        </div>
                    </el-upload>
                </el-tooltip>
                <el-dialog :visible.sync="dialogVisible" width="60%" center>
                    <img style="width:100%;" :src="dialogImageUrl" alt=""/>
                    <div slot="title">
                        <span class="s-c" style="font-size:24px;">缩略图放大</span>
                    </div>
                </el-dialog>
                <el-dialog v-if="ruleForm.isCrop"
                           :fullscreen="true" :destroy-on-close="true"
                           :visible.sync="cropperModal" :before-close="closeCropper">
                    <picCropper ref="vueCropper"
                                :img-file="rawFileList[0]&&rawFileList[0].raw"
                                :fixedNumber="fixedNumber"
                                @upload="upload"></picCropper>
                </el-dialog>
            </el-form-item>
            <el-form-item class="custom-item">
                <el-button type="primary" @click="createPic('ruleForm')">
                    <font-awesome-icon icon="braille"/>&nbsp;立即创建
                </el-button>
                <el-button v-if="showDownload" type="primary" @click="downloadProd">
                    <font-awesome-icon icon="download"/>&nbsp;下载
                </el-button>
            </el-form-item>
            <el-form-item label="所生成图片" class="custom-item"></el-form-item>
        </el-form>
        <generate-picture ref="prodChild"
                          :files="rawFileList"
                          :unitColor="ruleForm.unitColor"
                          :bgColor="ruleForm.bgColor"
                          :range="ruleForm.range"
                          :type="ruleForm.type" @hasProdImg="toggleDownload"></generate-picture>
    </div>
</template>

<script>
    import picCropper from "pages/drawByDice/picCropper";
    import generatePicture from "pages/drawByDice/generatePicture";

    export default {
        name: 'dicePicture',
        components: {
            picCropper, generatePicture,
        },
        props: {
            fixedNumber: {
                // 剪裁框比例设置
                default: function () {
                    return [1.2, 1];
                }
            },
            width: {
                // 单图剪裁框宽度
                type: Number,
                default: 200
            },
            height: {
                // 单图剪裁框高度
                type: Number,
                default: 200
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => (vm.$store.commit('EDIT_METANAME', to.meta), vm.$store.commit('EDIT_MENUINDEX', '2-1')))
        },
        data() {
            return {
                //上传图片参数
                rawFileList: [],
                fileList: [], //回调获取
                dialogImageUrl: '',
                dialogVisible: false,
                cropperModal: false, // 剪裁组件弹窗开关
                cropperThumbnailSrc: '',
                ruleForm: {
                    unitColor: '#fff',
                    bgColor: '#000',
                    range: 15,
                    type: 'dot',
                    isCrop: false,
                },
                rules: {
                    range: [{required: false}],
                    type: [{required: false, trigger: 'change'}],
                },
                fileNames: [],
                showDownload: false,
                downloadUrl: '',
                isReverse: false, //不上传新文件只生成的话不需要交换fileNames中的值
                downloadRaw: false, //控制是否可以下载裁剪过后的原始图片
                marks: {1: '', 2: '', 3: '', 4: '', 5: '', 6: '',},
            };
        },
        methods: {
            closeCropper(done) {
                const {fileList} = this;
                this.rawFileList = fileList.length > 1 ? [fileList.shift()] : [];
                done();
            },
            toggleDownload($ev) {
                [this.showDownload, this.downloadUrl] = $ev;
            },
            validateUplFile(rawFile) {
                const {type, size} = rawFile,
                    isValidPic = type === 'image/jpeg' || type === 'image/png' || type === 'image/bmp' || type === 'image/x-icon';
                const isLt5M = size / 1024 / 1024 < 5;
                if (!isValidPic) {
                    this.$message.error({
                        message: '上传的只能是图片，且仅支持 jpg、png、bmp、ico格式!',
                        duration: 1500,
                        center: true,
                    });
                    return false;
                }
                if (!isLt5M) {
                    this.$message.error({
                        message: '上传的图片大小不能超过5MB!',
                        duration: 1500,
                        center: true,
                    });
                    return false;
                }
                return true;
            },
            beforePictureChange(fileDetail, fileList) {
                this.fileNames.push(fileDetail.name);
                this.fileNames.length > 2 && this.fileNames.shift();
                this.fileList = fileList.slice();
                this.isReverse = true;
                const len = fileList.length, {isCrop} = this.ruleForm;
                if (this.validateUplFile(fileDetail.raw)) {
                    if (!isCrop) {
                        this.cropperThumbnailSrc = fileDetail.url;
                        this.$refs.prodChild.setImgSource(fileDetail.url);
                    }
                    this.rawFileList = len > 1 ? [fileList.pop()] : fileList;
                    this.cropperModal = isCrop;
                    this.downloadRaw = false;
                } else {
                    this.rawFileList = len > 1 ? [fileList.shift()] : [];
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = this.cropperThumbnailSrc || file.url;
                this.dialogVisible = true;
            },
            upload(data) {
                this.$refs.thumbnail.src = this.cropperThumbnailSrc = data;
                this.$refs.prodChild.setImgSource(data);
                this.cropperModal = false;
                this.downloadRaw = true;
            },
            dataURLtoBlob(dataUrl) {
                let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type: mime});
            },
            // 压缩图片
            compress(img) {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;
                canvas.width = width;
                canvas.height = height;
                // 铺底色
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);
                // 进行压缩
                return canvas.toDataURL('image/jpeg', .8);
            },
            createPic(formName) {
                this.$refs[formName].validate(this.$refs.prodChild.getImgSegments);
                this.isReverse && this.fileNames.reverse();
                this.isReverse = false;
            },
            downloadProd() {
                const {downloadUrl, download, fileNames, $message} = this;
                if (downloadUrl) {
                    download(downloadUrl, fileNames[0]);
                } else {
                    $message({
                        showClose: true,
                        message: '生成图片出错!',
                        type: 'error',
                        duration: 1000,
                    });
                }
            },
            //提供下载功能
            download(base64url, name) {
                const link = document.createElement('a'), {dataURLtoBlob} = this;
                link.style.display = 'none';
                link.setAttribute('href', global.URL.createObjectURL(dataURLtoBlob(base64url)));
                link.setAttribute('download', name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
</script>
<style lang="less">
    @import '~@/assets/css/index';

    .dice-wrapper {


        .ruleForm {
            .custom-item {
                position: relative;
                .el-form-item__label {
                    color: #909399;
                    font-size: 18px;
                }

                .el-color-picker, .el-upload-list--picture-card .el-upload-list__item, .el-upload--picture-card {
                    vertical-align: middle;
                }

                .el-form-item__content {
                    margin-right: 15%;
                }
            }

            .bs {
                .shadow-br();
                border-radius: 10px;
                padding: 0 12px;
            }

            .spec-br {
                border-radius: 12px 50% 12px 50%;
            }
        }

        .dice-title {
            margin-bottom: 20px;
            border-left: 8px solid #409eff;
            border-right: 8px solid #409eff;
        }

        .el-alert--info.is-light {
            .shadow-br();
            background-color: transparent;
        }

    }
</style>