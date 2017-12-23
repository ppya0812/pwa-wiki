if ('serviceWorker' in navigator) {
  // register service worker
  console.log('register service worker')
  // 如果你不需要离线功能，可以简单的创建一个空的 /service-worker.js文件 —— 用户会被提示安装你的 app。
  navigator.serviceWorker.register('./service-worker.js')
}

/*
* 在main.js中我们可以使用 Cache API 。然而API 使用promises，在不支持的浏览器中会引起所有javascript运行阻塞。
* 为了避免这种情况，我们在加载另一个 /js/offlinepage.js 文件之前必须检查离线文件列表和是否支持 Cache API 。
*/

// load script to populate offline page list
if (document.getElementById('cachedpagelist') && 'caches' in window) {
  var scr = document.createElement('script')
  scr.src = './offlinepage.js'
  scr.async = 1
  document.head.appendChild(scr)
}
