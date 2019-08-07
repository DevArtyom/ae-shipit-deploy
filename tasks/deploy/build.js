var utils = require('shipit-utils');
var path = require('path2/posix');
var chalk = require('chalk');
var _ = require('lodash');

/**
 * Build task.
 * - Install dependencies.
 * - Build.
 */

module.exports = function (gruntOrShipit) {
  utils.registerTask(gruntOrShipit, 'deploy:build', task);

  function task() {
    var shipit = utils.getShipit(gruntOrShipit);
    _.assign(shipit.constructor.prototype, require('../../lib/shipit'));

    return installDependencies()
      .then(build)
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
     * Build.
     */

    function build() {
      var relativeReleasePath = path.join('releases', shipit.releaseDirname);

      if (process.env.CLIENT) {
        return shipit.remote('cd ' + shipit.config.deployTo + '/' + relativeReleasePath + ` && NODE_ENV=production CLIENT=${process.env.CLIENT} node_modules/nuxt/bin/nuxt build --no-lock`)
          .then(function () {
            shipit.log(chalk.green('App has been built.'));
          });
      } else {
        return shipit.remote('cd ' + shipit.config.deployTo + '/' + relativeReleasePath + ' && npm run build-' + shipit.environment)
          .then(function () {
            shipit.log(chalk.green('App has been built.'));
          });
      }
    }
  }
};
