/*
* locates the most recent cache by version name, 取到所有 URL的key的列表，
* 移除所有无用 URL，排序所有的列表并且把他们加到 ID 为cachedpagelist的 DOM 节点中
*/

// cache name
const
  CACHE = '::PWAsite',
  offlineURL = '/offline/',
  list = document.getElementById('cachedpagelist');

// fetch all caches
window.caches.keys()
  .then(cacheList => {

    // find caches by and order by most recent
    cacheList = cacheList
      .filter(cName => cName.includes(CACHE))
      .sort((a, b) => a - b);

    // open first cache
    caches.open(cacheList[0])
      .then(cache => {

        // fetch cached pages
        cache.keys()
          .then(reqList => {

            let frag = document.createDocumentFragment();

            reqList
              .map(req => req.url)
              .filter(req => (req.endsWith('/') || req.endsWith('.html')) && !req.endsWith(offlineURL))
              .sort()
              .forEach(req => {
                let
                  li = document.createElement('li'),
                  a = li.appendChild(document.createElement('a'));
                  a.setAttribute('href', req);
                  a.textContent = a.pathname;
                  frag.appendChild(li);
              });

            if (list) list.appendChild(frag);

          });

      })

  });

作者：MrDream
链接：http://www.jianshu.com/p/7546527a786d
來源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
