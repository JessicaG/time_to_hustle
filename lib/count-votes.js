function countVotes(poll) {
var voteCount = {};
  poll['votes'].forEach(function(vote){
    if(voteCount[vote]){
      voteCount[vote]++;
    } else {
      voteCount[vote] = 1;
    }
  });
  return voteCount;
}
module.exports = countVotes;