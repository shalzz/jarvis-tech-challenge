module.exports = async promise => {
  try {
    await promise;
    assert.fail('assert failed while expecting function to re_vert');
  } catch (error) {
    const revertFound = error.message.search('revert') >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
};
