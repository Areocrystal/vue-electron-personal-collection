<template>
    <table>
        <caption>
            <font-awesome-icon icon="calculator"/>
        </caption>
        <tr>
            <th colspan='5' class="rc">
                <p class="expression">{{expression}}</p>
                <p class="result">{{result}}</p>
            </th>
        </tr>
        <tr>
            <td colspan="2" @click.stop="deleteAll()">C</td>
            <td colspan="2" @click.stop="deleteLast()">←</td>
            <td @click.stop="special('0-(')">±</td>
        </tr>
        <tr>
            <td @click="digit(7)">7</td>
            <td @click="digit(8)">8</td>
            <td @click="digit(9)">9</td>
            <td @click="sign('÷')">÷</td>
            <td @click="special('0.01*(')">%</td>
        </tr>
        <tr>
            <td @click.stop="digit(4)">4</td>
            <td @click.stop="digit(5)">5</td>
            <td @click.stop="digit(6)">6</td>
            <td @click.stop="sign('×')">×</td>
            <td @click.stop="special('Math.sqrt(')">½</td>
        </tr>
        <tr>
            <td @click.stop="digit(1)">1</td>
            <td @click.stop="digit(2)">2</td>
            <td @click.stop="digit(3)">3</td>
            <td @click.stop="sign('-')">-</td>
            <td rowspan="2" @click.stop="sign('=')">=</td>
        </tr>
        <tr>
            <td colspan="2" @click.stop="digit(0)">0</td>
            <td @click.stop="point('.')">.</td>
            <td @click.stop="sign('+')">+</td>
        </tr>
    </table>
</template>

