// 结束符
// 使用Symbol的不可重复性来定义结束符
let $ = Symbol('$');

class Trie {
    constructor () {
        // 也可以用Map 
        // 使用Object.create 来防止对象被Object.proptype
        this.root = Object.create(null);
    }

    // 插入字符串
    insert (word) {
        let node = this.root;
        for (let w of word) {
            // 检查root中是否存在改字符串
            if (!node[w]) {
                // 不存在 接着创建对象来存储字符串
                node[w] = Object.create(null);
            }
            node = node[w];
        }
        if (!($ in node)) {
            node[$] = 0;
        }
        node[$]++;
    }

    // 查询出现次数最多的
    most () {
        let max = 0;
        let maxWord = null;
        let visit = function (node, word) {
            if (node[$] && node[$] > max) {
                max = node[$];
                maxWord = word;
            }

            for (let p in node) {
                visit(node[p], word + p);
            }
        }

        visit(this.root, "");
        console.log(maxWord, max);
    }
}

// 随机字符串
function randomWord(length) {
    let s = '';
    for (let i = 0; i < length; i++) {
        s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0));
    }

    return s;
}

// console.log(randomWord(4));
let trie = new Trie();

for (let i = 0; i < 100000; i++) {
    trie.insert(randomWord(4));
}
// console.log(trie);
