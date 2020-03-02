import service from "@/api/index";
import eventBus from "util/eventBus";

const state = {
  ind: 0,
  songNum: 10, //异步取10首歌
  defaultCover: '', //图片老挂掉,使用默认图片
  songHashList: [],
  audioList: [],
};

const getters = {
  songTotal: state => state.songHashList.length,
  songUrlList: state => state.audioList.map(v => v.cover),
};

const mutations = {
  ADD_IND(state, val) {
    state.ind = val;
    if (state.ind >= state.songHashList.length - 1) {
      state.ind = 0
    }
  },
  SET_SONG_HASH(state, payload) {
    const {songHashList} = payload;
    //乱序
    for (let j, x, i = songHashList.length; i;
         x = songHashList[--i], songHashList[i] = songHashList[j], songHashList[j] = x) {
      j = parseInt(Math.random() * i)
    }
    state.songHashList = songHashList;
  },
  SET_AUDIO(state, payload) {
    const {choricSinger, imgUrl, extName, songName, url, albumid, fileName} = payload, {audioList} = state;
    !audioList.map(v => v.id).some(v => v === albumid) &&
    audioList.push({
      'name': songName,
      'artist': choricSinger,
      url,
      'theme': imgUrl,
      'cover': state.defaultCover,
      'type': extName,
      'id': albumid,
    });
    state.audioList = audioList;
  },
  //酷狗的图片都挂了，换成别的
  REPLACE_IMG(state) {
    state.audioList.forEach(v => v['cover'] = state.defaultCover);
  },
  SET_DEFAULT_IMG(state, binary) {
    state.defaultCover = `data:image/png;base64,${btoa(new Uint8Array(binary).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
    global.localStorage.setItem('music_pic', state.defaultCover);
  },
};

const actions = {
  async getSongList({commit, dispatch, state}) {
    const response = await service.getSongs()
        .catch(err => eventBus.errHandler(err)),
      songHeap = [];
    if (response && response.ver) {
      let songRaw = response.plist.list.info;
      songRaw.forEach(v => Array.isArray(v.songs) && songHeap.push(...v.songs));
      let songHashList = songHeap.map(v => v.hash);
      commit({type: 'SET_SONG_HASH', songHashList});
      dispatch('getSongDetail');
      let musicPicData = global.localStorage.getItem('music_pic');
      if (musicPicData === null) {
        dispatch('getLocalImg');
      } else {
        state.defaultCover = musicPicData;
      }
    }
  },
  async getSongDetail({commit, state}) {
    const {songNum} = state,
      end = state.ind + (state.songHashList.length - state.ind < songNum ? state.songHashList.length - state.ind : songNum);
    //一个hash值只能请求一首歌
    const responseList = await Promise.all(
      state.songHashList.slice(state.ind, end)
        .map(hash => service.getSongInfo({hash}).catch(err => eventBus.errHandler(err))));
    commit('ADD_IND', end);
    responseList.forEach(response => {
      if (response && response.fileSize && response.url) {
        let {fileSize, choricSinger, imgUrl, extName, songName, url, albumid, fileName} = response;
        imgUrl = imgUrl.replace(/\{size\}/gi, fileSize);
        commit('SET_AUDIO', {choricSinger, imgUrl, extName, songName, url, albumid, fileName});
      }
    });
    commit('REPLACE_IMG');
  },
  //很大机率失败
  // async testPicture({commit, dispatch, getters}) {
  //     const {songUrlList} = getters,
  //         picResponseList = await Promise.all(songUrlList.map(url => service.getPicture(url)));
  //     if (picResponseList.length === songUrlList.length) {
  //         commit({type: 'REPLACE_IMG', picResponseList});
  //     }
  // },
  async getLocalImg({commit}) {
    const imgData = await service.getMusicPic().catch(err => eventBus.errHandler(err));
    commit('SET_DEFAULT_IMG', imgData);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