<script>
    export default {
        name: "normal-calc",
        data() {
            return {
                expression: '',
                result: '',
                shouldFuc: true,
            }
        },
        methods: {
            digit(x) {
                this.expression += x;
            },
            point(x) {
                if (/\d+$/g.test(this.expression) && !/\.\d+$/.test(this.expression))
                    this.expression += x;
            },
            deleteAll() {
                this.expression = '';
                this.result = '';
                this.shouldFuc = true
            },
            sign(x) {
                if (x !== "=") {
                    if (/\d+$/.test(this.expression) || (this.expression === "" && x === "-")) {
                        this.expression += x;
                        if (/^-?\d+\.?\d*[+×\-÷]\d+\.?\d*/g.test(this.expression)) {
                            if (this.result !== "" && /(-?\d+\.?\d*[+×\-÷]){3,}/g.test(this.expression)) {
                                let re = this.expression.match(/[+×\-÷]/g),
                                    nas = this.expression.match(/\d+\.?\d*/g),
                                    n = +nas[nas.length - 1];
                                this.result = this.partResult(this.result * 1, n, re[re.length - 2]);
                            } else if (/^-/.test(this.expression)) {
                                this.result = this.partResult(this.expression.match(/-?\d+\.?\d*/g)[0], this.expression.match(/\d+\.?\d*/g)[1], /[+×\-÷]/.exec(this.expression.substr(1)).toString());
                            } else
                                this.result = this.partResult(this.expression.match(/\d+\.?\d*/g)[0], this.expression.match(/\d+\.?\d*/g)[1], /[+×\-÷]/.exec(this.expression).toString());
                        }
                    } else if (/-?\d+\.?\d*[+×\-÷]$/.test(this.expression))
                        this.expression = this.expression.replace(/[+×\-÷]$/g, x);
                    else if (this.result !== "" && this.expression === "")
                        this.expression = this.result + x;
                } else {
                    this.shouldFuc = true;
                    if (/^-?\d+\.?\d*[+×\-÷]\d+\.?\d*/g.test(this.expression)) {
                        if (this.result !== '' && /(-?\d+\.?\d*[+×\-÷]){2,}\d+\.?\d*$/g.test(this.expression)) {
                            // eslint-disable-next-line no-useless-escape
                            let re = this.expression.match(/[+×\-÷]/g),
                                nas = this.expression.match(/\d+\.?\d*/g),
                                n = nas[nas.length - 1] * 1;
                            this.result = this.partResult(this.result * 1, n, re[re.length - 1]);
                            this.expression = '';
                        } else if (!(/[+×\-÷]$/g.test(this.expression))) {
                            this.result = /^-/.test(this.expression) ?
                                this.partResult(this.expression.match(/-?\d+\.?\d*/g)[0],
                                    this.expression.match(/\d+\.?\d*/g)[1], /[+×\-÷]/.exec(this.expression.substr(1)).toString()) : this.partResult(this.expression.match(/\d+\.?\d*/g)[0], this.expression.match(/\d+\.?\d*/g)[1], /[+×\-÷]/.exec(this.expression).toString());
                            this.expression = ''
                        }
                    } else {
                        this.result = /^-?\d+\.?\d*/.exec(this.expression);
                    }
                }
            },
            deleteLast() {
                if (!(/[+×\-÷]$/.test(this.expression) && this.result)) {
                    this.expression = this.expression.slice(0, -1);
                }
            },
            special(x) {
                let st = this.expression;
                st = st.replace(/÷/g, "/");
                st = st.replace(/×/g, "*");
                if (this.result) {
                    this.result = this.shouldFuc ? /\d+\.?\d*[+*\-/]\d+\.?\d*$/g.test(st) ?
                        this.precisionFixed(eval(x + eval(this.result + /[+*\-/]\d+\.?\d*$/.exec(st)) + ')')) :
                        this.precisionFixed(eval(x + this.result + ')')) :
                        eval(x + this.result + ')');
                } else {
                    if (st) {
                        console.log(st);
                        if (/-?\d+\.?\d*[+*\-/]\d+\.?\d*/g.test(st) && this.shouldFuc) {
                            this.shouldFuc = false;
                            this.result = this.precisionFixed(eval(x + eval(/^-?\d+\.?\d*[+*\-/]\d+\.?\d*/.exec(st)) + ')'));
                        } else if (/^-?\d+\.?\d*[+*\-/]$/g.test(st)) {
                            this.result = this.precisionFixed(eval(x + /^-?\d+\.?\d*/.exec(st) + ')'));
                        } else {
                            this.result = this.precisionFixed(eval(x + st + ')'));
                        }
                    }
                }
            },

            partResult(n1, n2, operator) {
                switch (operator) {
                    case "×":
                        return this.precisionFixed(n1, '*', n2);
                    case "÷":
                        return this.precisionFixed(n1, '/', n2);
                    case "+":
                        return this.precisionFixed(n1, '+', n2);
                    case "-":
                        return this.precisionFixed(n1, '-', n2);
                }
            },

            precisionFixed(n1, operator, n2) {
                let res, times, originalRes, args = arguments.length;
                res = args === 1 ? n1 : eval(n1 + operator + n2);
                if (Number.isFinite(res)) {
                    if (args === 1) {
                        return res;
                    }
                    if (Number.isInteger(res)) {
                        return res;
                    } else {
                        let floatLength1 = (n1 + '').split('.')[1] || '',
                            floatLength2 = (n2 + '').split('.')[1] || '';
                        times = +('1e' + Math.max(floatLength1.length, floatLength2.length));
                        originalRes = eval(n1 * times + operator + n2 * times) / times;
                        if (operator === '+' || operator === '-') {
                            return originalRes;
                        } else if (operator === '*') {
                            return originalRes / times;
                        } else if (operator === '/') {
                            return originalRes * times;
                        }
                    }
                } else {
                    this.expression = '';
                    return "Error Operation";
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    @import '~@/assets/css/index';

    table {
        width: 50%;
        border: 1px double #7f7b86;
        background-color: @main-color-bg;
        border-spacing: 4px;
        text-align: center;
        margin: 20px 0 20px 20px;
        font: 18px consolas;
        border-radius: 5% 2%;
        box-shadow: 2px 0 10px 12px rgba(10, 10, 10, .6);

        caption {
            padding-bottom: 5px;
            text-align: left;
            font: italic 16px Meiryo;
        }

        td {
            border: 1px solid #aaa;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 2px 0 0 2px #2e2e2e;

            &:hover {
                background-color: @main-color;
                transform: scale(1.1);
                cursor: pointer;
            }
        }

        .rc {
            height: 75px;
            padding: 0 4px;

            p {
                width: 100%;
                border-left: 2px solid @nb;
                border-right: 2px solid @nb;
                text-align: right;
                cursor: grab;
                margin: 0;
            }

            .expression {
                height: 100px;
                font: 700 22px/22px consolas;
                border-top: 2px solid @nb;
                overflow: auto;
            }

            .result {
                height: 50px;
                border-bottom: 2px solid @nb;
                font: 24px/24px arial;
                color: #444;
                text-align: right;
                overflow: hidden;
            }
        }

    }

</style>