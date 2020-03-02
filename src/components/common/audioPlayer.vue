<template>
    <div class="player-wrapper">
        <el-tooltip effect="light" :open-delay="1000" placement="right-start">
            <div slot="content">
                <p>当前有<span class="s-c">{{audioList.length}}</span>首歌,点击获取更多</p>
            </div>
            <el-button type="primary" size="mini" circle class="update-songs" plain v-animation="'rotateIn'"
                       @click="refreshSong($event,'rotateIn')">
                <i class="el-icon-refresh"></i>
            </el-button>
        </el-tooltip>
        <aplayer v-cloak fixed listFolded :audio="audioList||audio" :lrcType="0"
                 :customAudioType="customAudioType"
                 v-loading="loading" element-loading-text="努力获取中……"
                 element-loading-spinner="el-icon-loading" ref="aPlayer"/>
    </div>

</template>

<script>
    import Hls from 'hls.js';

    export default {
        name: "music-player",
        async created() {
            await this.$store.dispatch('songs/getSongList')
                .then(() => this.loading = false);
        },
        data() {
            return {
                loading: true,
                isListFolded: false,
                audio: {
                    name: '东西（Cover：林俊呈）',
                    artist: '纳豆',
                    url: 'https://cdn.moefe.org/music/mp3/thing.mp3',
                    cover: 'https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=300y300', // prettier-ignore
                    lrc: 'https://cdn.moefe.org/music/lrc/thing.lrc',
                },
                customAudioType: {
                    customHls(audioElement, audio, player) {
                        if (Hls.isSupported()) {
                            const hls = new Hls();
                            hls.loadSource(audio.url);
                            hls.attachMedia(audioElement);
                        } else if (
                            audioElement.canPlayType('application/x-mpegURL') ||
                            audioElement.canPlayType('application/vnd.apple.mpegURL')
                        ) {
                            audioElement.src = audio.url;
                        } else {
                            player.showNotice('Error: HLS is not supported.');
                        }
                    },
                },
            }
        },
        methods: {
            async refreshSong(e, effectName) {
                if (this.audioList.length >= this.allSong - 10) {
                    return this.$message.warning({
                        message: '已取得所有歌曲了！',
                        duration: 1000,
                        center: true,
                    })
                } else {
                    this.loading = true;
                    e.currentTarget.classList.toggle(effectName);
                    await this.$store.dispatch('songs/getSongDetail')
                        .then(() => this.loading = false);
                }

            }
        },
        computed: {
            audioList() {
                return this.$store.state.songs.audioList;
            },
            allSong() {
                return this.$store.getters['songs/songTotal'];
            }
        },
    }
</script>

<style lang="less" scoped>
    .player-wrapper {
        position: relative;
        left: 0;
        bottom: 0;
        z-index: 1;

        .update-songs {
            position: fixed;
            left: 0;
            bottom: calc(50% - 6px);
            z-index: 99;
            opacity: .9;
        }

        .a-player {
            z-index: 9;
        }

        [v-cloak] {
            display: none;
        }
    }
</style>
