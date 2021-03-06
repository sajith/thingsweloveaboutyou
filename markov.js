function markov(things) {

    var allwords = [];
    var allnames = [];
    for (var i = 0; i < things.length; i++) {
        // Remove the name at the end of the thing
        var re = /(\([^)]+\))$/;
        var matches = re.exec(things[i]);
        allnames = allnames.concat(matches[1]);
        var thing = things[i].replace(matches[1], "");
        var words = thing.split(' ');
        words.pop(); // last element is an empty string
        allwords = allwords.concat(words);
    }
    
    return makeMarkovText(allwords, allnames);
}

function myInsert(table, index, value) {

    if (!(table[index])) {
        table[index] = [value];
    } else {
        table[index].push(value);
    }
}

function cleanup(string, name) {

    // remove everything after the last period
    var re = /\.([^.]+)$/;
    var matches = re.exec(string);

    if (matches == null) {
        // no periods in string
        console.log(string);
        string = string + ".";
    } else {
        string = string.replace(matches[1], "");
    }

    // FIXME: I don't think these are actually working
    // remove stray parens
    string = string.replace('(','');
    string = string.replace(')','');
    // replace double periods with single ones
    string = string.replace('..','.');

    return string + " " + name;
}

function makeMarkovText(words, names) {

    var MAXLENGTH = 20
    var NOWORD = "NOWORD"

    // pick a name
    var index = Math.floor(Math.random() * names.length);
    var name = names[index];

    // create table
    var table = {};
    var w = NOWORD;
    for (var i = 0; i < words.length; i++) {
        myInsert(table, w, words[i]);
        w = words[i];
    }
    myInsert(table, w, NOWORD);

    // generate text
    outputString = "";
    w = NOWORD

    for (var i = 0; i < MAXLENGTH; i++) {
        var list = table[w];

        var index = Math.floor(Math.random() * list.length);
        var nextword = list[index];

        if (nextword == NOWORD) {
            return cleanup(outputString, name);
        }

        outputString = outputString + " " + nextword;
        w = nextword;
    }

    return cleanup(outputString, name);
}
