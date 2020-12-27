// * 最后一个 * 尽可能多的匹配
// 正则的exec

function wildCard (source, pattern) {
    let starCount = 0;
    // 遍历查找有几个 * 
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === '*') {
            starCount++;
        }
    }

    // 没有 * 的情况, 检查pattern是否严格匹配
    if (starCount === 0) {
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] !== source[i] && pattern[i] !== '?') {
                return false;
            }
        }
        return;
    }


    // 第一个 * 之前的部分
    let i = 0; // pattern 的位置
    let lastIndex = 0; // source 的位置
    // 如果pattern[i] === '*'时 则表示到达第一个*的位置
    for (let i = 0; pattern[i] !== '*'; i++) {
        if (pattern[i] !== source[i] && pattern[i] !== '?') {
            return false;
        }
    }

    // source 的位置更新为i
    lastIndex = i;
    for (let s = 0; s < starCount - 1; s++) {
        i++;
        // 每一段 含有*的字符串
        let subPattern = '';
        while (pattern[i] !== '*') {
            subPattern += pattern[i];
            i++;
        }
        // 正则 替换subPattern中的?  任意字符
        let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
        reg.lastIndex = lastIndex;

        console.log(reg.exec(source));

        lastIndex = reg.lastIndex;
    }

    // 尾部的匹配
    for (let j = 0;j <= source.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
        if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== '?') {
            return false;
        }
    }

    return true;
}