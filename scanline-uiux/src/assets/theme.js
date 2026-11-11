/* Scanline · theme.js — 主题运行时(页面零代码,引即生效)
   契约:①?theme= 参数优先 ②localStorage['adr-theme'] ③父窗口 postMessage({type:'adr-theme'})
   ④storage 跨窗口同步 ⑤就绪回报 {type:'adr-theme-ready'}。全部 try/catch 兜底,最坏退默认深色。 */
(function(){
  try{
    var t=new URLSearchParams(location.search).get('theme');
    if(t!=='light'&&t!=='dark'){ try{t=localStorage.getItem('adr-theme');}catch(e){} }
    if(t!=='light'&&t!=='dark'){ t='dark'; }
    document.documentElement.setAttribute('data-theme',t);
    window.addEventListener('message',function(ev){
      var d=ev&&ev.data;
      if(d&&d.type==='adr-theme'&&(d.theme==='light'||d.theme==='dark')){
        document.documentElement.setAttribute('data-theme',d.theme);
      }
    });
    window.addEventListener('storage',function(e){
      if(e.key==='adr-theme'&&(e.newValue==='light'||e.newValue==='dark')){
        document.documentElement.setAttribute('data-theme',e.newValue);
      }
    });
    window.postMessage({type:'adr-theme-ready',theme:t},'*');
  }catch(e){ /* 最坏退化为默认深色 */ }
})();
