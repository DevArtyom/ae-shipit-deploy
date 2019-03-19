var utils = require('shipit-utils');
var path = require('path2/posix');
var chalk = require('chalk');
var _ = require('lodash');

/**
 * Build task.
 * - Install dependencies.
 * - Build mobile version.
 * - Build desktop version.
 */

module.exports = function (gruntOrShipit) {
  utils.registerTask(gruntOrShipit, 'deploy:build', task);

  function task() {
    var shipit = utils.getShipit(gruntOrShipit);
    _.assign(shipit.constructor.prototype, require('../../lib/shipit'));

    return installDependencies()
      .then(buildMobile)
      .then(buildDesktop)
      .then(function () {
        shipit.emit('built');
      });

    /**
     * Install dependencies.
     */

    function installDependencies() {
      var relativeReleasePath = path.join('releases', shipit.releaseDirname);

      return shipit.remote('cd ' + shipit.config.deployTo + '/' + relativeReleasePath + ' && npm install')
        .then(function () {
          shipit.log(chalk.green('Dependencies installed.'));
        });
    }

    /**
     * Build mobile version.
     */

    function buildMobile() {
      var relativeReleasePath = path.join('releases', shipit.releaseDirname);

      return shipit.remote('cd ' + shipit.config.deployTo + '/' + relativeReleasePath + ' && npm run build-mobile-' + shipit.environment)
        .then(function () {
          shipit.log(chalk.green('Mobile version is built.'));
        });
    }

    /**
     * Build desktop version.
     */

    function buildDesktop() {
      var relativeReleasePath = path.join('releases', shipit.releaseDirname);

      return shipit.remote('cd ' + shipit.config.deployTo + '/' + relativeReleasePath + ' && npm run build-desktop-' + shipit.environment)
        .then(function () {
          shipit.log(chalk.green('Desktop version is built.'));
        });
    }
  }
};
