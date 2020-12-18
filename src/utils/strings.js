const sanitize = function(str) {

    return str
        .replace(/ ?(\/|:) /g, ' - ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();

}


module.exports = {
    sanitize
};