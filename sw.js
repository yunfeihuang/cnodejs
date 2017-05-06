var version='v1';
this.addEventListener('install', function(event) {
  console.log('install');
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll([
        '/src/module/index.html',
        '/src/module/detail.html',
        '/src/module/user.html',
        '/src/module/login.html',
        '/src/module/comments.html',
        '/src/module/photoswiper.html',
        '/dist/scripts/zepto.min.js',
        '/dist/scripts/config.min.js',
        '/dist/scripts/package.min.js',
        '/dist/scripts/components.min.js',
        '/dist/scripts/global.min.js',
        '/libs/photoswipe/photoswipe.min.js',
        '/dist/styles/package.min.css',
        '/libs/photoswipe/photoswipe.css',
        '/libs/photoswipe/photoswipe-default-skin.css',
        '/src/module/index.js',
        '/src/module/detail.js',
        '/src/module/user.js',
        '/src/module/photoswiper.js',
        '/icomoon/fonts/icomoon.ttf',
        '/icomoon/fonts/icomoon.svg',
        '/icomoon/fonts/icomoon.woff',
        '/icomoon/fonts/icomoon.eot'
      ]);
    })
  );
});
this.addEventListener('activate', function(event) {
  console.log('activate');
  var cacheWhitelist = [version];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
this.addEventListener('fetch', function(event) {
	console.log('fetch',event.request.url);
	//if(/(.html|.js|.css)$/g.test(event.request.url)||event.request.url.indexOf('fonts/icomoon')>-1){
	  event.respondWith(
		caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open(version).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
	  );
	//}
});
