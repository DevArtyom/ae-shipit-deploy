var utils = require('shipit-utils');
var path = require('path2/posix');

/**
 * Clean task.
 * - Remove old releases.
 */

module.exports = function (gruntOrShipit) {
  utils.registerTask(gruntOrShipit, 'deploy:clean', task);

  function task() {
    var shipit = utils.getShipit(gruntOrShipit);

    return cleanOldReleases()
      .then(cleanNodeModules)
      .then(function () {
        shipit.emit('cleaned');
      });

    /**
     * Remove old releases.
     */

    function cleanOldReleases() {
      shipit.log('Keeping "%d" last releases, cleaning others', shipit.config.keepReleases);
      var command = '(ls -rd ' + shipit.releasesPath +
      '/*|head -n ' + shipit.config.keepReleases + ';ls -d ' + shipit.releasesPath +
      '/*)|sort|uniq -u|xargs rm -rf';
      return shipit.remote(command);
    }

    /**
     * Remove node_modules.
     */

    function cleanNodeModules() {
      shipit.log('Removing node_modules');
      var relativeReleasePath = path.join('releases', shipit.releaseDirname);
      var command = 'rm -rf ' + shipit.config.deployTo + '/' + relativeReleasePath + '/node_modules';
      return shipit.remote(command);
    }
  }
};
