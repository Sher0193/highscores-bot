const getValidSkills = () => {
  return [
    'overall',
    'attack',
    'defence',
    'strength',
    'hitpoints',
    'ranged',
    'prayer',
    'magic',
    'cooking',
    'woodcutting',
    'fletching',
    'fishing',
    'firemaking',
    'crafting',
    'smithing',
    'mining',
    'herblore',
    'agility',
    'thieving',
    'slayer',
    'farming',
    'runecrafting',
    'hunter',
    'construction',
  ];
};

const levDist = function(s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}

const levRatio = function(s, t) {

    return (levDist(s, t) / t.length);
    
}

const ordinal = function (n) {
    
    var string = "";
    var sigDigit = n % 10;
    var postfix = sigDigit === 1 && n % 100 != 11 ? "st" : sigDigit === 2 && n % 100 != 12 ? "nd" : sigDigit === 3 && n % 100 != 13 ? "rd" : "th";
    string = n + postfix;
    return string;
    
}

const equate = function(xp){
    return Math.floor(xp + 300 * Math.pow(2, xp / 7));
};
 
const level_to_xp = function(level){
    var xp = 0;

    for (var i = 1; i < level; i++)
        xp += equate(i);

    return Math.floor(xp / 4);
};

const xp_to_level = function(xp){
    var level = 1;

    while (level_to_xp(level) < xp)
        level++;

    return level >= 99 ? 99 : level - 1;
};

exports.xp_to_level = xp_to_level;
exports.getValidSkills = getValidSkills;
exports.levRatio = levRatio;
exports.ordinal = ordinal;
exports.levDist = levDist;
