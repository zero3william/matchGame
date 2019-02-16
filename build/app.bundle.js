webpackJsonp([0],{

/***/ 1149:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playGame = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loading = __webpack_require__(467);

var _index = __webpack_require__(220);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var initScale = 1.1;
var boardArray = [];
var comboText = void 0;
var comboCount = 0;

var playGame = exports.playGame = function (_Phaser$Scene) {
  _inherits(playGame, _Phaser$Scene);

  function playGame() {
    _classCallCheck(this, playGame);

    return _possibleConstructorReturn(this, (playGame.__proto__ || Object.getPrototypeOf(playGame)).call(this, 'playGame'));
  }

  _createClass(playGame, [{
    key: 'create',
    value: function create() {
      this.add.image(_index.game.canvas.width / 2, _index.game.canvas.height / 2, 'bg').setScale(_index.gameOptions.boardWidth / 450).setAlpha(0.2);

      this.initBoard();
      this.canMove = true;

      comboText = this.add.text(_index.gameOptions.offsetX + 30, (_index.game.canvas.height - _index.gameOptions.boardWidth * _index.gameOptions.aspectRatio) / 2 + 50, '', {
        fontSize: '20px',
        fill: '#000'
      });

      //listen event
      this.input.on('gameobjectdown', this.touchStartOnTile);
    }
  }, {
    key: 'initBoard',
    value: function initBoard() {
      for (var i = 0; i < _index.gameOptions.boardSize.rows; i++) {
        boardArray[i] = [];
        for (var j = 0; j < _index.gameOptions.boardSize.cols; j++) {
          var tilePosition = this.getTilePosition(i, j);
          var random = this.getRandom(_loading.iconArr.length);
          var tile = this.add.image(tilePosition.x, tilePosition.y - _index.game.config.height, _loading.iconArr[random]);
          tile.setInteractive();
          boardArray[i][j] = {
            rowIndex: i,
            colIndex: j,
            x: tilePosition.x,
            y: tilePosition.y,
            tile: tile
          };
          this.tweens.add({
            targets: tile,
            y: tilePosition.y,
            scaleX: initScale,
            scaleY: initScale,
            angle: 360,
            duration: _index.gameOptions.dropSpeed,
            ease: 'Phaser.Easing.Bounce.Out',
            repeat: 0,
            delay: _index.gameOptions.dropDelay * _index.gameOptions.boardSize.cols * (_index.gameOptions.boardSize.rows - i - 1) + _index.gameOptions.dropDelay * j
          });
        }
      }
    }
  }, {
    key: 'touchStartOnTile',
    value: function touchStartOnTile(e, obj) {
      var scene = this.scene;

      //isTweening
      if (!scene.canMove) {
        return 0;
      }

      var board = scene.getTileByPosition(e.x, e.y);
      var tile = board.tile;

      // click tile animate
      scene.tweens.add({
        targets: tile,
        scaleX: initScale + 0.2,
        scaleY: initScale + 0.2,
        yoyo: true,
        duration: 100
      });

      //drag tile
      scene.input.on('pointermove', function (e) {
        var _board = scene.getTileByPosition(e.x, e.y);
        var _tile = _board.tile;
        if (tile != _tile) {
          board.tile = _tile;
          _board.tile = tile;
          board = _board;
          scene.swapTween();
        }
      });

      //pointer leave canvas (drop tile)
      var ctx = document.getElementById('gameContainer');
      var onceMouseleave = function onceMouseleave() {
        scene.matchCheck(scene, 1);
        scene.input.off('pointermove');
        scene.input.off('pointerup');
        ctx.removeEventListener('mouseleave', onceMouseleave, false);
      };
      ctx.addEventListener('mouseleave', onceMouseleave, false);

      //drop tile
      scene.input.on('pointerup', function () {
        scene.matchCheck(scene, 1);
        scene.input.off('pointermove');
        scene.input.off('pointerup');
        ctx.removeEventListener('mouseleave', onceMouseleave, false);
      });
    }
  }, {
    key: 'matchCheck',
    value: function matchCheck(scene, comboTime) {
      scene.canMove = false;
      var isMatched = false;
      var rowSize = _index.gameOptions.boardSize.rows;
      var colSize = _index.gameOptions.boardSize.cols;

      for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < colSize; j++) {
          var hLength = this.scanRight(i, j, 1);
          if (hLength >= 3) {
            isMatched = true;
            for (var count = 0; count < hLength; count++) {
              boardArray[i][j + count].tile.active = false;
            }
          }
          var vLength = this.scanDown(i, j, 1);
          if (vLength >= 3) {
            isMatched = true;
            for (var _count = 0; _count < vLength; _count++) {
              boardArray[i + _count][j].tile.active = false;
            }
          }
        }
      }
      if (isMatched) {
        //start Tween
        comboText.visible = true;
        this.matchTween(boardArray, scene, comboTime);
      } else {
        //end Tween , continue game
        setTimeout(function () {
          comboText.visible = false;
        }, 1000);
        scene.canMove = true;
      }
    }
  }, {
    key: 'matchTween',
    value: function matchTween(boardArray, scene, comboTime) {
      var rowSize = _index.gameOptions.boardSize.rows;
      var colSize = _index.gameOptions.boardSize.cols;

      for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < colSize; j++) {
          if (boardArray[i][j].tile.active === false) {
            var tile = boardArray[i][j].tile;
            //clear matched tile
            scene.tweens.add({
              targets: tile,
              scaleX: 0,
              scaleY: 0,
              duration: _index.gameOptions.dropSpeed
            });

            comboText.setText(comboTime + ' combo!!');
            // comboText.style.fontSize = `${30 + comboTime}px`;

            //fall all the tile on this matched tile
            for (var k = i; k > 0 && boardArray[k - 1][j].tile.active !== false; k--) {
              boardArray[k][j].tile = boardArray[k - 1][j].tile;
              scene.tweens.add({
                targets: boardArray[k - 1][j].tile,
                y: boardArray[k][j].y,
                duration: _index.gameOptions.dropSpeed
              });
              boardArray[k - 1][j].tile = tile;
            }
          }
        }
      }

      setTimeout(function () {
        scene.dropNewTileOnBoard();
      }, _index.gameOptions.dropSpeed);
      setTimeout(function () {
        scene.matchCheck(scene, comboTime + 1);
      }, _index.gameOptions.dropSpeed * 2);
    }
  }, {
    key: 'scanRight',
    value: function scanRight(row, col, length) {
      if (col + 1 === _index.gameOptions.boardSize.cols || boardArray[row][col].tile.texture.key !== boardArray[row][col + 1].tile.texture.key) {
        return length;
      } else {
        return this.scanRight(row, col + 1, length + 1);
      }
    }
  }, {
    key: 'scanDown',
    value: function scanDown(row, col, length) {
      if (row + 1 === _index.gameOptions.boardSize.rows || boardArray[row][col].tile.texture.key !== boardArray[row + 1][col].tile.texture.key) {
        return length;
      } else {
        return this.scanDown(row + 1, col, length + 1);
      }
    }
  }, {
    key: 'swapTween',
    value: function swapTween() {
      var _this2 = this;

      boardArray.forEach(function (row) {
        row.forEach(function (board) {
          _this2.tweens.add({
            targets: board.tile,
            x: board.x,
            y: board.y,
            duration: 100
          });
        });
      });
    }
  }, {
    key: 'dropNewTileOnBoard',
    value: function dropNewTileOnBoard() {
      for (var i = 0; i < _index.gameOptions.boardSize.rows; i++) {
        for (var j = 0; j < _index.gameOptions.boardSize.cols; j++) {
          var board = boardArray[i][j];
          if (board.tile.active === false) {
            var tilePosition = this.getTilePosition(i, j);
            this.textures.setTexture(board.tile, _loading.iconArr[this.getRandom(_loading.iconArr.length)]);
            board.tile.active = true;
            board.tile.y = tilePosition.y - _index.game.config.height;

            this.tweens.add({
              targets: board.tile,
              x: board.x,
              y: board.y,
              scaleX: initScale,
              scaleY: initScale,
              duration: _index.gameOptions.dropSpeed
            });
          }
        }
      }

      return true;
    }
  }, {
    key: 'getTilePosition',
    value: function getTilePosition(row, col) {
      var posX = _index.gameOptions.tileSpacing * (col + 1) + _index.gameOptions.tileSize * (col + 0.5);
      var posY = _index.gameOptions.tileSpacing * (row + 1) + _index.gameOptions.tileSize * (row + 0.5);

      posX += _index.gameOptions.offsetX;
      posY += _index.gameOptions.offsetY;
      return new Phaser.Geom.Point(posX, posY);
    }
  }, {
    key: 'getTileByPosition',
    value: function getTileByPosition(x, y) {
      var rowIndex = false;
      var colIndex = false;
      rowIndex = boardArray.findIndex(function (row) {
        colIndex = row.findIndex(function (item) {
          if (item.y - _index.gameOptions.tileSize * 0.5 > y || item.y + _index.gameOptions.tileSize * 0.5 < y) {
            return true;
          }
          if (item.x - _index.gameOptions.tileSize * 0.5 < x && item.x + _index.gameOptions.tileSize * 0.5 >= x) {
            rowIndex = true;
            return true;
          }
        });
        return rowIndex;
      });
      return rowIndex === false ? false : boardArray[rowIndex][colIndex];
    }
  }, {
    key: 'getRandom',
    value: function getRandom(max) {
      var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      return Math.floor(Math.random() * max) + min;
    }
  }]);

  return playGame;
}(Phaser.Scene);

