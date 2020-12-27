const kmp = (source, pattern) => {
    // 先求出kmp的跳转表格 table

    // 表格长度 与 pattern 字符串长度一致 初始为0
    let table = new Array(pattern.length).fill(0);

    {
        // 检查字符串是否有自重复
        let i = 1; // 是否重复的位置
        let j = 0; // 已重复的位置
    
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                // i 位置 与 j 位置的字符串相同时 则表示有重复的
                // i, j 自增
                ++i, ++j;
                // table中 i的位置 重复的数为j
                table[i] = j;
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    ++i;
                }
            }
        }
    }

    // 再进行字符串匹配
    {
        let i = 0; // source字符串的index位置
        let j = 0; // pattern字符串的index位置
        while (i < source.length) {
            if (pattern[j] === source[i]) {
                // 匹配 i, j 自增
                ++i, ++j;
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    ++i;
                }                
            }
            // pattern 匹配完成
            if (j === pattern.length) {
                return true;
            }
        }
        return false;
    }
}
console.log(kmp('Hello', 'll'));
