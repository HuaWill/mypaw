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

  const KEYMAP = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  }

  function drawHero(context, heroImg, allSpriteImg) {

    var draw = function () {
      this.context
        .drawImage(
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
      this.context
        .clearRect(
          this.rect.x,
          this.rect.y,
          this.rect.width,
          this.rect.height
        );
    }

    let canHeroMoveUp = (step) => {
      let can = false;
      let { x: heroX, width: heroWidth, y: heroY, height: heroHeight } = hero.rect;
      let { x: monsterX, width: monsterWidth, y: monsterY, height: monsterHeight } = monster.rect;
      let distanceX = heroX - monsterX;
      let distanceY = heroY - monsterY;

      if (heroY - step >= 0) {    // 英雄往上不会移出画布
        if (distanceX <= -heroWidth || distanceX >= monsterWidth) {
          can = true;   // 魔王在英雄的两侧，随便移
        } else if (distanceY <= -heroHeight || distanceY >= monsterHeight + step) {
          can = true;   // 魔王在英雄的下面，或者英雄往上不会碰到魔王
        }
      }

      return can;
    }

    let canHeroMoveDown = (step) => {
      let can = false;
      let { x: heroX, width: heroWidth, y: heroY, height: heroHeight } = hero.rect;
      let { x: monsterX, width: monsterWidth, y: monsterY, height: monsterHeight } = monster.rect;
      let distanceX = heroX - monsterX;
      let distanceY = heroY - monsterY;
      let { height: canvasHeight } = context.canvas;

      if (heroY + heroHeight + step <= canvasHeight) {    // 英雄往下不会移出画布
        if (distanceX <= -heroWidth || distanceX >= monsterWidth) {
          can = true;   // 魔王在英雄的两侧，随便移
        } else if (distanceY >= monsterHeight || Math.abs(distanceY) >= heroHeight + step) {
          can = true;   // 魔王在英雄的上面，或者英雄往下不会碰到魔王
        }
      }

      return can;
    }

    let canHeroMoveLeft = (step) => {
      let can = false;
      let { x: heroX, width: heroWidth, y: heroY, height: heroHeight } = hero.rect;
      let { x: monsterX, width: monsterWidth, y: monsterY, height: monsterHeight } = monster.rect;
      let distanceX = heroX - monsterX;
      let distanceY = heroY - monsterY;

      if (heroX - step >= 0) {    // 英雄往左不会移出画布
        if (distanceY <= -heroHeight || distanceY >= monsterHeight) {
          can = true;   // 魔王在英雄的两侧，随便移
        } else if (distanceX <= -heroWidth || distanceX >= monsterWidth + step) {
          can = true;   // 魔王在英雄的右面，或者英雄往左不会碰到魔王
        }
      }

      return can;
    }

    let canHeroMoveRight = (step) => {
      let can = false;
      let { x: heroX, width: heroWidth, y: heroY, height: heroHeight } = hero.rect;
      let { x: monsterX, width: monsterWidth, y: monsterY, height: monsterHeight } = monster.rect;
      let distanceX = heroX - monsterX;
      let distanceY = heroY - monsterY;
      let { width: canvasWidth } = context.canvas;


      if (heroX + heroWidth + step <= canvasWidth) {    // 英雄往右不会移出画布
        if (distanceY <= -heroHeight || distanceY >= monsterHeight) {
          can = true;   // 魔王在英雄的两侧，随便移
        } else if (distanceX >= monsterWidth || Math.abs(distanceX) >= monsterX + step) {
          can = true;   // 魔王在英雄的左面，或者英雄往右不会碰到魔王
        }
      }

      return can;
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
        x: 0,
        y: 0,
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

    var monster = {
      img: allSpriteImg,
      context: context,
      imgPos: {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      },

      rect: {
        x: 200,
        y: 120,
        width: 40,
        height: 40
      },

      draw: draw
    };

    hero.draw();
    monster.draw();

    return hero;
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