/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.game = exports.gameOptions = undefined;

__webpack_require__(221);

var _loading = __webpack_require__(467);

var _playGame = __webpack_require__(1149);

//參數設定區
var w = window.innerWidth; //canvas width
var h = window.innerHeight; //canvas height

var rows = 5; //遊戲主板列數
var cols = 6; //遊戲主板行數
var tileSize = 48; //元素大小
var tileSpacing = 0; //元素間隔
var dropSpeed = 300; //掉落速度
var dropDelay = 10; //初始元素掉落間隔時間
var backgroundColor = 0xecf0f1; //預設背景顏色

var aspectRatio = 16 / 9; //總版面寬高比
var boardWidth = cols * (tileSize + tileSpacing) + tileSpacing; //元素版面寬
var offsetX = (w - boardWidth) / 2; //元素x軸掉落位置
var boardHeight = rows * (tileSize + tileSpacing) + tileSpacing; //元素版面高
var offsetY = (h + boardWidth * aspectRatio) / 2 - boardHeight; //元素y軸掉落位置

var gameOptions = exports.gameOptions = {
  tileSize: tileSize,
  tileSpacing: tileSpacing,
  boardSize: {
    rows: rows,
    cols: cols
  },
  dropSpeed: dropSpeed,
  dropDelay: dropDelay,
  boardWidth: boardWidth,
  boardHeight: boardHeight,
  offsetX: offsetX,
  offsetY: offsetY,
  aspectRatio: aspectRatio
};

