function letterfinder(word, match){
    for (let i = 0; i < word.length; i++){
        if (word[i].toLowerCase() == match.toLowerCase()){
            console.log("Found", match, "at", i);
        }
        else{
            console.log("Did not find", match, "at", i);
        }
    }
}

letterfinder("My name is muhammad muzammil ALam", "m")