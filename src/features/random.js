function cheer() {
    let replies = [
        "YAYYY!!",
        "YEAH I KNOW IM SMART",
        "WOOHOO!",
        "OWH REALLY?!",
        "THANK YOU DAD!!"
    ];

    let randomIndex = Math.floor(Math.random() * replies.length); // return a random number between 0 and 4
    return replies[randomIndex];
}

function waitingForGemini() {
    let replies = [
        "umm rudury don't know this, lemme ask Gemini",
        "YEAH I KNOW THIS! The answer is...",
        "*pssttt gemini, help me out here*",
        "*thinking*",
        "don't worry, rudory got this!"
    ];

    let randomIndex = Math.floor(Math.random() * replies.length); // return a random number between 0 and 4
    return replies[randomIndex];
}

module.exports = { cheer, waitingForGemini };