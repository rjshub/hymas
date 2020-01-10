<template>
    <div class="festival-show">
        <canvas class="myblog"
            id="mycanvas">
        </canvas>
    </div>
</template>

<script>
export default {
  name: "Festival-Show",
  components: {},
  data() {
    return {
      src: ""
    };
  },
  computed: {},
  watch: {},

  methods: {
    calculteTime() {
      let year = moment().format("YYYY");
      let month = moment().format("MM");
      let day = moment().format("DD");

      // 圣诞节
      if (moment().format("MM-DD") == "12-25") {
        this.src = require("@/assets/images/festival/snow.png");
      }

      //元宵
      if (this.$sloarToLunar(year, month, day).indexOf("正月十五")>-1) {
        this.src = require("@/assets/images/festival/lamp.png");
      }

      //端午
      if (this.$sloarToLunar(year, month, day).indexOf("五月初五")>-1) {
        this.src = require("@/assets/images/festival/zongzi.png");
      }

      //中秋
      if (this.$sloarToLunar(year, month, day).indexOf("八月十五")>-1) {
        this.src = require("@/assets/images/festival/mooncake.png");
      }
    },
    init() {
      this.calculteTime();

      window.requestAnimationFrame = (function() {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback) {
            setTimeout(callback, 1000 / 60);
          }
        );
      })();

      // 获取浏览器的长宽
      var b_width = window.screen.width;
      var b_height = window.screen.height;
      var c = document.getElementById("mycanvas");
      c.width = b_width;
      c.height = b_height;
      // 获取canvas 的2d上下文
      var ctx = c.getContext("2d");
      // 绘制背景
      drawmybg(ctx, c.width, c.height);

      const snows = []; // 所有的雪花
      const G = 1; // 下落的加速度
      let tickerCount = 250; // 定时器定时的间隔(新增snow)
      let large = 50; //雪花大小

      // 速度限制(X,Y)
      const SPEED_LIMIT_X = 1;
      const SPEED_LIMIT_Y = 1;

      // 定时器计数
      let ticker = 0;

      // 当前时间
      let lastTime = Date.now();
      // 执行循环的时间
      let deltaTime = 0;

      // 获取图片资源
      let snowImage = new Image();
      snowImage.src = this.src;

      snowImage.onload = () => {
        // 开始绘制
        loop();
      };

      // 循环绘制
      function loop() {
        requestAnimationFrame(loop);
        // 清除画板
        ctx.clearRect(0, 0, c.width, c.height);

        // 计算时间间隔累加tricker
        const now = Date.now();
        deltaTime = now - lastTime;
        lastTime = now;
        ticker += deltaTime;

        // 当超过tickcount时候，新增snow
        if (ticker > tickerCount) {
          snows.push(new Snow(Math.random() * c.width, 0, Math.random() * large + 10)); //雪花大小
          ticker %= tickerCount;
        }

        // 绘制背景
        drawmybg(ctx, c.width, c.height);
        // 绘制雪花
        snows.map(function(s, i) {
          s.update();
          s.draw();
          // 如果雪花到底部删除
          if (s.y > c.height) {
            snows.splice(i, 1);
          }
        });
      }

      // 定义雪花实体
      function Snow(x, y, radius) {
        this.x = x;
        this.y = y;
        this.sx = 0;
        this.sy = 0;
        this.radius = radius;
        this.deg = 0;
        this.ax = Math.random() < 0.5 ? 0.005 : -0.005;
      }

      // 定义雪花的状态
      Snow.prototype.update = function() {
        const degr = Math.random() * 0.6 + 0.2;

        // x方向调整
        this.sx += this.ax;
        if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
          this.ax *= -1;
        }

        // y方向调整
        if (this.sy < SPEED_LIMIT_Y) {
          this.sy += G;
        }

        // 更新snow参数
        this.x += this.sx;
        this.y += this.sy;
        this.deg += degr;
      };

      // 绘制雪花
      Snow.prototype.draw = function() {
        const radius = this.radius;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.deg * Math.PI) / 180);
        ctx.drawImage(snowImage, -radius, -radius, radius * 2, radius * 2);
        ctx.restore();
      };

      // 绘制背景
      function drawmybg(ctx, W, H) {
        ctx.save();
        var grd = ctx.createRadialGradient(W / 2, H / 2, 1, W / 2, H / 2, H);
        grd.addColorStop(0, "#F5F4F9");
        grd.addColorStop(1, "#F5F4F9");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }
  },

  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.festival-show {
  position: fixed;
  pointer-events: none;
}
</style>
