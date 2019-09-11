/**
 * 工具类，提供中间层iframe的创建和通信
 */
const Bridge = class Bridge {
  createView(id, componentUri) {
    return new Promise(resolve => {
      let frame = document.createElement("iframe");
      frame.src = componentUri;
      frame.id = id;
      frame.onload = () => resolve(frame);
      document.body.appendChild(frame);
    });
  }

  postMessage(target, params) {
    target && target.contentWindow.postMessage(params);
  }

  onMessage(target, callback) {
    target.addEventListener("message", (event) => {
      if (event.origin === target.location.origin) {
        callback && callback(event.data);
      }
    });
  }
}

window.__bridge = new Bridge();
