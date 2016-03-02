function countVotes(votes) {
var voteCount = {
    'This is old hat to me': 0,
    'I have an okay understanding of this': 0,
    'I have no idea what you are babbling about': 0
};
  for (var vote in votes) {
    voteCount[votes[vote]]++
  }
  return voteCount;
}
module.exports = countVotes;