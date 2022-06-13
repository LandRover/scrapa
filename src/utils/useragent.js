import * as randomUseragent from 'random-useragent';

const getUserAgentRandom = function() {
    return randomUseragent.getRandom();
}

export default {
    getUserAgentRandom
};