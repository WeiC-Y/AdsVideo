import MuskOx from 'musk-ox'

// 加载回调
function assetOnLoad(asset) {
  console.log(asset, "is Loaded");
}
// 失败回调
function assetError(asset, err) {
  console.log(`${asset} loaded is error! ERROR INFO: ${err}`);
}
// 加载进度变化回调
const onProgressResponse = (percent) => {
  console.log(`assets is loading at ${percent}`); // Percent is the current loading percentage.
};
// 创建ox实例对象
var ox = new MuskOx()
// 加入回调函数
ox.onLoad.add(assetOnLoad)
ox.onError.add(assetError)
ox.onProgress.add(onProgressResponse)

export {ox}