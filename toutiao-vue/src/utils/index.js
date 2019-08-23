const createThrottle = (fn, delay = 1000) => {
  let status = 'START';
  return () => {
    if (status === 'WAITING') {
      return;
    }
    status = 'WAITING';
    setTimeout(() => {
      fn && fn();
      status = 'START';
    }, delay);
  };
};

const createDebounce = (fn, delay = 1000) => {
  let timmer = null;
  return args => {
    clearTimeout(timmer);
    timmer = setTimeout(() => {
      fn && fn(args);
    }, delay);
  };
};

export const reachBottomNotify = {
  install: (Vue, options) => {
    Vue.mixin({
      data() {
        return this.onReachBottom ? { scrollQueue: [] } : {};
      },

      created() {
        if (typeof this.onReachBottom === 'function') {
          this.scrollQueue.push(this.onReachBottom);
          this._listenScroll();
        }
      },

      methods: {
        _listenScroll() {
          const THRESHOLD = 50;
          const throttle = createThrottle(() => {
            this.scrollQueue.forEach(func => func());
          });
          const debounce = createDebounce(() => {
              this.scrollQueue.forEach(func => func());
          });

          window.addEventListener('scroll', () => {
            const offsetHeight = document.documentElement.offsetHeight;
            const screenHeight = window.screen.height;
            const scrollY = window.scrollY;
            const gap = offsetHeight - screenHeight - scrollY;
            if (gap < THRESHOLD) {
              throttle();
              // debounce();
            }
          });
        }
      }
    });
  }
};
