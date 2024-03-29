// configuration
const version = '1.0.0'
const CACHE = version + '::PWAsite' // 缓存名称&版本号
const offlineURL = '/offline/' // 一个离线页面的url
const installFilesEssential = [ // 必要文件的数组
  '/',
  '/manifest.json',
  '/css/styles.css',
  '/js/main.js',
  '/js/offlinepage.js',
  '/images/logo/logo152.png'
].concat(offlineURL)
const installFilesDesirable = [ // 描述文件数组
  '/favicon.ico',
  '/images/logo/logo016.png',
  '/images/hero/power-pv.jpg',
  '/images/hero/power-lo.jpg',
  '/images/hero/power-hi.jpg'
]

// 1.  install static assets 添加文件到缓存,当必要的文件都被缓存后才会生成返回值。
function installStaticFiles () {
  return caches.open(CACHE)
    .then(cache => {
      // cache desirable files
      cache.addAll(installFilesDesirable)

      // cache essential files
      return cache.addAll(installFilesEssential)
    })
}

// application installation
self.addEventListener('install', event => {
  console.log('service worker: install')

  // cache core files
  event.waitUntil(
    installStaticFiles()
    .then(() => self.skipWaiting())
  )
})

// 2. Activate
// clear old caches
function clearOldCaches () {
  return caches.keys()
    .then(keylist => {
      return Promise.all(
        keylist
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    })
}

// application activated
self.addEventListener('activate', event => {
  console.log('service worker: activate')

    // delete old caches
  event.waitUntil(
    clearOldCaches()
    .then(() => self.clients.claim()) // self.clients.claim()方法设置本身为active的service worker。
    )
})

// 3.fetch
// application fetch network data
self.addEventListener('fetch', event => {
  // abandon non-GET requests
  if (event.request.method !== 'GET') return

  let url = event.request.url

  event.respondWith(

    caches.open(CACHE)
      .then(cache => {
        return cache.match(event.request)
          .then(response => {
            if (response) {
              // return cached file
              console.log('cache fetch: ' + url)
              return response
            }

            // make network request
            return fetch(event.request)
              .then(newreq => {
                console.log('network fetch: ' + url)
                if (newreq.ok) cache.put(event.request, newreq.clone())
                return newreq
              })
              // app is offline
              .catch(() => offlineAsset(url))
          })
      })

  )
})

// offlineAsset(url)方法通过几个辅助函数返回一个适当的值：
// is image URL?
let iExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].map(f => '.' + f)
function isImage (url) {
  return iExt.reduce((ret, ext) => ret || url.endsWith(ext), false)
}

// return offline asset
function offlineAsset (url) {
  if (isImage(url)) {
    // return image
    return new Response(
      '<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee" /><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="50" fill="#ccc">offline</text></svg>',
      { headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store'
      }}
    )
  } else {
    // return page
    return caches.match(offlineURL)
  }
}
