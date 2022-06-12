const sanitize = function(str) {

    return str
        .replace(/ ?(\/|:) /g, ' - ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();

}


export default {
    sanitize
};