(function () {

  function prepare() {

    const imgTask = (img, src) => {
      return new Promise(function (resolve, reject) {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };

    const context = document.getElementById('content').getContext('2d');
    const heroImg = new Image();
    const allSpriteImg = new Image();

    const allresourceTask = Promise.all([
      imgTask(heroImg, '../images/hero.png'),
      imgTask(allSpriteImg, '../images/all.jpg'),
    ]);

    return {
      /**
       * @param {Function} [callback] - 当准备好了之后要调用的回掉函数
       */
      getResource(callback) {
        allresourceTask.then(function () {
          callback && callback(context, heroImg, allSpriteImg);
        });
      }
    };
  }

  function drawHero(context, heroImg, allSpriteImg) {

    var draw = function () {
      this.context.drawImage(
        this.img,
        this.imgPos.x,
        this.imgPos.y,
        this.imgPos.width,
        this.imgPos.height,
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
    }

    var clear = function () {
      this.context.clearRect(
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
    }

    let canHeroMoveUp = (step) => {
      let can = false;
      let { y: heroY } = hero.rect;
      if (heroY - step >= 0) {    // 英雄往上不会移出画布
        can = monsters.every(monster => monster.awayFrom(Object.assign({}, hero.rect, {y: heroY - step})));
      }

      return can;
    }

    let canHeroMoveDown = (step) => {
      let can = false;
      let { y: heroY, height: heroHeight } = hero.rect;
      let { height: canvasHeight } = context.canvas;

      if (heroY + heroHeight + step <= canvasHeight) {    // 英雄往下不会移出画布
        can = monsters.every(monster => monster.awayFrom(Object.assign({}, hero.rect, {y: heroY + step})));
      }

      return can;
    }

    let canHeroMoveLeft = (step) => {
      let can = false;
      let { x: heroX } = hero.rect;

      if (heroX - step >= 0) {    // 英雄往左不会移出画布
        can = monsters.every(monster => monster.awayFrom(Object.assign({}, hero.rect, {x: heroX - step})));
      }

      return can;
    }

    let canHeroMoveRight = (step) => {
      let can = false;
      let { x: heroX, width: heroWidth } = hero.rect;
      let { width: canvasWidth } = context.canvas;

      if (heroX + heroWidth + step <= canvasWidth) {
        can = monsters.every(monster => monster.awayFrom(Object.assign({}, hero.rect, {x: heroX + step})));
      }

      return can;
    }

    let awayFrom = function (heroRect) {
      let { x: monsterX, y: monsterY, height: monsterH, width: monsterW } = this.rect;
      let { x: heroX, y: heroY, height: heroH, width: heroW } = heroRect;
      let distanceX = heroX - monsterX;
      let distanceY = heroY - monsterY;

      return distanceX <= -heroW ||       /* 英雄在魔王左侧 */
              distanceX >= monsterW ||    /* 英雄在魔王右侧 */
                distanceY <= -heroH ||    /* 英雄在魔王上方 */
                  distanceY >= monsterH   /* 英雄在魔王下方 */
    }

    var hero = {
      img: heroImg,
      context: context,
      imgPos: {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      },

      rect: {
        x: 250,
        y: 150,
        width: 40,
        height: 40
      },

      draw: draw,
      clear: clear,
      canHeroMoveDown: canHeroMoveDown,
      canHeroMoveUp: canHeroMoveUp,
      canHeroMoveLeft: canHeroMoveLeft,
      canHeroMoveRight: canHeroMoveRight
    };

    var monster1 = {
      img: allSpriteImg,
      context: context,
      imgPos: {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      },

      rect: {
        x: 60,
        y: 60,
        width: 40,
        height: 40
      },

      draw: draw,
      awayFrom: awayFrom
    };

    var monster2 = {
      img: allSpriteImg,
      context: context,
      imgPos: {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      },

      rect: {
        x: 180,
        y: 160,
        width: 40,
        height: 40
      },

      draw: draw,
      awayFrom: awayFrom
    };

    var monster3 = {
      img: allSpriteImg,
      context: context,
      imgPos: {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      },

      rect: {
        x: 300,
        y: 220,
        width: 40,
        height: 40
      },

      draw: draw,
      awayFrom: awayFrom
    };

    var monsters = [monster1, monster2, monster3];
    monsters.forEach(monster => monster.draw());

    hero.draw();

    return hero;
  }

  const KEYMAP = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  }

  var resourceManager = prepare();
  resourceManager.getResource(function (context, heroImg, allSpriteImg) {
    var hero = drawHero(context, heroImg, allSpriteImg);
    var step = 10;
    document.body.addEventListener('keyup', (evt) => {
      switch (evt.keyCode) {
        case KEYMAP.UP:
          if (hero.canHeroMoveUp(step)) {
            hero.clear();
            hero.rect.y -= step;
          }
          break;
        case KEYMAP.DOWN:
          if (hero.canHeroMoveDown(step)) {
            hero.clear();
            hero.rect.y += step;
          }
          break;
        case KEYMAP.LEFT:
          if (hero.canHeroMoveLeft(step)) {
            hero.clear();
            hero.rect.x -= step;
          }
          break;
        case KEYMAP.RIGHT:
          if (hero.canHeroMoveRight(step)) {
            hero.clear();
            hero.rect.x += step;
          }
          break;
        default:
          // nothing happen here
          break;
      }

      hero.draw();
    });
  });
})();
