/* ============================================================
   Scanline · icons.js — 统一图标系统(注册表 + 水合器)
   规则:图标一律 <svg data-symbol="name" data-size="20"></svg> 引用,禁手绘散图、禁 emoji;
   24 网格、圆头描边、currentColor 随主题着色;注释登记 SF Symbols 名,实现以注释为准;
   描边档位:默认 2,<14px 自动 1.6(光学加粗不适用,改为减细防糊)。
   ============================================================ */
(function(){
  var R={
    /* SF Symbols: terminal —— 圆角方框 + prompt(>_) */
    'terminal':'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7.5,9.5 l3,2.5 -3,2.5"/><path d="M12.5,15 H16.5"/>',
    /* SF Symbols: archivebox —— 块历史 */
    'archivebox':'<rect x="4" y="4" width="16" height="5" rx="1.5"/><path d="M5.5,9 V17.5 a1.8,1.8 0 0 0 1.8,1.8 h9.4 a1.8,1.8 0 0 0 1.8,-1.8 V9"/><path d="M10,13.5 h4"/>',
    /* SF Symbols: gearshape —— 设置(旧版辐射线易误读为亮度;actbar 已改用 sliders) */
    'gearshape':'<circle cx="12" cy="12" r="3.2"/><path d="M12,3.5 v2.5 M12,18 v2.5 M3.5,12 H6 M18,12 h2.5 M6.1,6.1 l1.8,1.8 M16.1,16.1 l1.8,1.8 M17.9,6.1 l-1.8,1.8 M7.9,16.1 l-1.8,1.8"/>',
    /* SF Symbols: slider.horizontal.3 —— 设置/调整(无歧义) */
    'sliders':'<path d="M4,8 h8 M16.5,8 h3.5"/><circle cx="14" cy="8" r="2.2"/><path d="M4,16 h3.5 M12,16 h8"/><circle cx="10" cy="16" r="2.2"/>',
    /* SF Symbols: plus */
    'plus':'<path d="M12,5 v14 M5,12 h14"/>',
    /* SF Symbols: sparkles —— AI(一个功能一个入口:图标即入口,旁不加"AI"字样) */
    'sparkles':'<path fill="currentColor" stroke="none" d="M12,4.5 C12.75,9 13.5,9.75 18,10.5 C13.5,11.25 12.75,12 12,16.5 C11.25,12 10.5,11.25 6,10.5 C10.5,9.75 11.25,9 12,4.5 Z"/><path fill="currentColor" stroke="none" d="M18.6,15.2 l0.5,2.2 2.2,0.5 -2.2,0.5 -0.5,2.2 -0.5,-2.2 -2.2,-0.5 2.2,-0.5 Z"/>',
    /* SF Symbols: rectangle.split —— 分屏 */
    'split':'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M12,5 v14"/>',
    /* SF Symbols: magnifyingglass */
    'search':'<circle cx="11" cy="11" r="6"/><path d="M15.6,15.6 L20,20"/>',
    /* SF Symbols: trash */
    'trash':'<path d="M5,7 h14"/><path d="M9.5,7 V5.8 a1.3,1.3 0 0 1 1.3,-1.3 h2.4 a1.3,1.3 0 0 1 1.3,1.3 V7"/><path d="M7,7 l0.9,12.2 a1.5,1.5 0 0 0 1.5,1.3 h5.2 a1.5,1.5 0 0 0 1.5,-1.3 L17,7"/><path d="M10.2,10.5 v6 M13.8,10.5 v6"/>',
    /* SF Symbols: clock —— 历史/时间线(经典表盘:时针分针,杜绝误读) */
    'clock':'<circle cx="12" cy="12" r="8.5"/><path d="M12,7.2 V12 l3.4,2"/>',
    /* SF Symbols: play.fill */
    'play':'<path fill="currentColor" stroke="none" d="M9,6.5 L17.5,12 9,17.5 Z"/>',
    /* SF Symbols: rectangle.compress.vertical —— agent 窗格收起 */
    'agentpane':'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M15.5,5 v14"/><path d="M6.5,9.5 h5.5 M6.5,13 h4"/>',
    /* SF Symbols: cellular / wifi / battery.100(状态栏三件) */
    'signal':'<path fill="currentColor" stroke="none" d="M4,14 h3 v6 h-3 Z M9.5,11 h3 v9 h-3 Z M15,8 h3 v12 h-3 Z M20.5,5 h3 v15 h-3 Z"/>',
    'wifi':'<path d="M4.5,10.5 a11,11 0 0 1 15,0"/><path d="M7.5,13.5 a7,7 0 0 1 9,0"/><circle fill="currentColor" stroke="none" cx="12" cy="17" r="1.4"/>',
    'battery':'<rect x="2.5" y="8" width="17" height="8.5" rx="2.5"/><rect x="21" y="10.5" width="1.8" height="3.5" rx="0.9" fill="currentColor" stroke="none"/><rect x="4.5" y="10" width="13" height="4.5" rx="1.2" fill="currentColor" stroke="none"/>',
    /* SF Symbols: paintpalette —— 外观/主题 */
    'palette':'<path d="M12,3.5 a8.5,8.5 0 1 0 0,17 c1.6,0 2.2,-1 1.6,-2.2 c-0.8,-1.6 0.2,-3.3 2,-3.3 h2.4 a2.5,2.5 0 0 0 2.5,-2.5 A8.5,8.5 0 0 0 12,3.5 Z"/><circle fill="currentColor" stroke="none" cx="8.2" cy="10" r="1.3"/><circle fill="currentColor" stroke="none" cx="12" cy="7.8" r="1.3"/><circle fill="currentColor" stroke="none" cx="15.8" cy="10" r="1.3"/>',
    /* SF Symbols: keyboard —— 快捷键 */
    'keyboard':'<rect x="3" y="7" width="18" height="11" rx="2"/><path d="M6.5,10.5 h0.01 M10,10.5 h0.01 M13.5,10.5 h0.01 M17,10.5 h0.01 M7.5,14.5 h9"/>',
    /* SF Symbols: info.circle —— 关于 */
    'info':'<circle cx="12" cy="12" r="8.5"/><path d="M12,11 v5"/><circle fill="currentColor" stroke="none" cx="12" cy="8" r="1.1"/>',
    /* SF Symbols: folder —— 文件会话(SFTP) */
    'folder':'<path d="M3,17.5 v-10.5 a1.5,1.5 0 0 1 1.5,-1.5 h4.2 l2,2.4 h8.8 a1.5,1.5 0 0 1 1.5,1.5 v8 a1.5,1.5 0 0 1 -1.5,1.5 H4.5 a1.5,1.5 0 0 1 -1.5,-1.5 Z"/>',
    /* SF Symbols: arrow.left.arrow.right —— 隧道/端口映射 */
    'tunnel':'<path d="M4,8.5 h9 M4,8.5 l3,-3 M4,8.5 l3,3"/><path d="M20,15.5 h-9 M20,15.5 l-3,-3 M20,15.5 l-3,3"/>',
    /* SF Symbols: display —— 远程桌面 */
    'monitor':'<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M9,20.5 h6 M12,17 v3.5"/>'
  };
  function hydrate(){
    var els=document.querySelectorAll('svg[data-symbol]:not([data-done])');
    for(var i=0;i<els.length;i++){
      var el=els[i],name=el.getAttribute('data-symbol'),body=R[name];
      if(!body){continue;}
      var size=el.getAttribute('data-size')||20;
      el.setAttribute('viewBox','0 0 24 24');
      el.setAttribute('width',size);el.setAttribute('height',size);
      el.setAttribute('fill','none');el.setAttribute('stroke','currentColor');
      el.setAttribute('stroke-width',size<14?'1.6':'2');
      el.setAttribute('stroke-linecap','round');el.setAttribute('stroke-linejoin','round');
      el.innerHTML=body;el.setAttribute('data-done','1');
    }
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',hydrate);}
  else{hydrate();}
  window.ScanlineIcons={hydrate:hydrate,registry:R};
})();
