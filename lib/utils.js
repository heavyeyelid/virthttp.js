module.exports = {
    arr2comma: function (arr) {
        let str = '';
        let bFirst = true;
        arr.forEach((row) => {
            if (!bFirst)
                str += ',';
            str += row;
        })
        return str;
    }
}
