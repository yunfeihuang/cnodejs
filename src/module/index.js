(function(xhtml){
  var $xhtml=$(xhtml);
  $xhtml.on('xpulldown','x-scrollbox',function(){
    topic.setAttribute('insert','insert');
    topic.fetch();
  }).on('xpullup','x-scrollbox',function(){
    var query=topic.getQuery();
    query.page++;
    topic.setAttribute('insert','after');
    topic.setQuery(query,true);
  }).on('xchange','x-tabbox',function(e){
    var actions=[
      "https://cnodejs.org/api/v1/topics?limit=20&page=1",
      "https://cnodejs.org/api/v1/topics?tab=good&limit=20&page=1",
      "https://cnodejs.org/api/v1/topics?tab=share&limit=20&page=1",
      "https://cnodejs.org/api/v1/topics?tab=ask&limit=20&page=1",
      "https://cnodejs.org/api/v1/topics?tab=job&limit=20&page=1"
    ];
    topic.removeAttribute('insert');
    topic.action=actions[e.detail];
    xhtml.querySelector('x-scrollbox').scrollTop=0;
  })
})(document.xhtml);