var gameConfig = {
  parent: 'gameContainer',
  width: w,
  height: h,
  scene: [_loading.loading, _playGame.playGame],
  backgroundColor: backgroundColor
};

var game = exports.game = new Phaser.Game(gameConfig);

/***/ }),

/***/ 467:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var iconArr = exports.iconArr = ['egg', 'fish', 'meat'
// 'watermelon',
// 'grape',
// 'potato'
// 'vegetable'
];

var loading = exports.loading = function (_Phaser$Scene) {
  _inherits(loading, _Phaser$Scene);

  function loading() {
    _classCallCheck(this, loading);

    return _possibleConstructorReturn(this, (loading.__proto__ || Object.getPrototypeOf(loading)).call(this, 'loading'));
  }

  _createClass(loading, [{
    key: 'preload',
    value: function preload() {
      this.load.image('egg', 'assets/sprites/egg48x48.png');
      this.load.image('fish', 'assets/sprites/fish48x48.png');
      this.load.image('meat', 'assets/sprites/meat48x48.png');
      this.load.image('watermelon', 'assets/sprites/watermelon48x48.png');
      this.load.image('grape', 'assets/sprites/grape48x48.png');
      this.load.image('potato', 'assets/sprites/potato48x48.png');
      this.load.image('vegetable', 'assets/sprites/vegetable48x48.png');
      this.load.image('bg', 'assets/sprites/bg.jpg');
    }
  }, {
    key: 'create',
    value: function create() {
      this.add.text(100, 100, 'loading ...', { fill: '#0f0' });
      this.scene.start('playGame');
    }
  }]);

  return loading;
}(Phaser.Scene);

/***/ })

},[220]);