<template>
    <div id="app">
        <StyleEditor ref="styleEditor" :code="currentStyle"></StyleEditor>
        <ResumeEditor
            ref="resumeEditor"
            :markdown="currentMarkdown"
            :enableHtml="enableHtml"
        ></ResumeEditor>
    </div>
</template>

<script>
import StyleEditor from "@/components/StyleEditor";
import ResumeEditor from "@/components/ResumeEditor";
export default {
    components: { StyleEditor, ResumeEditor },
    data() {
        return {
            interval: 20,
            currentStyle: "",
            enableHtml: false,
            fullStyle: [
                `/*
* Inspired by
* https://github.com/OctoberToEscape
* https://octobertoescape.github.io/resume/dist/index.html#/
* 大家好，我是OctoberToEscape
* 是前来面试前端的，我看好多都是纸制简历，我来点与众不同的。
* 说做就做！
*/

/* 首先给所有元素加上过渡效果 */
* {
  -webkit-transition: all .3s;
  transition: all .3s;
}
/* 白色背景太单调了，我们来点背景 */
html {
  color: rgb(222,222,222); background: rgb(0,43,54);
}
/* 文字离边框太近了 */
.styleEditor {
  padding: .5em;
  border: 1px solid;
  margin: .5em;
  overflow: auto;
  width: 45vw; height: 90vh;
}
/* 代码高亮 */
.token.selector{ color: rgb(133,153,0); }
.token.property{ color: rgb(187,137,0); }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }

/* 加点 3D 效果呗 */
html{
  -webkit-perspective: 1000px;
          perspective: 1000px;
}
.styleEditor {
  position: fixed; left: 0; top: 0;
  -webkit-transition: none;
  transition: none;
  -webkit-transform: rotateY(10deg) translateZ(-100px) ;
          transform: rotateY(10deg) translateZ(-100px) ;
}

/* 接下来我给自己准备一个编辑器 */
.resumeEditor{
  position: fixed; right: 0; top: 0;
  padding: .5em;  margin: .5em;
  width: 48vw; height: 90vh;
  border: 1px solid;
  background: white; color: #222;
  overflow: auto;
}
/* 好了，我开始写简历了 */


`,
                `
/* 这个简历好像差点什么
 * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
 * 简单，用开源工具翻译成 HTML 就行了
 */
`,
                `
/* 再对 HTML 加点样式 */
.resumeEditor{
  padding: 2em;
}
.resumeEditor h2{
  display: inline-block;
  border-bottom: 1px solid;
  margin: 1em 0 .5em;
}
.resumeEditor ul,.resumeEditor ol{
  list-style: none;
}
.resumeEditor ul> li::before{
  content: '•';
  margin-right: .5em;
}
.resumeEditor ol {
  counter-reset: section;
}
.resumeEditor ol li::before {
  counter-increment: section;
  content: counters(section, ".") " ";
  margin-right: .5em;
}
.resumeEditor blockquote {
  margin: 1em;
  padding: .5em;
  background: #ddd;
}
`,
            ],
            currentMarkdown: "",
            fullMarkdown: `OctoberToEscape
----

前端切图仔。

技能
----

* 前端开发
  - html5
  - css / sass
  - javascript
  - typescript
  - jquery
  - git/npm/yarn
  - vue
  - react
  - 小程序

链接
----

* [GitHub](https://github.com/OctoberToEscape)
* [详细简历](https://octobertoescape.github.io/resume/dist/index.html#/)
* [vue总结](https://github.com/OctoberToEscape/vue-notes)
* [javaScript总结](https://github.com/OctoberToEscape/CodeWarehouse)

> 如果你喜欢这份简历，可以关注[我的GitHub](https://github.com/OctoberToEscape)，并且可以通过我的邮箱he960301@163.com联系我。

`,
        };
    },
    created() {
        this.makeResume();
    },
    methods: {
        async makeResume() {
            await this.progressivelyShowStyle(0);
            await this.progressivelyShowResume();
            await this.progressivelyShowStyle(1);
            await this.showHtml();
            await this.progressivelyShowStyle(2);
        },
        showHtml() {
            return new Promise((resolve, reject) => {
                this.enableHtml = true;
                resolve();
            });
        },
        progressivelyShowStyle(n) {
            return new Promise((resolve, reject) => {
                let interval = this.interval;
                let showStyle = async () => {
                    let style = this.fullStyle[n];
                    if (!style) return;
                    let length = this.fullStyle
                        .filter((_, index) => index <= n)
                        .map((item) => item.length)
                        .reduce((p, c) => p + c, 0);
                    let prefixLength = length - style.length;
                    if (this.currentStyle.length < length) {
                        let l = this.currentStyle.length - prefixLength;
                        let char = style.substring(l, l + 1) || " ";
                        this.currentStyle += char;
                        if (
                            style.substring(l - 1, l) === "\n" &&
                            this.$refs.styleEditor
                        ) {
                            this.$nextTick(() => {
                                this.$refs.styleEditor.goBottom();
                            });
                        }
                        setTimeout(showStyle, interval);
                    } else {
                        resolve();
                    }
                };
                showStyle();
            });
        },
        progressivelyShowResume() {
            return new Promise((resolve, reject) => {
                let length = this.fullMarkdown.length;
                let interval = this.interval;
                let showResume = () => {
                    if (this.currentMarkdown.length < length) {
                        this.currentMarkdown = this.fullMarkdown.substring(
                            0,
                            this.currentMarkdown.length + 1
                        );
                        let lastChar = this.currentMarkdown[
                            this.currentMarkdown.length - 1
                        ];
                        let prevChar = this.currentMarkdown[
                            this.currentMarkdown.length - 2
                        ];
                        if (prevChar === "\n" && this.$refs.resumeEditor) {
                            this.$nextTick(() =>
                                this.$refs.resumeEditor.goBottom()
                            );
                        }
                        setTimeout(showResume, interval);
                    } else {
                        resolve();
                    }
                };
                showResume();
            });
        },
    },
};
</script>
